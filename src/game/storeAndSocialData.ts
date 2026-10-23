import { ParticipantCount, StakeAmount } from './lottoRules';

export type FrameStyleId = 'none' | 'chamomile' | 'kalina' | 'winter' | 'vip_gold';

export interface StoreCoinPack {
  id: string;
  coins: number;
  bonusPercent?: number;
  totalCoins: number;
  priceRub: string;
  title: string;
  visualType: 'pile' | 'bag' | 'chest' | 'cart';
}

export interface StoreDecorationItem {
  id: string;
  title: string;
  kind: 'frame' | 'vip' | 'title';
  frameStyle?: FrameStyleId;
  titleLabel?: string;
  durationDays?: number;
  priceCoins: number;
  previewAvatar: 'katya' | 'aleksey' | 'ded_sanya' | 'vip_crown' | 'clover_title';
}

export interface StorePhraseItem {
  id: string;
  text: string;
  icon: string;
  priceCoins: number;
  isFreeDefault?: boolean;
}

export interface StoreEmojiPack {
  id: string;
  title: string;
  emojis: string[];
  priceCoins: number;
  isFreeDefault?: boolean;
}

export interface StoreBoosterItem {
  id: string;
  title: string;
  description: string;
  priceCoins: number;
}

export interface FriendProfile {
  id: string;
  name: string;
  rating: string;
  ratingNum: number;
  status: 'online' | 'in_game' | 'offline';
  statusLabel: string;
  avatarKey: 'aleksey' | 'katya' | 'ded_sanya' | 'olga' | 'sergey';
  frame: FrameStyleId;
  isVip?: boolean;
  title?: string;
  isFriend: boolean;
}

export interface QuestItem {
  id: string;
  title: string;
  progress: number;
  target: number;
  rewardCoins: number;
  claimed: boolean;
}

export interface TournamentItem {
  id: string;
  title: string;
  prizePool: number;
  entryFee: number;
  participantsCount: number;
  endsIn: string;
  joined: boolean;
}

// Reference Images asset paths (served from /public/assets/aistudio/)
export const REF_IMAGES = {
  screen1Welcome: '/assets/aistudio/____________ChatGPT_23____._2026__.__22_14_54-1_a7d0e9b3.png',
  screen2Lobby: '/assets/aistudio/____________ChatGPT_23____._2026__.__22_14_59-2_b5e5a10b.png',
  screen3Setup: '/assets/aistudio/____________ChatGPT_23____._2026__.__22_15_06-3_d9f387dc.png',
  screen4Store: '/assets/aistudio/____________ChatGPT_23____._2026__.__22_15_12-4_ce107c3c.png',
  screen5Friends: '/assets/aistudio/____________ChatGPT_23____._2026__.__22_15_17-5_dc438e9a.png',
  screen6Gameplay: '/assets/aistudio/___________________________5a3226f1.png',
  screen7Victory: '/assets/aistudio/____________ChatGPT_23____._2026__.__22_15_29-7_96a36759.png',
};

export const STORE_COIN_PACKS: StoreCoinPack[] = [
  {
    id: 'coins_500',
    coins: 500,
    totalCoins: 500,
    priceRub: '99 ₽',
    title: '500 монет',
    visualType: 'pile',
  },
  {
    id: 'coins_2500',
    coins: 2500,
    bonusPercent: 10,
    totalCoins: 2750,
    priceRub: '299 ₽',
    title: '2 500 монет',
    visualType: 'bag',
  },
  {
    id: 'coins_10000',
    coins: 10000,
    bonusPercent: 25,
    totalCoins: 12500,
    priceRub: '999 ₽',
    title: '10 000 монет',
    visualType: 'chest',
  },
  {
    id: 'coins_25000',
    coins: 25000,
    bonusPercent: 40,
    totalCoins: 35000,
    priceRub: '2 299 ₽',
    title: '25 000 монет',
    visualType: 'cart',
  },
];

export const STORE_DECORATIONS: StoreDecorationItem[] = [
  {
    id: 'frame_chamomile',
    title: 'Рамка «Ромашки»',
    kind: 'frame',
    frameStyle: 'chamomile',
    priceCoins: 3000,
    previewAvatar: 'katya',
  },
  {
    id: 'frame_kalina',
    title: 'Рамка «Калина»',
    kind: 'frame',
    frameStyle: 'kalina',
    priceCoins: 3000,
    previewAvatar: 'aleksey',
  },
  {
    id: 'frame_winter',
    title: 'Рамка «Зимняя»',
    kind: 'frame',
    frameStyle: 'winter',
    priceCoins: 5000,
    previewAvatar: 'ded_sanya',
  },
  {
    id: 'vip_status_30d',
    title: 'VIP статус',
    kind: 'vip',
    frameStyle: 'vip_gold',
    durationDays: 30,
    priceCoins: 6990,
    previewAvatar: 'vip_crown',
  },
  {
    id: 'title_lucky',
    title: 'Титул «Удачливый»',
    kind: 'title',
    titleLabel: 'УДАЧЛИВЫЙ',
    priceCoins: 1500,
    previewAvatar: 'clover_title',
  },
  {
    id: 'title_king',
    title: 'Титул «Король лото»',
    kind: 'title',
    titleLabel: 'КОРОЛЬ ЛОТО',
    priceCoins: 2500,
    previewAvatar: 'vip_crown',
  },
];

export const STORE_PHRASES: StorePhraseItem[] = [
  {
    id: 'phrase_cool',
    text: 'Круто',
    icon: '👍',
    priceCoins: 500,
    isFreeDefault: true,
  },
  {
    id: 'phrase_thanks',
    text: 'Спасибо',
    icon: '❤️',
    priceCoins: 500,
    isFreeDefault: true,
  },
  {
    id: 'phrase_hello',
    text: 'Привет',
    icon: '👋',
    priceCoins: 500,
    isFreeDefault: true,
  },
  {
    id: 'phrase_luck',
    text: 'Удачи!',
    icon: '🍀',
    priceCoins: 500,
  },
  {
    id: 'phrase_great',
    text: 'Отлично!',
    icon: '⭐',
    priceCoins: 500,
  },
  {
    id: 'phrase_twist',
    text: 'Вот это поворот!',
    icon: '🔥',
    priceCoins: 500,
  },
  {
    id: 'phrase_my_day',
    text: 'Сегодня мой день!',
    icon: '👑',
    priceCoins: 500,
  },
  {
    id: 'phrase_one_more',
    text: 'Ещё партию?',
    icon: '🎲',
    priceCoins: 500,
  },
];

export const STORE_EMOJI_PACKS: StoreEmojiPack[] = [
  {
    id: 'emojis_russian',
    title: 'Набор «Русские»',
    emojis: ['👍', '😀', '🥰', '🪆'],
    priceCoins: 1000,
    isFreeDefault: true,
  },
  {
    id: 'emojis_holiday',
    title: 'Набор «Праздник»',
    emojis: ['🎉', '❤️', '👏', '🥂'],
    priceCoins: 1500,
  },
  {
    id: 'emojis_cats',
    title: 'Набор «Котики»',
    emojis: ['😻', '😼', '😽', '🐾'],
    priceCoins: 1500,
  },
];

export const STORE_BOOSTERS: StoreBoosterItem[] = [
  {
    id: 'booster_remove_cross',
    title: 'Убрать крестик',
    description: 'Удаляет один пропущенный крестик на любом билете.',
    priceCoins: 1000,
  },
];

export const INITIAL_FRIENDS: FriendProfile[] = [
  {
    id: 'friend_aleksey',
    name: 'Алексей',
    rating: '128K',
    ratingNum: 128000,
    status: 'online',
    statusLabel: 'Онлайн',
    avatarKey: 'aleksey',
    frame: 'vip_gold',
    isVip: true,
    title: 'VIP',
    isFriend: true,
  },
  {
    id: 'friend_katya',
    name: 'Катя',
    rating: '56K',
    ratingNum: 56000,
    status: 'online',
    statusLabel: 'Онлайн',
    avatarKey: 'katya',
    frame: 'chamomile',
    title: 'Удачливая',
    isFriend: true,
  },
  {
    id: 'friend_ded_sanya',
    name: 'Дед Саня',
    rating: '312K',
    ratingNum: 312000,
    status: 'in_game',
    statusLabel: 'В игре',
    avatarKey: 'ded_sanya',
    frame: 'winter',
    title: 'Старожил',
    isFriend: true,
  },
  {
    id: 'friend_olga',
    name: 'Ольга',
    rating: '91K',
    ratingNum: 91000,
    status: 'offline',
    statusLabel: 'Была 15 мин. назад',
    avatarKey: 'olga',
    frame: 'kalina',
    title: 'Любимчик удачи',
    isFriend: true,
  },
  {
    id: 'friend_sergey',
    name: 'Сергей',
    rating: '74K',
    ratingNum: 74000,
    status: 'offline',
    statusLabel: 'Был 2 ч. назад',
    avatarKey: 'sergey',
    frame: 'kalina',
    title: 'Чемпион',
    isFriend: true,
  },
];

export const AVAILABLE_LOBBY_TABLES: {
  stake: StakeAmount;
  onlineCount: number;
  defaultPlayers: ParticipantCount;
}[] = [
  { stake: 100, onlineCount: 120, defaultPlayers: 3 },
  { stake: 250, onlineCount: 86, defaultPlayers: 5 },
  { stake: 500, onlineCount: 54, defaultPlayers: 5 },
  { stake: 1000, onlineCount: 38, defaultPlayers: 5 },
  { stake: 2000, onlineCount: 21, defaultPlayers: 7 },
  { stake: 5000, onlineCount: 12, defaultPlayers: 7 },
];

export const INITIAL_QUESTS: QuestItem[] = [
  {
    id: 'q_mark_15',
    title: 'Отметить 15 чисел на карточках',
    progress: 7,
    target: 15,
    rewardCoins: 350,
    claimed: false,
  },
  {
    id: 'q_play_3',
    title: 'Сыграть 3 партии в Русское лото',
    progress: 1,
    target: 3,
    rewardCoins: 500,
    claimed: false,
  },
  {
    id: 'q_win_1',
    title: 'Победить за столом от 500 монет',
    progress: 0,
    target: 1,
    rewardCoins: 1000,
    claimed: false,
  },
];

export const INITIAL_TOURNAMENTS: TournamentItem[] = [
  {
    id: 't_samovar',
    title: 'Кубок Золотого Самовара',
    prizePool: 50000,
    entryFee: 500,
    participantsCount: 128,
    endsIn: '04:18:45',
    joined: false,
  },
  {
    id: 't_sunday',
    title: 'Воскресный Тираж',
    prizePool: 150000,
    entryFee: 1000,
    participantsCount: 340,
    endsIn: '11:40:00',
    joined: false,
  },
];
