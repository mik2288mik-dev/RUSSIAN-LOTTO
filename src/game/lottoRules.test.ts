import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateBarrelDeck,
  drawNextBarrel,
  generateValidLottoCard,
  validateLottoCard,
  tapCardCell,
  expireBarrelMarkingWindow,
  removeMissedCrossWithCoins,
  checkCardWin,
  evaluateRoundWinners,
  BarrelQueueState,
} from './lottoRules';

test('Barrel deck contains 90 unique numbers from 1 to 90 and is deterministic with seed', () => {
  const deck1 = generateBarrelDeck(42);
  const deck2 = generateBarrelDeck(42);
  assert.equal(deck1.length, 90);
  assert.deepEqual(deck1, deck2);

  const unique = new Set(deck1);
  assert.equal(unique.size, 90);
  for (let n = 1; n <= 90; n++) {
    assert.equal(unique.has(n), true);
  }
});

test('Barrel queue keeps 5 latest barrels and slides oldest off on 6th draw', () => {
  let state: BarrelQueueState = {
    visibleBarrels: [17, 63, 24, 21, 8],
    exitingBarrel: null,
    drawnHistory: [8, 21, 24, 63, 17],
    remainingDeck: [45, 90],
    activeWindowBarrels: [17],
  };

  const { drawnNumber, nextState } = drawNextBarrel(state);
  assert.equal(drawnNumber, 45);
  assert.deepEqual(nextState.visibleBarrels, [45, 17, 63, 24, 21]);
  assert.equal(nextState.exitingBarrel, 8);
  assert.equal(nextState.drawnHistory.length, 6);
  assert.equal(nextState.remainingDeck.length, 1);
});

test('Classic Russian Lotto card generator produces valid 3x9 cards with 5 numbers per row, 15 per card, ascending columns', () => {
  for (let i = 0; i < 30; i++) {
    const card = generateValidLottoCard(`card-${i}`, 1000 + i);
    const validation = validateLottoCard(card);
    assert.equal(
      validation.valid,
      true,
      `Card ${i} failed validation: ${validation.errors.join('; ')}`
    );
  }
});

test('Marking numbers and missed number X mechanic + 50 coin removal work accurately', () => {
  const card = generateValidLottoCard('c1', 777);
  // Find two numbers on the first row
  const row0Numbers = card.grid[0].filter((c) => c.number !== null);
  assert.equal(row0Numbers.length, 5);
  const firstCell = row0Numbers[0];
  const secondCell = row0Numbers[1];
  const num1 = firstCell.number!;
  const num2 = secondCell.number!;

  // Cannot mark undrawn number
  const tapUndrawn = tapCardCell([card], 'c1', firstCell.row, firstCell.col, [], [], false);
  assert.equal(tapUndrawn.marked, false);

  // Can mark active drawn number
  const tapActive = tapCardCell(
    [card],
    'c1',
    firstCell.row,
    firstCell.col,
    [num1],
    [num1],
    false
  );
  assert.equal(tapActive.marked, true);
  assert.equal(tapActive.updatedCards[0].grid[firstCell.row][firstCell.col].state, 'marked');

  // Cannot mark same cell twice
  const tapTwice = tapCardCell(
    tapActive.updatedCards,
    'c1',
    firstCell.row,
    firstCell.col,
    [num1],
    [num1],
    false
  );
  assert.equal(tapTwice.marked, false);

  // Expire marking window for num2 -> receives RED X ('missed')
  const expired = expireBarrelMarkingWindow(tapActive.updatedCards, num2);
  assert.equal(expired.missedCount, 1);
  assert.equal(
    expired.updatedCards[0].grid[secondCell.row][secondCell.col].state,
    'missed'
  );

  // Tapping a missed cell does not mark it for free, triggers hitMissedCell
  const tapMissed = tapCardCell(
    expired.updatedCards,
    'c1',
    secondCell.row,
    secondCell.col,
    [num2],
    [num1, num2],
    true
  );
  assert.equal(tapMissed.marked, false);
  assert.equal(tapMissed.hitMissedCell, true);

  // Removing missed X with insufficient coins fails
  const failFix = removeMissedCrossWithCoins({
    cards: expired.updatedCards,
    cardId: 'c1',
    row: secondCell.row,
    col: secondCell.col,
    coinBalance: 30,
    cost: 50,
  });
  assert.equal(failFix.success, false);
  assert.equal(failFix.reason, 'insufficient_funds');

  // Removing missed X with 50 coins deducts once and marks the cell
  const okFix = removeMissedCrossWithCoins({
    cards: expired.updatedCards,
    cardId: 'c1',
    row: secondCell.row,
    col: secondCell.col,
    coinBalance: 500,
    cost: 50,
  });
  assert.equal(okFix.success, true);
  assert.equal(okFix.newBalance, 450);
  assert.equal(
    okFix.updatedCards[0].grid[secondCell.row][secondCell.col].state,
    'marked'
  );

  // Attempting to charge a second time on already corrected cell fails
  const doubleCharge = removeMissedCrossWithCoins({
    cards: okFix.updatedCards,
    cardId: 'c1',
    row: secondCell.row,
    col: secondCell.col,
    coinBalance: okFix.newBalance,
    cost: 50,
  });
  assert.equal(doubleCharge.success, false);
  assert.equal(doubleCharge.newBalance, 450);
});

test('Short game and Full card victory detection work and missed X prevents row win until fixed', () => {
  const card = generateValidLottoCard('win-card', 123);
  const row0Cells = card.grid[0].filter((c) => c.number !== null);

  let cards = [card];
  // Mark first 4 numbers in row 0, miss 5th number
  for (let i = 0; i < 4; i++) {
    const cell = row0Cells[i];
    cards = tapCardCell(
      cards,
      'win-card',
      0,
      cell.col,
      [cell.number!],
      [cell.number!]
    ).updatedCards;
  }
  const fifthCell = row0Cells[4];
  cards = expireBarrelMarkingWindow(cards, fifthCell.number!).updatedCards;

  // Row has 4 marked + 1 missed -> not a win
  assert.equal(checkCardWin(cards[0], 'short').won, false);

  // Now player removes the red X for 50 coins -> completes row 0 -> wins immediately!
  const fixed = removeMissedCrossWithCoins({
    cards,
    cardId: 'win-card',
    row: 0,
    col: fifthCell.col,
    coinBalance: 200,
    cost: 50,
  });
  assert.equal(fixed.success, true);
  const winCheck = checkCardWin(fixed.updatedCards[0], 'short');
  assert.equal(winCheck.won, true);
  assert.equal(winCheck.winningRow, 0);

  const evalRes = evaluateRoundWinners(
    [
      { id: 'player', cards: fixed.updatedCards },
      { id: 'bot1', cards: [generateValidLottoCard('b1', 1)] },
      { id: 'bot2', cards: [generateValidLottoCard('b2', 2)] },
    ],
    'short',
    500
  );
  assert.equal(evalRes.hasWinner, true);
  assert.deepEqual(evalRes.winnerIds, ['player']);
  assert.equal(evalRes.payoutPerWinner, 1500);
});
