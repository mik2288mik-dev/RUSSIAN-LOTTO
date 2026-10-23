/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  BarrelQueueState,
  drawNextBarrel,
  evaluateRoundWinners,
  expireBarrelMarkingWindow,
  GameModeVariant,
  generateBarrelDeck,
  generateValidLottoCard,
  LottoCard,
  LottoCell,
  ParticipantCount,
  removeMissedCrossWithCoins,
  StakeAmount,
  tapCardCell,
} from './game/lottoRules';
import { soundEngine } from './game/soundEngine';
import {
  FriendProfile,
  FrameStyleId,
  INITIAL_FRIENDS,
  INITIAL_QUESTS,
  INITIAL_TOURNAMENTS,
  QuestItem,
  STORE_BOOSTERS,
  STORE_DECORATIONS,
  STORE_EMOJI_PACKS,
  STORE_PHRASES,
  TournamentItem,
} from './game/storeAndSocialData';
import { HostessAnimState } from './components/FolkVisuals';
import {
  MainLobbyScreen,
  WelcomeScreen,
} from './components/WelcomeAndLobbyScreens';
import {
  FriendsScreen,
  GameSetupScreen,
  StoreScreen,
} from './components/SetupStoreFriendsScreens';
import {
  GameplayScreen,
  VictoryScreen,
} from './components/GameplayAndVictoryScreens';
import {
  DailyBonusModal,
  HowToPlayModal,
  QuestsModal,
  SettingsAndAuthModal,
  TournamentsModal,
} from './components/GameModals';
import { AndroidProjectModal } from './components/AndroidProjectModal';

export type AppScreenId =
  | 'welcome'
  | 'lobby'
  | 'setup'
  | 'store'
  | 'friends'
  | 'gameplay'
  | 'victory';

const STORAGE_KEY = 'russkoe_loto_save_v1';

interface SavedProgress {
  playerName: string;
  coinBalance: number;
  ownedIds: string[];
  equippedFrame: FrameStyleId;
  equippedTitle: string;
  isVip: boolean;
  crossRemoverBoosters: number;
  dailyBonusClaimedDate: string | null;
  streakDay: number;
}

function loadSavedProgress(): SavedProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore storage errors
  }
  return {
    playerName: 'Алексей',
    coinBalance: 12450,
    ownedIds: ['phrase_cool', 'phrase_thanks', 'phrase_hello', 'emojis_russian'],
    equippedFrame: 'vip_gold',
    equippedTitle: 'VIP',
    isVip: true,
    crossRemoverBoosters: 1,
    dailyBonusClaimedDate: null,
    streakDay: 3,
  };
}

export default function App() {
  const initialSave = loadSavedProgress();

  // Check ?autostart=1 query param
  const isAutostart =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('autostart') === '1';

  const [screen, setScreen] = useState<AppScreenId>(
    isAutostart ? 'lobby' : 'welcome'
  );

  // Player Persistent Economy & Profile State
  const [playerName, setPlayerName] = useState<string>(initialSave.playerName);
  const [coinBalance, setCoinBalance] = useState<number>(initialSave.coinBalance);
  const [ownedIds, setOwnedIds] = useState<string[]>(initialSave.ownedIds);
  const [equippedFrame, setEquippedFrame] = useState<FrameStyleId>(
    initialSave.equippedFrame
  );
  const [equippedTitle, setEquippedTitle] = useState<string>(
    initialSave.equippedTitle
  );
  const [isVip, setIsVip] = useState<boolean>(initialSave.isVip);
  const [crossRemoverBoosters, setCrossRemoverBoosters] = useState<number>(
    initialSave.crossRemoverBoosters
  );
  const [dailyBonusClaimedDate, setDailyBonusClaimedDate] = useState<
    string | null
  >(initialSave.dailyBonusClaimedDate);
  const [streakDay, setStreakDay] = useState<number>(initialSave.streakDay);

  // Social, Quests & Tournaments State
  const [friends, setFriends] = useState<FriendProfile[]>(INITIAL_FRIENDS);
  const [quests, setQuests] = useState<QuestItem[]>(INITIAL_QUESTS);
  const [tournaments, setTournaments] =
    useState<TournamentItem[]>(INITIAL_TOURNAMENTS);

  // Audio & Gameplay Settings
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [markingWindowSec, setMarkingWindowSec] = useState<number>(7);

  // Modals State
  const [showHowToModal, setShowHowToModal] = useState<boolean>(false);
  const [showDailyBonusModal, setShowDailyBonusModal] = useState<boolean>(false);
  const [showQuestsModal, setShowQuestsModal] = useState<boolean>(false);
  const [showTournamentsModal, setShowTournamentsModal] =
    useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showAndroidModal, setShowAndroidModal] = useState<boolean>(false);
  const [storeInitialTab, setStoreInitialTab] = useState<
    'coins' | 'decorations' | 'phrases' | 'emojis' | 'boosters'
  >('coins');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Pre-Game Setup State (Screen 3)
  const [participantsCount, setParticipantsCount] =
    useState<ParticipantCount>(5);
  const [stake, setStake] = useState<StakeAmount>(500);
  const [gameMode, setGameMode] = useState<GameModeVariant>('short');
  const [isPrivateTable, setIsPrivateTable] = useState<boolean>(false);
  const [privateRoomCode, setPrivateRoomCode] = useState<string | null>(null);

  const [candidateCards, setCandidateCards] = useState<LottoCard[]>(() =>
    Array.from({ length: 6 }, (_, idx) =>
      generateValidLottoCard(`card-${idx + 1}`, 2026 + idx * 17)
    )
  );
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([
    'card-1',
    'card-4',
    'card-5',
  ]);

  // Active Match State (Screen 6 & Screen 7)
  const [playerCards, setPlayerCards] = useState<LottoCard[]>([]);
  const [botParticipants, setBotParticipants] = useState<
    { id: string; profile: FriendProfile; cards: LottoCard[] }[]
  >([]);
  const [barrelQueue, setBarrelQueue] = useState<BarrelQueueState>({
    visibleBarrels: [],
    exitingBarrel: null,
    drawnHistory: [],
    remainingDeck: [],
    activeWindowBarrels: [],
  });
  const [hostessState, setHostessState] = useState<HostessAnimState>('Idle');
  const [currentShownBarrel, setCurrentShownBarrel] = useState<number | null>(
    null
  );
  const [activePopupCell, setActivePopupCell] = useState<{
    cardId: string;
    row: number;
    col: number;
  } | null>(null);
  const [opponentReactions, setOpponentReactions] = useState<
    Record<string, { emoji?: string; phrase?: string }>
  >({});
  const [playerReaction, setPlayerReaction] = useState<{
    emoji?: string;
    phrase?: string;
  } | null>(null);

  // Victory State (Screen 7)
  const [roundVictoryInfo, setRoundVictoryInfo] = useState<{
    payoutCoins: number;
    winnerNames: string[];
    playerWon: boolean;
    rewardClaimed: boolean;
  } | null>(null);

  const stakeDeductedForRoundRef = useRef<boolean>(false);

  // Sync body dataset state for testing & game shell compliance
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.dataset.state =
        screen === 'welcome'
          ? 'title'
          : screen === 'victory'
          ? 'gameover'
          : 'playing';
      document.body.dataset.screen = screen;
    }
  }, [screen]);

  // Persist economy and profile state
  useEffect(() => {
    try {
      const save: SavedProgress = {
        playerName,
        coinBalance,
        ownedIds,
        equippedFrame,
        equippedTitle,
        isVip,
        crossRemoverBoosters,
        dailyBonusClaimedDate,
        streakDay,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
    } catch {
      // ignore storage errors
    }
  }, [
    playerName,
    coinBalance,
    ownedIds,
    equippedFrame,
    equippedTitle,
    isVip,
    crossRemoverBoosters,
    dailyBonusClaimedDate,
    streakDay,
  ]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2400);
  }, []);

  // Keyboard shortcut on Welcome Screen (Enter / Space -> Play)
  useEffect(() => {
    if (screen !== 'welcome') return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setScreen('lobby');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [screen]);

  const todayKey = new Date().toISOString().slice(0, 10);
  const dailyBonusAvailable = dailyBonusClaimedDate !== todayKey;
  const unclaimedQuestsCount = quests.filter(
    (q) => q.progress >= q.target && !q.claimed
  ).length;

  // Reroll 6 candidate cards on Screen 3
  const handleRerollCandidateCards = () => {
    soundEngine.playButtonClick();
    const baseSeed = Date.now() % 100000;
    const nextCards = Array.from({ length: 6 }, (_, idx) =>
      generateValidLottoCard(`card-${idx + 1}`, baseSeed + idx * 31)
    );
    setCandidateCards(nextCards);
    setSelectedCardIds([nextCards[0].id, nextCards[1].id, nextCards[2].id]);
  };

  // Toggle selection of 3 cards out of 6 on Screen 3
  const handleToggleCardSelection = (cardId: string) => {
    soundEngine.playButtonClick();
    setSelectedCardIds((prev) => {
      if (prev.includes(cardId)) {
        return prev.filter((id) => id !== cardId);
      }
      if (prev.length >= 3) {
        // Replace oldest selected card so selecting a new card is effortless
        return [...prev.slice(1), cardId];
      }
      return [...prev, cardId];
    });
  };

  // Start a Russian Lotto Match from Screen 3
  const handleStartMatch = () => {
    if (selectedCardIds.length !== 3) {
      showToast('Выберите ровно 3 карточки для начала игры!');
      return;
    }
    if (coinBalance < stake) {
      showToast('Недостаточно монет для выбранной ставки!');
      return;
    }

    soundEngine.playCoinChime();

    // Deduct stake atomically once per round
    stakeDeductedForRoundRef.current = true;
    setCoinBalance((b) => b - stake);

    // Prepare player's 3 chosen cards (clean unmarked clone)
    const chosenCards: LottoCard[] = candidateCards
      .filter((c) => selectedCardIds.includes(c.id))
      .slice(0, 3)
      .map((card) => ({
        id: card.id,
        grid: card.grid.map((row) =>
          row.map((cell) => ({
            ...cell,
            state: cell.number !== null ? 'unmarked' : 'empty',
          }))
        ),
      }));

    // Prepare bots (2, 4, or 6 opponents depending on 3, 5, or 7 participants)
    const extraBotProfiles: FriendProfile[] = [
      ...friends,
      {
        id: 'friend_marina',
        name: 'Марина',
        rating: '64K',
        ratingNum: 64000,
        status: 'online',
        statusLabel: 'Онлайн',
        avatarKey: 'katya',
        frame: 'chamomile',
        isFriend: false,
      },
    ];

    const numBots = participantsCount - 1;
    const bots = extraBotProfiles.slice(0, numBots).map((prof, bIdx) => ({
      id: prof.id,
      profile: prof,
      cards: [
        generateValidLottoCard(`bot-${bIdx}-c1`, 5000 + bIdx * 11),
        generateValidLottoCard(`bot-${bIdx}-c2`, 6000 + bIdx * 13),
        generateValidLottoCard(`bot-${bIdx}-c3`, 7000 + bIdx * 17),
      ],
    }));

    // Build 90-barrel deck:
    // Ensure a couple of numbers from the player's cards appear early so the player
    // can immediately experience tapping drawn numbers and testing the missed-X mechanic,
    // while keeping all 90 numbers unique!
    const rawDeck = generateBarrelDeck();
    const playerNumbers: number[] = [];
    chosenCards.forEach((c) =>
      c.grid.forEach((r) =>
        r.forEach((cell) => {
          if (cell.number !== null) playerNumbers.push(cell.number);
        })
      )
    );

    const earlyPicks = playerNumbers.slice(0, 3);
    const restOfDeck = rawDeck.filter((n) => !earlyPicks.includes(n));
    const fullDeck = [
      earlyPicks[0],
      restOfDeck[0],
      earlyPicks[1],
      restOfDeck[1],
      earlyPicks[2],
      ...restOfDeck.slice(2),
    ];

    // Pre-draw the initial 5 barrels onto the wooden table (matching Reference Image 6):
    // Make the oldest of the initial 5 barrels already expired into a red X on the player's card
    // so the player can immediately see both active tappable barrels AND a red X that can be removed for 50 coins!
    let qState: BarrelQueueState = {
      visibleBarrels: [],
      exitingBarrel: null,
      drawnHistory: [],
      remainingDeck: fullDeck,
      activeWindowBarrels: [],
    };

    for (let i = 0; i < 5; i++) {
      qState = drawNextBarrel(qState).nextState;
    }

    // Expire the earliest drawn barrel (earlyPicks[0]) so there is an immediate example of a missed red X,
    // pre-mark earlyPicks[1] with a red token so the player sees how red tokens look (matching Reference 6),
    // and keep earlyPicks[2] unmarked in the active window so the player can tap it immediately!
    const earliestBarrel = fullDeck[0];
    let initialCards = expireBarrelMarkingWindow(
      chosenCards,
      earliestBarrel
    ).updatedCards;

    // Pre-mark earlyPicks[1] on the first card
    const secondPick = earlyPicks[1];
    initialCards = initialCards.map((card, cIdx) =>
      cIdx !== 0
        ? card
        : {
            ...card,
            grid: card.grid.map((row) =>
              row.map((cell) =>
                cell.number === secondPick
                  ? { ...cell, state: 'marked' }
                  : cell
              )
            ),
          }
    );

    qState.activeWindowBarrels = qState.activeWindowBarrels.filter(
      (b) => b !== earliestBarrel
    );

    setPlayerCards(initialCards);
    setBotParticipants(bots);
    setBarrelQueue(qState);
    setCurrentShownBarrel(qState.visibleBarrels[0] ?? null);
    setHostessState('Idle');
    setActivePopupCell(null);
    setRoundVictoryInfo(null);

    // Increment "Play 3 games" quest
    setQuests((prev) =>
      prev.map((q) =>
        q.id === 'q_play_3'
          ? { ...q, progress: Math.min(q.target, q.progress + 1) }
          : q
      )
    );

    setScreen('gameplay');
  };

  // Evaluate victory helper whenever cards change
  const checkAndTriggerVictory = useCallback(
    (
      nextPlayerCards: LottoCard[],
      nextBots: { id: string; profile: FriendProfile; cards: LottoCard[] }[]
    ) => {
      const allParticipants = [
        { id: 'human_player', cards: nextPlayerCards },
        ...nextBots.map((b) => ({ id: b.id, cards: b.cards })),
      ];

      const res = evaluateRoundWinners(allParticipants, gameMode, stake);
      if (res.hasWinner) {
        soundEngine.playVictoryFanfare();
        setHostessState('Celebrate');
        const playerWon = res.winnerIds.includes('human_player');
        const winnerNames = res.winnerIds.map((id) =>
          id === 'human_player'
            ? playerName
            : nextBots.find((b) => b.id === id)?.profile.name || 'Соперник'
        );

        if (playerWon && stake >= 500) {
          setQuests((prev) =>
            prev.map((q) =>
              q.id === 'q_win_1'
                ? { ...q, progress: Math.min(q.target, q.progress + 1) }
                : q
            )
          );
        }

        setRoundVictoryInfo({
          payoutCoins: res.payoutPerWinner,
          winnerNames,
          playerWon,
          rewardClaimed: false,
        });
        setScreen('victory');
        return true;
      }
      return false;
    },
    [gameMode, stake, playerName]
  );

  // Hostess 5-Phase Animated Barrel Draw Loop during Gameplay
  useEffect(() => {
    if (screen !== 'gameplay') return;

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const runDrawCycle = () => {
      if (cancelled) return;

      // Phase 1: ReachIntoBag (0ms)
      setHostessState('ReachIntoBag');
      soundEngine.playBagRustle();

      // Phase 2: SearchBag (400ms)
      timers.push(
        setTimeout(() => {
          if (cancelled) return;
          setHostessState('SearchBag');
        }, 400)
      );

      // Phase 3: LiftBarrel & ShowBarrel (850ms)
      timers.push(
        setTimeout(() => {
          if (cancelled) return;
          setBarrelQueue((prevQueue) => {
            if (prevQueue.remainingDeck.length === 0) return prevQueue;
            const nextNum = prevQueue.remainingDeck[0];
            setCurrentShownBarrel(nextNum);
            setHostessState('ShowBarrel');
            soundEngine.announceBarrelNumber(nextNum);
            return prevQueue;
          });
        }, 850)
      );

      // Phase 4: PlaceBarrel on wooden table & slide 5-barrel queue (1850ms)
      timers.push(
        setTimeout(() => {
          if (cancelled) return;
          setHostessState('PlaceBarrel');
          soundEngine.playWoodBarrelPlace();

          setBarrelQueue((prevQueue) => {
            const { drawnNumber, nextState } = drawNextBarrel(prevQueue);
            if (drawnNumber === null) return prevQueue;

            // Schedule marking window expiration for this drawn barrel
            const windowMs = markingWindowSec * 1000;
            timers.push(
              setTimeout(() => {
                if (cancelled) return;
                setBarrelQueue((qAfter) => ({
                  ...qAfter,
                  activeWindowBarrels: qAfter.activeWindowBarrels.filter(
                    (b) => b !== drawnNumber
                  ),
                }));
                setPlayerCards((currCards) => {
                  const expiredRes = expireBarrelMarkingWindow(
                    currCards,
                    drawnNumber
                  );
                  if (expiredRes.missedCount > 0) {
                    soundEngine.playMissedCross();
                  }
                  return expiredRes.updatedCards;
                });
              }, windowMs)
            );

            // Bots mark matching numbers on their 3 cards with 82% attentiveness
            setBotParticipants((currBots) => {
              const updatedBots = currBots.map((bot) => {
                const shouldMark = Math.random() < 0.82;
                if (!shouldMark) return bot;
                return {
                  ...bot,
                  cards: bot.cards.map((c) => ({
                    ...c,
                    grid: c.grid.map((r) =>
                      r.map((cell) =>
                        cell.number === drawnNumber && cell.state === 'unmarked'
                          ? { ...cell, state: 'marked' }
                          : cell
                      )
                    ),
                  })),
                };
              });
              return updatedBots;
            });

            return nextState;
          });
        }, 1850)
      );

      // Phase 5: Return to Idle (2450ms)
      timers.push(
        setTimeout(() => {
          if (cancelled) return;
          setHostessState('Idle');
        }, 2450)
      );
    };

    const intervalId = setInterval(runDrawCycle, 6500);
    return () => {
      cancelled = true;
      clearInterval(intervalId);
      timers.forEach(clearTimeout);
    };
  }, [screen, markingWindowSec]);

  // Check bot wins after barrel draws
  useEffect(() => {
    if (screen !== 'gameplay' || playerCards.length === 0) return;
    checkAndTriggerVictory(playerCards, botParticipants);
  }, [playerCards, botParticipants, screen, checkAndTriggerVictory]);

  // Handle tapping a cell on one of the player's 3 straight lotto cards
  const handleCellTap = (
    cardId: string,
    row: number,
    col: number,
    cell: LottoCell
  ) => {
    if (cell.number === null) return;

    // If cell has a missed RED X, open the "Убрать крестик — 50 монет" confirmation popup
    if (cell.state === 'missed') {
      soundEngine.playButtonClick();
      setActivePopupCell({ cardId, row, col });
      return;
    }

    const res = tapCardCell(
      playerCards,
      cardId,
      row,
      col,
      barrelQueue.activeWindowBarrels,
      barrelQueue.drawnHistory,
      true
    );

    if (res.marked) {
      soundEngine.playChipMark();
      setActivePopupCell(null);
      setPlayerCards(res.updatedCards);

      // Update "Mark 15 numbers" quest
      setQuests((prev) =>
        prev.map((q) =>
          q.id === 'q_mark_15'
            ? { ...q, progress: Math.min(q.target, q.progress + 1) }
            : q
        )
      );

      checkAndTriggerVictory(res.updatedCards, botParticipants);
    } else if (cell.state === 'unmarked') {
      showToast(`Бочонок № ${cell.number} ещё не выпал!`);
    }
  };

  // Confirm removing a missed RED X for 50 coins
  const handleConfirmRemoveCross = (
    cardId: string,
    row: number,
    col: number
  ) => {
    const fixRes = removeMissedCrossWithCoins({
      cards: playerCards,
      cardId,
      row,
      col,
      coinBalance,
      cost: 50,
      boostersCount: crossRemoverBoosters,
      preferBooster: false,
    });

    if (!fixRes.success) {
      if (fixRes.reason === 'insufficient_funds') {
        showToast('Недостаточно монет! Откройте магазин для пополнения.');
        setActivePopupCell(null);
        setStoreInitialTab('coins');
        setScreen('store');
      }
      return;
    }

    soundEngine.playCoinChime();
    setCoinBalance(fixRes.newBalance);
    setCrossRemoverBoosters(fixRes.newBoostersCount);
    setPlayerCards(fixRes.updatedCards);
    setActivePopupCell(null);
    showToast('Крестик убран! Число отмечено красной фишкой.');

    checkAndTriggerVictory(fixRes.updatedCards, botParticipants);
  };

  // Reactions & Phrases in Gameplay
  const handleSendEmoji = (emoji: string) => {
    soundEngine.playButtonClick();
    setPlayerReaction({ emoji });
    setTimeout(() => setPlayerReaction(null), 2200);

    // Random opponent reacts back warmly
    if (botParticipants.length > 0) {
      const randomBot =
        botParticipants[Math.floor(Math.random() * botParticipants.length)];
      setTimeout(() => {
        setOpponentReactions((prev) => ({
          ...prev,
          [randomBot.id]: { emoji: '👍' },
        }));
        setTimeout(() => {
          setOpponentReactions((prev) => ({ ...prev, [randomBot.id]: {} }));
        }, 2200);
      }, 650);
    }
  };

  const handleSendPhrase = (phrase: string) => {
    soundEngine.playButtonClick();
    setPlayerReaction({ phrase });
    setTimeout(() => setPlayerReaction(null), 2400);

    if (botParticipants.length > 0) {
      const randomBot =
        botParticipants[Math.floor(Math.random() * botParticipants.length)];
      setTimeout(() => {
        setOpponentReactions((prev) => ({
          ...prev,
          [randomBot.id]: { phrase: 'Спасибо!' },
        }));
        setTimeout(() => {
          setOpponentReactions((prev) => ({ ...prev, [randomBot.id]: {} }));
        }, 2400);
      }, 750);
    }
  };

  // Store Purchase Handlers
  const handleBuyCoinsPack = (coinsToAdd: number, title: string) => {
    soundEngine.playCoinChime();
    setCoinBalance((b) => b + coinsToAdd);
    showToast(`Начислено +${coinsToAdd.toLocaleString('ru-RU')} монет (${title})!`);
  };

  const handleBuyOrEquipDecoration = (itemId: string) => {
    const item = STORE_DECORATIONS.find((d) => d.id === itemId);
    if (!item) return;

    const alreadyOwned =
      ownedIds.includes(item.id) || (item.kind === 'vip' && isVip);

    if (alreadyOwned) {
      soundEngine.playButtonClick();
      if (item.frameStyle) setEquippedFrame(item.frameStyle);
      if (item.titleLabel) setEquippedTitle(item.titleLabel);
      showToast(`Украшение «${item.title}» надето!`);
      return;
    }

    if (coinBalance < item.priceCoins) {
      showToast('Недостаточно монет для покупки украшения!');
      return;
    }

    soundEngine.playCoinChime();
    setCoinBalance((b) => b - item.priceCoins);
    setOwnedIds((prev) => [...prev, item.id]);
    if (item.kind === 'vip') {
      setIsVip(true);
      setEquippedFrame('vip_gold');
    } else if (item.frameStyle) {
      setEquippedFrame(item.frameStyle);
    } else if (item.titleLabel) {
      setEquippedTitle(item.titleLabel);
    }
    showToast(`Куплено и надето: «${item.title}»!`);
  };

  const handleBuyPhrase = (phraseId: string) => {
    const item = STORE_PHRASES.find((p) => p.id === phraseId);
    if (!item || ownedIds.includes(phraseId)) return;
    if (coinBalance < item.priceCoins) {
      showToast('Недостаточно монет!');
      return;
    }
    soundEngine.playCoinChime();
    setCoinBalance((b) => b - item.priceCoins);
    setOwnedIds((prev) => [...prev, phraseId]);
    showToast(`Фраза «${item.text}» добавлена в ваш набор!`);
  };

  const handleBuyEmojiPack = (packId: string) => {
    const pack = STORE_EMOJI_PACKS.find((p) => p.id === packId);
    if (!pack || ownedIds.includes(packId)) return;
    if (coinBalance < pack.priceCoins) {
      showToast('Недостаточно монет!');
      return;
    }
    soundEngine.playCoinChime();
    setCoinBalance((b) => b - pack.priceCoins);
    setOwnedIds((prev) => [...prev, packId]);
    showToast(`${pack.title} открыт!`);
  };

  const handleBuyBooster = () => {
    const booster = STORE_BOOSTERS[0];
    if (coinBalance < booster.priceCoins) {
      showToast('Недостаточно монет для покупки бустера!');
      return;
    }
    soundEngine.playCoinChime();
    setCoinBalance((b) => b - booster.priceCoins);
    setCrossRemoverBoosters((c) => c + 1);
    showToast('Куплен бустер «Убрать крестик»!');
  };

  // Unlocked phrases & emojis for Gameplay bottom bar
  const unlockedPhrases = STORE_PHRASES.filter(
    (p) => p.isFreeDefault || ownedIds.includes(p.id)
  ).map((p) => p.text);

  const unlockedEmojis = STORE_EMOJI_PACKS.filter(
    (p) => p.isFreeDefault || ownedIds.includes(p.id)
  ).flatMap((p) => p.emojis);

  return (
    <div className="min-h-screen w-full bg-[#160903] text-[#FFF3D1] flex flex-col lg:flex-row items-center justify-center lg:gap-8 lg:px-6 lg:py-4">
      {/* Main Portrait Mobile/Tablet Game Canvas matching the 7 visual references */}
      <main
        aria-label="Русское лото — Игровое поле"
        className="relative w-full max-w-[440px] min-h-screen lg:min-h-[844px] lg:max-h-[890px] wood-table-surface lg:rounded-[32px] lg:border-[4px] lg:border-[#784315] lg:shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden"
      >
        {/* Toast Notification Banner */}
        {toastMessage && (
          <div
            role="status"
            className="fixed lg:absolute top-12 left-1/2 -translate-x-1/2 z-50 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-[#2B1103] border-2 border-white text-xs font-black shadow-2xl whitespace-nowrap"
          >
            {toastMessage}
          </div>
        )}

        {/* SCREEN 1: ENTRY / WELCOME */}
        {screen === 'welcome' && (
          <WelcomeScreen
            coinBalance={coinBalance}
            dailyBonusAvailable={dailyBonusAvailable}
            onPlayClick={() => {
              soundEngine.playButtonClick();
              setScreen('lobby');
            }}
            onGuestClick={() => {
              soundEngine.playButtonClick();
              setPlayerName('Гость');
              setScreen('lobby');
            }}
            onLoginClick={() => {
              soundEngine.playButtonClick();
              setShowSettingsModal(true);
            }}
            onHowToPlayClick={() => {
              soundEngine.playButtonClick();
              setShowHowToModal(true);
            }}
            onDailyBonusClick={() => {
              soundEngine.playButtonClick();
              setShowDailyBonusModal(true);
            }}
            onOpenStoreCoins={() => {
              soundEngine.playButtonClick();
              setStoreInitialTab('coins');
              setScreen('store');
            }}
            onOpenSettings={() => {
              soundEngine.playButtonClick();
              setShowSettingsModal(true);
            }}
          />
        )}

        {/* SCREEN 2: MAIN LOBBY */}
        {screen === 'lobby' && (
          <MainLobbyScreen
            playerName={playerName}
            playerRating="128K"
            playerFrame={equippedFrame}
            isVip={isVip}
            playerTitle={equippedTitle}
            coinBalance={coinBalance}
            unclaimedQuestsCount={unclaimedQuestsCount}
            dailyBonusAvailable={dailyBonusAvailable}
            onQuickGame={() => {
              soundEngine.playButtonClick();
              setIsPrivateTable(false);
              setPrivateRoomCode(null);
              const affordableStake: StakeAmount =
                coinBalance >= 500 ? 500 : coinBalance >= 250 ? 250 : 100;
              setStake(affordableStake);
              setSelectedCardIds(
                candidateCards.slice(0, 3).map((c) => c.id)
              );
              setScreen('setup');
            }}
            onSelectTableSetup={(chosenStake, chosenPlayers) => {
              soundEngine.playButtonClick();
              setIsPrivateTable(false);
              setPrivateRoomCode(null);
              if (chosenStake) setStake(chosenStake);
              if (chosenPlayers) setParticipantsCount(chosenPlayers);
              setScreen('setup');
            }}
            onOpenMyCards={() => {
              soundEngine.playButtonClick();
              setScreen('setup');
            }}
            onOpenFriends={() => {
              soundEngine.playButtonClick();
              setScreen('friends');
            }}
            onOpenStore={(tab = 'coins') => {
              soundEngine.playButtonClick();
              setStoreInitialTab(tab);
              setScreen('store');
            }}
            onOpenTournaments={() => {
              soundEngine.playButtonClick();
              setShowTournamentsModal(true);
            }}
            onOpenQuests={() => {
              soundEngine.playButtonClick();
              setShowQuestsModal(true);
            }}
            onOpenDailyBonus={() => {
              soundEngine.playButtonClick();
              setShowDailyBonusModal(true);
            }}
            onOpenSettings={() => {
              soundEngine.playButtonClick();
              setShowSettingsModal(true);
            }}
          />
        )}

        {/* SCREEN 3: GAME SETUP */}
        {screen === 'setup' && (
          <GameSetupScreen
            participants={participantsCount}
            stake={stake}
            gameMode={gameMode}
            candidateCards={candidateCards}
            selectedCardIds={selectedCardIds}
            coinBalance={coinBalance}
            isPrivateTable={isPrivateTable}
            privateRoomCode={privateRoomCode}
            onSelectParticipants={(cnt) => {
              soundEngine.playButtonClick();
              setParticipantsCount(cnt);
            }}
            onSelectStake={(st) => {
              soundEngine.playButtonClick();
              setStake(st);
            }}
            onSelectGameMode={(m) => {
              soundEngine.playButtonClick();
              setGameMode(m);
            }}
            onToggleCardSelection={handleToggleCardSelection}
            onRerollCandidateCards={handleRerollCandidateCards}
            onStartGame={handleStartMatch}
            onOpenStoreCoins={() => {
              soundEngine.playButtonClick();
              setStoreInitialTab('coins');
              setScreen('store');
            }}
            onBack={() => {
              soundEngine.playButtonClick();
              setScreen('lobby');
            }}
          />
        )}

        {/* SCREEN 4: STORE */}
        {screen === 'store' && (
          <StoreScreen
            coinBalance={coinBalance}
            ownedIds={ownedIds}
            equippedFrame={equippedFrame}
            equippedTitle={equippedTitle}
            isVip={isVip}
            crossRemoverBoosters={crossRemoverBoosters}
            initialCategory={storeInitialTab}
            onBuyCoinsPack={handleBuyCoinsPack}
            onBuyOrEquipDecoration={handleBuyOrEquipDecoration}
            onBuyPhrase={handleBuyPhrase}
            onBuyEmojiPack={handleBuyEmojiPack}
            onBuyBooster={handleBuyBooster}
            onBack={() => {
              soundEngine.playButtonClick();
              setScreen('lobby');
            }}
          />
        )}

        {/* SCREEN 5: FRIENDS */}
        {screen === 'friends' && (
          <FriendsScreen
            friends={friends}
            onInviteOrJoinFriendTable={(friend) => {
              soundEngine.playButtonClick();
              setIsPrivateTable(true);
              setPrivateRoomCode(`СТОЛ-${friend.name.toUpperCase()}`);
              showToast(`Приглашение отправлено игроку ${friend.name}!`);
              setScreen('setup');
            }}
            onAddFriend={(newName) => {
              soundEngine.playCoinChime();
              const newFriend: FriendProfile = {
                id: `friend_${Date.now()}`,
                name: newName,
                rating: '42K',
                ratingNum: 42000,
                status: 'online',
                statusLabel: 'Онлайн',
                avatarKey: 'sergey',
                frame: 'chamomile',
                isFriend: true,
              };
              setFriends((prev) => [newFriend, ...prev]);
              showToast(`Игрок ${newName} добавлен в друзья!`);
            }}
            onCreatePrivateTable={() => {
              soundEngine.playButtonClick();
              const code = `ЛОТО-${Math.floor(100 + Math.random() * 899)}`;
              setIsPrivateTable(true);
              setPrivateRoomCode(code);
              showToast(`Создан частный стол ${code}`);
              setScreen('setup');
            }}
            onJoinPrivateTableByCode={(code) => {
              soundEngine.playButtonClick();
              setIsPrivateTable(true);
              setPrivateRoomCode(code);
              showToast(`Подключено к столу ${code}`);
              setScreen('setup');
            }}
            onPlayTogetherSize={(sz) => {
              soundEngine.playButtonClick();
              setIsPrivateTable(true);
              setParticipantsCount(sz);
              setPrivateRoomCode(`ДРУЗЬЯ-${sz}`);
              setScreen('setup');
            }}
            onBack={() => {
              soundEngine.playButtonClick();
              setScreen('lobby');
            }}
          />
        )}

        {/* SCREEN 6: GAMEPLAY */}
        {screen === 'gameplay' && (
          <GameplayScreen
            participantsCount={participantsCount}
            opponents={botParticipants.map((b) => b.profile)}
            opponentReactions={opponentReactions}
            playerReaction={playerReaction}
            hostessState={hostessState}
            currentShownBarrel={currentShownBarrel}
            barrelQueue={barrelQueue}
            playerCards={playerCards}
            activePopupCell={activePopupCell}
            fixCrossCost={50}
            ownedPhrases={unlockedPhrases}
            ownedEmojis={unlockedEmojis}
            onCellTap={handleCellTap}
            onConfirmRemoveCross={handleConfirmRemoveCross}
            onCancelRemoveCross={() => setActivePopupCell(null)}
            onSendEmoji={handleSendEmoji}
            onSendPhrase={handleSendPhrase}
            onAddOpponentAsFriend={(oppId) => {
              showToast('Запрос в друзья отправлен!');
              setFriends((prev) =>
                prev.map((f) =>
                  f.id === oppId ? { ...f, isFriend: true } : f
                )
              );
            }}
            onOpenDecorationsModal={() => {
              setStoreInitialTab('decorations');
              setScreen('store');
            }}
          />
        )}

        {/* SCREEN 7: VICTORY */}
        {screen === 'victory' && (
          <VictoryScreen
            payoutCoins={roundVictoryInfo?.payoutCoins ?? stake * participantsCount}
            winnerNames={roundVictoryInfo?.winnerNames ?? [playerName]}
            playerWon={roundVictoryInfo?.playerWon ?? true}
            visibleBarrels={barrelQueue.visibleBarrels}
            playerCards={playerCards}
            opponents={friends.slice(0, 4)}
            onClaimReward={() => {
              soundEngine.playCoinChime();
              if (roundVictoryInfo && !roundVictoryInfo.rewardClaimed) {
                if (roundVictoryInfo.playerWon) {
                  setCoinBalance((b) => b + roundVictoryInfo.payoutCoins);
                }
                setRoundVictoryInfo((prev) =>
                  prev ? { ...prev, rewardClaimed: true } : null
                );
              }
              setScreen('lobby');
            }}
            onPlayAgain={() => {
              soundEngine.playButtonClick();
              if (roundVictoryInfo && !roundVictoryInfo.rewardClaimed && roundVictoryInfo.playerWon) {
                setCoinBalance((b) => b + roundVictoryInfo.payoutCoins);
              }
              setScreen('setup');
            }}
          />
        )}
      </main>

      {/* Desktop Companion Panel (visible on wide screens >= 1024px) */}
      <aside
        aria-label="Панель навигации и статуса тиража"
        className="hidden lg:flex flex-col justify-between w-80 bg-gradient-to-b from-[#2E1406] to-[#180A02] border-2 border-amber-700/80 rounded-3xl p-5 shadow-2xl text-amber-100 self-stretch max-h-[860px]"
      >
        <div>
          <div className="flex items-center justify-between border-b border-amber-800/80 pb-3">
            <div>
              <h2 className="text-xl font-black text-amber-300">
                Русское лото
              </h2>
              <p className="text-xs text-amber-200/75">
                Полная игровая сборка · 7 экранов
              </p>
            </div>
            <span className="text-2xl">🪆</span>
          </div>

          {/* Direct Screen Switcher for instant inspection */}
          <div className="mt-4">
            <div className="text-xs font-extrabold text-amber-300 uppercase tracking-wider mb-2">
              Экраны приложения (1–7)
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              {[
                { id: 'welcome', label: '1. Экран входа' },
                { id: 'lobby', label: '2. Главное меню' },
                { id: 'setup', label: '3. Выбор игры (3/5/7)' },
                { id: 'store', label: '4. Магазин' },
                { id: 'friends', label: '5. Друзья и столы' },
                { id: 'gameplay', label: '6. Игровой экран' },
                { id: 'victory', label: '7. Экран победы' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  data-testid={`nav-screen-${item.id}`}
                  onClick={() => {
                    soundEngine.playButtonClick();
                    if (item.id === 'gameplay' && playerCards.length === 0) {
                      handleStartMatch();
                    } else if (item.id === 'victory' && !roundVictoryInfo) {
                      setRoundVictoryInfo({
                        payoutCoins: 2500,
                        winnerNames: [playerName],
                        playerWon: true,
                        rewardClaimed: false,
                      });
                      if (playerCards.length === 0) {
                        setPlayerCards(candidateCards.slice(0, 3));
                      }
                      setScreen('victory');
                    } else {
                      setScreen(item.id as AppScreenId);
                    }
                  }}
                  className={`px-3 py-2 rounded-xl text-left text-xs font-extrabold border transition-all ${
                    screen === item.id
                      ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-[#2B1103] border-yellow-100 shadow'
                      : 'bg-[#210E04] text-amber-100 border-amber-900 hover:border-amber-600'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Live Draw History & Barrel Action during Gameplay */}
          {screen === 'gameplay' && (
            <div className="mt-4 p-3 rounded-2xl bg-[#1A0B03] border border-amber-800/80">
              <div className="flex items-center justify-between text-xs font-bold text-amber-300 mb-1.5">
                <span>Мешочек: {barrelQueue.drawnHistory.length} / 90</span>
                <button
                  type="button"
                  data-testid="force-next-barrel-btn"
                  onClick={() => {
                    soundEngine.playWoodBarrelPlace();
                    setBarrelQueue((prev) => drawNextBarrel(prev).nextState);
                  }}
                  className="px-2 py-0.5 rounded bg-amber-600 text-white text-[10px] font-extrabold hover:bg-amber-500"
                >
                  След. бочонок ›
                </button>
              </div>
              <div className="text-[11px] text-amber-200/80 leading-snug">
                Нажимайте на выпавшие числа на 3 прямых карточках. Нажмите на
                красный крестик <b>✕</b>, чтобы убрать его за 50 монет.
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2 pt-3 border-t border-amber-800/80">
          <button
            type="button"
            onClick={() => setShowAndroidModal(true)}
            className="w-full py-2 px-3 rounded-xl bg-[#3B1A08] border border-amber-500 text-amber-200 text-xs font-extrabold hover:bg-[#4E230B]"
          >
            📦 Kotlin / Jetpack Compose проект (APK)
          </button>
          <div className="text-[11px] text-amber-200/60 text-center">
            Баланс: {coinBalance.toLocaleString('ru-RU')} 🪙 · Бустеры: {crossRemoverBoosters}
          </div>
        </div>
      </aside>

      {/* Modals */}
      {showHowToModal && (
        <HowToPlayModal onClose={() => setShowHowToModal(false)} />
      )}

      {showDailyBonusModal && (
        <DailyBonusModal
          available={dailyBonusAvailable}
          streakDay={streakDay}
          onClaim={(reward) => {
            soundEngine.playCoinChime();
            setCoinBalance((b) => b + reward);
            setDailyBonusClaimedDate(todayKey);
            setStreakDay((d) => (d % 7) + 1);
            setShowDailyBonusModal(false);
            showToast(`Ежедневный бонус +${reward} монет получен!`);
          }}
          onClose={() => setShowDailyBonusModal(false)}
        />
      )}

      {showQuestsModal && (
        <QuestsModal
          quests={quests}
          onClaimQuest={(qId) => {
            const target = quests.find((q) => q.id === qId);
            if (!target || target.claimed || target.progress < target.target)
              return;
            soundEngine.playCoinChime();
            setCoinBalance((b) => b + target.rewardCoins);
            setQuests((prev) =>
              prev.map((q) => (q.id === qId ? { ...q, claimed: true } : q))
            );
            showToast(`Награда за задание +${target.rewardCoins} монет!`);
          }}
          onClose={() => setShowQuestsModal(false)}
        />
      )}

      {showTournamentsModal && (
        <TournamentsModal
          tournaments={tournaments}
          onJoinTournament={(tId) => {
            const t = tournaments.find((x) => x.id === tId);
            if (!t || t.joined) return;
            if (coinBalance < t.entryFee) {
              showToast('Недостаточно монет для взноса в турнир!');
              return;
            }
            soundEngine.playCoinChime();
            setCoinBalance((b) => b - t.entryFee);
            setTournaments((prev) =>
              prev.map((x) =>
                x.id === tId
                  ? {
                      ...x,
                      joined: true,
                      participantsCount: x.participantsCount + 1,
                    }
                  : x
              )
            );
            showToast(`Вы зарегистрированы в турнире «${t.title}»!`);
          }}
          onClose={() => setShowTournamentsModal(false)}
        />
      )}

      {showSettingsModal && (
        <SettingsAndAuthModal
          playerName={playerName}
          soundEnabled={soundEnabled}
          voiceEnabled={voiceEnabled}
          markingWindowSec={markingWindowSec}
          onUpdatePlayerName={(name) => {
            setPlayerName(name);
            showToast(`Профиль сохранён: ${name}`);
          }}
          onToggleSound={() => {
            setSoundEnabled((v) => {
              soundEngine.soundEnabled = !v;
              return !v;
            });
          }}
          onToggleVoice={() => {
            setVoiceEnabled((v) => {
              soundEngine.voiceEnabled = !v;
              return !v;
            });
          }}
          onChangeWindowSec={(sec) => setMarkingWindowSec(sec)}
          onOpenAndroidCode={() => {
            setShowSettingsModal(false);
            setShowAndroidModal(true);
          }}
          onClose={() => setShowSettingsModal(false)}
        />
      )}

      {showAndroidModal && (
        <AndroidProjectModal onClose={() => setShowAndroidModal(false)} />
      )}
    </div>
  );
}
