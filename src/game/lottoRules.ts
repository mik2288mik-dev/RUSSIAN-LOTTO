export type CellState = 'empty' | 'unmarked' | 'marked' | 'missed';

export interface LottoCell {
  row: number;
  col: number;
  number: number | null;
  state: CellState;
  drawnAtStep?: number;
}

export interface LottoCard {
  id: string;
  /** 3 rows x 9 columns */
  grid: LottoCell[][];
}

export type GameModeVariant = 'short' | 'full';

export type ParticipantCount = 3 | 5 | 7;

export type StakeAmount = 100 | 250 | 500 | 1000 | 2000 | 5000;

export interface BarrelQueueState {
  /** Up to 5 most recently drawn barrels (index 0 = newest, index 4 = oldest visible) */
  visibleBarrels: number[];
  /** Barrel that just slid off the 5-barrel queue on the latest draw */
  exitingBarrel: number | null;
  /** Complete history of all drawn barrels in order of draw */
  drawnHistory: number[];
  /** Remaining undrawn barrels in shuffled deck */
  remainingDeck: number[];
  /** Currently active barrels whose marking window has not expired yet */
  activeWindowBarrels: number[];
}

export interface FixMissedResult {
  success: boolean;
  reason?: 'not_missed' | 'insufficient_funds' | 'cell_not_found';
  newBalance: number;
  newBoostersCount: number;
  usedBooster: boolean;
  updatedCards: LottoCard[];
}

export interface WinnerEvaluation {
  hasWinner: boolean;
  winnerIds: string[];
  winningCardId?: string;
  winningRow?: number;
  payoutPerWinner: number;
}

/**
 * Deterministic seeded PRNG (Mulberry32)
 */
export function createSeededRng(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Column number ranges according to classic Russian Lotto rules:
 * Col 0 (1st): 1..9
 * Col 1 (2nd): 10..19
 * Col 2 (3rd): 20..29
 * Col 3 (4th): 30..39
 * Col 4 (5th): 40..49
 * Col 5 (6th): 50..59
 * Col 6 (7th): 60..69
 * Col 7 (8th): 70..79
 * Col 8 (9th): 80..90
 */
export function getColumnRange(colIndex: number): [number, number] {
  if (colIndex < 0 || colIndex > 8) {
    throw new Error(`Invalid column index: ${colIndex}`);
  }
  if (colIndex === 0) return [1, 9];
  if (colIndex === 8) return [80, 90];
  return [colIndex * 10, colIndex * 10 + 9];
}

/**
 * Generates a shuffled sequence of 90 unique wooden barrels (1..90).
 */
export function generateBarrelDeck(seed?: number): number[] {
  const rng = seed !== undefined ? createSeededRng(seed) : Math.random;
  const deck = Array.from({ length: 90 }, (_, i) => i + 1);
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = deck[i];
    deck[i] = deck[j];
    deck[j] = tmp;
  }
  return deck;
}

/**
 * Advances the barrel queue by drawing the next barrel from remainingDeck.
 * Preserves the exact 5-barrel sliding table behavior:
 * Newest barrel at index 0, previous barrels shift right, 6th barrel becomes exitingBarrel.
 */
export function drawNextBarrel(state: BarrelQueueState): {
  drawnNumber: number | null;
  nextState: BarrelQueueState;
} {
  if (state.remainingDeck.length === 0) {
    return { drawnNumber: null, nextState: state };
  }
  const [drawnNumber, ...restDeck] = state.remainingDeck;
  const nextVisible = [drawnNumber, ...state.visibleBarrels];
  let exitingBarrel: number | null = null;
  if (nextVisible.length > 5) {
    exitingBarrel = nextVisible.pop() ?? null;
  }
  return {
    drawnNumber,
    nextState: {
      visibleBarrels: nextVisible,
      exitingBarrel,
      drawnHistory: [...state.drawnHistory, drawnNumber],
      remainingDeck: restDeck,
      activeWindowBarrels: [...state.activeWindowBarrels, drawnNumber],
    },
  };
}

/**
 * Generates a valid classic Russian Lotto card:
 * - 3 rows x 9 columns
 * - Exactly 5 numbers per row (4 empty cells per row)
 * - 15 unique numbers per card
 * - Column ranges: 1-9, 10-19, ..., 80-90
 * - Ascending order from top to bottom within each column
 * - Every column has at least 1 number and at most 2-3 numbers
 */
export function generateValidLottoCard(id: string, seed?: number): LottoCard {
  const rng = seed !== undefined ? createSeededRng(seed) : Math.random;

  // We need a 3x9 occupancy matrix where:
  // - Each row has sum = 5 (total 15)
  // - Each column has sum in [1, 3]
  let occupancy: boolean[][] = [
    Array(9).fill(false),
    Array(9).fill(false),
    Array(9).fill(false),
  ];

  let validMatrix = false;
  for (let attempt = 0; attempt < 200; attempt++) {
    occupancy = [
      Array(9).fill(false),
      Array(9).fill(false),
      Array(9).fill(false),
    ];

    // Step 1: Decide column counts: 9 columns summing to 15, each at least 1 and at most 2 (or 3).
    // Putting 1 in all 9 columns leaves 6 more slots to distribute across 9 columns (max +2 per col).
    const colCounts = Array(9).fill(1);
    let remainingSlots = 6;
    while (remainingSlots > 0) {
      const c = Math.floor(rng() * 9);
      if (colCounts[c] < 2) {
        colCounts[c]++;
        remainingSlots--;
      }
    }

    // Now assign rows for each column to satisfy row sums = 5
    const rowCounts = [0, 0, 0];
    const colsOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8].sort(() => rng() - 0.5);

    // First place columns with 2 items, then columns with 1 item
    colsOrder.sort((a, b) => colCounts[b] - colCounts[a]);

    let possible = true;
    for (const c of colsOrder) {
      const count = colCounts[c];
      // Pick `count` rows that currently have < 5 items, preferring rows with fewer items
      const availableRows = [0, 1, 2]
        .filter((r) => rowCounts[r] < 5)
        .sort((a, b) => rowCounts[a] - rowCounts[b] || rng() - 0.5);

      if (availableRows.length < count) {
        possible = false;
        break;
      }
      for (let k = 0; k < count; k++) {
        const chosenRow = availableRows[k];
        occupancy[chosenRow][c] = true;
        rowCounts[chosenRow]++;
      }
    }

    if (
      possible &&
      rowCounts[0] === 5 &&
      rowCounts[1] === 5 &&
      rowCounts[2] === 5
    ) {
      validMatrix = true;
      break;
    }
  }

  if (!validMatrix) {
    // Deterministic valid fallback pattern if random retries ever miss
    const fallbackPattern = [
      [1, 0, 1, 0, 1, 0, 1, 0, 1],
      [0, 1, 1, 1, 0, 1, 0, 1, 0],
      [1, 1, 0, 1, 0, 1, 0, 0, 1],
    ];
    occupancy = fallbackPattern.map((row) => row.map((v) => v === 1));
  }

  // Step 2: Populate numbers per column in strictly ascending top-to-bottom order
  const colNumbers: (number | null)[][] = Array.from({ length: 9 }, () => [
    null,
    null,
    null,
  ]);

  for (let c = 0; c < 9; c++) {
    const [min, max] = getColumnRange(c);
    const pool: number[] = [];
    for (let n = min; n <= max; n++) {
      pool.push(n);
    }
    // Shuffle pool
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      const tmp = pool[i];
      pool[i] = pool[j];
      pool[j] = tmp;
    }

    const activeRows = [0, 1, 2].filter((r) => occupancy[r][c]);
    const picked = pool.slice(0, activeRows.length).sort((a, b) => a - b);
    activeRows.forEach((r, idx) => {
      colNumbers[c][r] = picked[idx];
    });
  }

  const grid: LottoCell[][] = [0, 1, 2].map((r) =>
    Array.from({ length: 9 }, (_, c) => {
      const num = colNumbers[c][r];
      return {
        row: r,
        col: c,
        number: num,
        state: num !== null ? 'unmarked' : 'empty',
      };
    })
  );

  return { id, grid };
}

/**
 * Validates that a card satisfies all classic Russian Lotto rules.
 */
export function validateLottoCard(card: LottoCard): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  if (card.grid.length !== 3) {
    errors.push(`Expected 3 rows, got ${card.grid.length}`);
    return { valid: false, errors };
  }

  const seenNumbers = new Set<number>();
  let totalNumbers = 0;

  for (let r = 0; r < 3; r++) {
    const row = card.grid[r];
    if (row.length !== 9) {
      errors.push(`Row ${r} expected 9 columns, got ${row.length}`);
      continue;
    }
    let rowCount = 0;
    for (let c = 0; c < 9; c++) {
      const cell = row[c];
      if (cell.number !== null) {
        rowCount++;
        totalNumbers++;
        if (seenNumbers.has(cell.number)) {
          errors.push(`Duplicate number ${cell.number} on card`);
        }
        seenNumbers.add(cell.number);

        const [min, max] = getColumnRange(c);
        if (cell.number < min || cell.number > max) {
          errors.push(
            `Number ${cell.number} in col ${c} outside valid range [${min}, ${max}]`
          );
        }
      }
    }
    if (rowCount !== 5) {
      errors.push(`Row ${r} expected 5 numbers, got ${rowCount}`);
    }
  }

  if (totalNumbers !== 15) {
    errors.push(`Expected 15 total numbers on card, got ${totalNumbers}`);
  }

  // Verify ascending order top-to-bottom within each column
  for (let c = 0; c < 9; c++) {
    let prev = -1;
    for (let r = 0; r < 3; r++) {
      const num = card.grid[r][c].number;
      if (num !== null) {
        if (num <= prev) {
          errors.push(
            `Column ${c} numbers not strictly ascending top-to-bottom (${prev} then ${num})`
          );
        }
        prev = num;
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Attempts to mark a cell on a player's card when tapped.
 * Rules:
 * - Empty cells cannot be marked.
 * - Numbers not yet drawn (or not in activeWindowBarrels / drawnHistory) cannot be marked.
 * - Cells already marked or missed with a red X cannot be marked by a free tap.
 */
export function tapCardCell(
  cards: LottoCard[],
  cardId: string,
  row: number,
  col: number,
  activeWindowBarrels: number[],
  drawnHistory: number[],
  allowAnyDrawnIfWindowActive = true
): {
  marked: boolean;
  hitMissedCell: boolean;
  number: number | null;
  updatedCards: LottoCard[];
} {
  const targetCard = cards.find((c) => c.id === cardId);
  if (!targetCard) {
    return { marked: false, hitMissedCell: false, number: null, updatedCards: cards };
  }
  const cell = targetCard.grid[row]?.[col];
  if (!cell || cell.number === null) {
    return { marked: false, hitMissedCell: false, number: null, updatedCards: cards };
  }

  if (cell.state === 'missed') {
    return {
      marked: false,
      hitMissedCell: true,
      number: cell.number,
      updatedCards: cards,
    };
  }

  if (cell.state === 'marked') {
    return {
      marked: false,
      hitMissedCell: false,
      number: cell.number,
      updatedCards: cards,
    };
  }

  const canMark = allowAnyDrawnIfWindowActive
    ? activeWindowBarrels.includes(cell.number) || drawnHistory.includes(cell.number)
    : activeWindowBarrels.includes(cell.number);

  if (!canMark) {
    return {
      marked: false,
      hitMissedCell: false,
      number: cell.number,
      updatedCards: cards,
    };
  }

  const updatedCards = cards.map((card) => {
    if (card.id !== cardId) return card;
    return {
      ...card,
      grid: card.grid.map((r, rIdx) =>
        rIdx !== row
          ? r
          : r.map((c, cIdx) =>
              cIdx !== col ? c : { ...c, state: 'marked' as CellState }
            )
      ),
    };
  });

  return {
    marked: true,
    hitMissedCell: false,
    number: cell.number,
    updatedCards,
  };
}

/**
 * Expires the marking window for a specific drawn barrel number.
 * Any cell across the player's 3 cards that matches `expiredNumber` and is still `'unmarked'`
 * receives `'missed'` (RED X). Each card cell is evaluated individually.
 */
export function expireBarrelMarkingWindow(
  cards: LottoCard[],
  expiredNumber: number
): {
  missedCount: number;
  updatedCards: LottoCard[];
} {
  let missedCount = 0;
  const updatedCards = cards.map((card) => ({
    ...card,
    grid: card.grid.map((row) =>
      row.map((cell) => {
        if (cell.number === expiredNumber && cell.state === 'unmarked') {
          missedCount++;
          return { ...cell, state: 'missed' as CellState };
        }
        return cell;
      })
    ),
  }));

  return { missedCount, updatedCards };
}

/**
 * Removes a missed red X on a specific card cell using virtual coins (default 50) or a booster.
 * Never charges twice for the same correction.
 */
export function removeMissedCrossWithCoins(params: {
  cards: LottoCard[];
  cardId: string;
  row: number;
  col: number;
  coinBalance: number;
  cost?: number;
  boostersCount?: number;
  preferBooster?: boolean;
}): FixMissedResult {
  const {
    cards,
    cardId,
    row,
    col,
    coinBalance,
    cost = 50,
    boostersCount = 0,
    preferBooster = false,
  } = params;

  const targetCard = cards.find((c) => c.id === cardId);
  const cell = targetCard?.grid[row]?.[col];
  if (!targetCard || !cell) {
    return {
      success: false,
      reason: 'cell_not_found',
      newBalance: coinBalance,
      newBoostersCount: boostersCount,
      usedBooster: false,
      updatedCards: cards,
    };
  }

  if (cell.state !== 'missed') {
    return {
      success: false,
      reason: 'not_missed',
      newBalance: coinBalance,
      newBoostersCount: boostersCount,
      usedBooster: false,
      updatedCards: cards,
    };
  }

  const useBooster = preferBooster && boostersCount > 0;
  if (!useBooster && coinBalance < cost) {
    return {
      success: false,
      reason: 'insufficient_funds',
      newBalance: coinBalance,
      newBoostersCount: boostersCount,
      usedBooster: false,
      updatedCards: cards,
    };
  }

  const updatedCards = cards.map((card) => {
    if (card.id !== cardId) return card;
    return {
      ...card,
      grid: card.grid.map((r, rIdx) =>
        rIdx !== row
          ? r
          : r.map((c, cIdx) =>
              cIdx !== col ? c : { ...c, state: 'marked' as CellState }
            )
      ),
    };
  });

  return {
    success: true,
    newBalance: useBooster ? coinBalance : coinBalance - cost,
    newBoostersCount: useBooster ? boostersCount - 1 : boostersCount,
    usedBooster: useBooster,
    updatedCards,
  };
}

/**
 * Checks if a single card has completed a winning combination.
 * - 'short': all 5 numbers in any horizontal row are 'marked' (not 'missed' or 'unmarked')
 * - 'full': all 15 numbers on the card are 'marked'
 */
export function checkCardWin(
  card: LottoCard,
  mode: GameModeVariant
): { won: boolean; winningRow?: number } {
  if (mode === 'short') {
    for (let r = 0; r < 3; r++) {
      const numberedCells = card.grid[r].filter((c) => c.number !== null);
      if (
        numberedCells.length === 5 &&
        numberedCells.every((c) => c.state === 'marked')
      ) {
        return { won: true, winningRow: r };
      }
    }
    return { won: false };
  }

  // Full card mode: all 15 numbered cells must be 'marked'
  let markedCount = 0;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 9; c++) {
      const cell = card.grid[r][c];
      if (cell.number !== null) {
        if (cell.state !== 'marked') {
          return { won: false };
        }
        markedCount++;
      }
    }
  }
  return { won: markedCount === 15 };
}

/**
 * Evaluates all participants (human + bots) to automatically detect completed winning combinations.
 */
export function evaluateRoundWinners(
  participants: { id: string; cards: LottoCard[] }[],
  mode: GameModeVariant,
  stake: number
): WinnerEvaluation {
  const winnerIds: string[] = [];
  let winningCardId: string | undefined;
  let winningRow: number | undefined;

  for (const p of participants) {
    for (const card of p.cards) {
      const res = checkCardWin(card, mode);
      if (res.won) {
        winnerIds.push(p.id);
        if (!winningCardId) {
          winningCardId = card.id;
          winningRow = res.winningRow;
        }
        break;
      }
    }
  }

  if (winnerIds.length === 0) {
    return {
      hasWinner: false,
      winnerIds: [],
      payoutPerWinner: 0,
    };
  }

  const totalPot = participants.length * stake;
  const payoutPerWinner = Math.floor(totalPot / winnerIds.length);

  return {
    hasWinner: true,
    winnerIds,
    winningCardId,
    winningRow,
    payoutPerWinner,
  };
}
