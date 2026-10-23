import React, { useState } from 'react';
import {
  GameModeVariant,
  LottoCard,
  ParticipantCount,
  StakeAmount,
} from '../game/lottoRules';
import {
  FriendProfile,
  FrameStyleId,
  REF_IMAGES,
  STORE_BOOSTERS,
  STORE_COIN_PACKS,
  STORE_DECORATIONS,
  STORE_EMOJI_PACKS,
  STORE_PHRASES,
} from '../game/storeAndSocialData';
import {
  PlayerAvatarBadge,
  SpriteCrop,
  StarSvgIcon,
  StraightLottoCard,
  WoodenBarrel,
} from './FolkVisuals';

interface GameSetupScreenProps {
  participants: ParticipantCount;
  stake: StakeAmount;
  gameMode: GameModeVariant;
  candidateCards: LottoCard[];
  selectedCardIds: string[];
  coinBalance: number;
  isPrivateTable?: boolean;
  privateRoomCode?: string | null;
  onSelectParticipants: (count: ParticipantCount) => void;
  onSelectStake: (stake: StakeAmount) => void;
  onSelectGameMode: (mode: GameModeVariant) => void;
  onToggleCardSelection: (cardId: string) => void;
  onRerollCandidateCards: () => void;
  onStartGame: () => void;
  onOpenStoreCoins: () => void;
  onBack: () => void;
}

const STAKE_OPTIONS: StakeAmount[] = [100, 250, 500, 1000, 2000, 5000];
const PARTICIPANT_OPTIONS: ParticipantCount[] = [3, 5, 7];

/**
 * SCREEN 3 — GAME SETUP (Выбор игры)
 * Matches Reference Image 3 (screen3Setup)
 */
export const GameSetupScreen: React.FC<GameSetupScreenProps> = ({
  participants,
  stake,
  gameMode,
  candidateCards,
  selectedCardIds,
  coinBalance,
  isPrivateTable = false,
  privateRoomCode,
  onSelectParticipants,
  onSelectStake,
  onSelectGameMode,
  onToggleCardSelection,
  onRerollCandidateCards,
  onStartGame,
  onOpenStoreCoins,
  onBack,
}) => {
  const canAfford = coinBalance >= stake;
  const hasThreeCards = selectedCardIds.length === 3;
  const canStart = canAfford && hasThreeCards;

  return (
    <div
      data-testid="screen-setup"
      className="relative w-full min-h-full flex flex-col justify-between px-2.5 py-2 select-none"
    >
      {/* Top Bar: Back + Hostess Header + Balance */}
      <div className="relative h-32 sm:h-36 flex items-start justify-between">
        <button
          type="button"
          onClick={onBack}
          aria-label="Назад в меню"
          className="relative z-20 w-9 h-9 rounded-full bg-gradient-to-b from-[#4B240E] to-[#241005] border-2 border-amber-500 text-amber-200 font-black flex items-center justify-center shadow-lg active:scale-95"
        >
          ‹
        </button>

        {/* Center Hostess holding 63 */}
        <div className="absolute inset-x-0 top-0 h-32 sm:h-36 flex justify-center pointer-events-none">
          <div className="w-60 sm:w-64 h-full">
            <SpriteCrop
              src={REF_IMAGES.screen3Setup}
              x={210}
              y={10}
              w={520}
              h={400}
              roundedClass="rounded-b-2xl"
              className="w-full h-full drop-shadow-[0_6px_12px_rgba(0,0,0,0.75)]"
            />
          </div>
        </div>

        {/* Right: Mode Toggle & Balance */}
        <div className="relative z-20 flex flex-col items-end gap-1">
          <div className="flex items-center gap-1 bg-[#2D1406]/95 border border-amber-500 rounded-full px-2 py-0.5 text-xs font-extrabold text-white shadow">
            <span>🪙</span>
            <span data-testid="setup-coin-balance" className="tabular-nums">
              {coinBalance.toLocaleString('ru-RU')}
            </span>
          </div>

          <button
            type="button"
            onClick={() =>
              onSelectGameMode(gameMode === 'short' ? 'full' : 'short')
            }
            className="px-2 py-0.5 rounded-lg bg-[#3B1A08]/95 border border-amber-600/80 text-[10px] font-bold text-amber-200 shadow"
          >
            Режим: {gameMode === 'short' ? 'Короткая (1 строка)' : 'Полная карточка'}
          </button>

          {isPrivateTable && privateRoomCode && (
            <div className="px-2 py-0.5 rounded bg-emerald-800/90 border border-emerald-400 text-[10px] font-bold text-emerald-100">
              Код стола: {privateRoomCode}
            </div>
          )}
        </div>
      </div>

      {/* Section 1: Выбери число игроков */}
      <div className="my-1">
        <div className="mx-auto w-fit px-4 py-0.5 rounded-full bg-gradient-to-b from-[#4A220B] to-[#261004] border border-amber-500/80 text-xs sm:text-sm font-extrabold text-amber-100 shadow mb-1.5">
          🌺 Выбери число игроков 🌺
        </div>

        <div className="grid grid-cols-3 gap-2">
          {PARTICIPANT_OPTIONS.map((count) => {
            const isSelected = participants === count;
            return (
              <button
                key={count}
                type="button"
                data-testid={`select-players-${count}`}
                onClick={() => onSelectParticipants(count)}
                className={`py-2 px-2 rounded-xl border-2 flex flex-col items-center justify-center transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#B91C1C] to-[#7F1D1D] border-[#FDE047] text-white shadow-[0_0_12px_rgba(250,204,21,0.7)]'
                    : 'bg-gradient-to-b from-[#F5E3C3] to-[#DEC292] border-[#8B5A2B] text-[#3B1D08]'
                }`}
              >
                <div className="text-xs sm:text-sm tracking-tighter">
                  {count === 3 ? '👥👤' : count === 5 ? '👥👤👥' : '👥👥👤👥'}
                </div>
                <div className="text-xs sm:text-sm font-extrabold mt-0.5">
                  {count} игрока
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 2: Выбери ставку (Wooden Barrels 100..5000) */}
      <div className="my-1">
        <div className="mx-auto w-fit px-4 py-0.5 rounded-full bg-gradient-to-b from-[#4A220B] to-[#261004] border border-amber-500/80 text-xs sm:text-sm font-extrabold text-amber-100 shadow mb-1">
          🌺 Выбери ставку 🌺
        </div>

        <div className="grid grid-cols-6 gap-1 items-center justify-items-center bg-gradient-to-b from-[#3B1A08]/70 to-[#240F04]/90 border-y border-amber-600/60 py-1.5 px-1 rounded-xl">
          {STAKE_OPTIONS.map((s) => {
            const isSelected = stake === s;
            return (
              <div
                key={s}
                data-testid={`select-stake-${s}`}
                onClick={() => onSelectStake(s)}
                className="cursor-pointer"
              >
                <WoodenBarrel
                  number={s}
                  size="sm"
                  isSelected={isSelected}
                  onClick={() => onSelectStake(s)}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 3: Выбери 3 карточки (6 Valid Russian Lotto Cards in a 2x3 Grid) */}
      <div className="my-1 flex-1 flex flex-col justify-center">
        <div className="flex items-center justify-center gap-2 mb-1.5">
          <div className="px-4 py-0.5 rounded-full bg-gradient-to-b from-[#4A220B] to-[#261004] border border-amber-500/80 text-xs sm:text-sm font-extrabold text-amber-100 shadow">
            🌺 Выбери 3 карточки 🌺
          </div>
          <button
            type="button"
            onClick={onRerollCandidateCards}
            className="px-2 py-0.5 rounded-full bg-[#3E1C09] border border-amber-500/80 text-[10px] font-bold text-amber-200 hover:bg-[#52260D]"
          >
            🔄 Другие
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {candidateCards.map((card) => {
            const isSelected = selectedCardIds.includes(card.id);
            return (
              <StraightLottoCard
                key={card.id}
                card={card}
                interactive={false}
                compactSetupMode={true}
                selectedForSetup={isSelected}
                activePopupCell={null}
                onCardSelectToggle={onToggleCardSelection}
              />
            );
          })}
        </div>
      </div>

      {/* Summary Strip: Выбрано: 3 карточки | Ставка: 500 */}
      <div className="my-1 bg-gradient-to-b from-[#3A1907] to-[#210D03] border border-amber-600/80 rounded-xl px-3 py-1.5 flex items-center justify-around shadow">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎫</span>
          <div>
            <div className="text-[10px] text-amber-200/80 leading-none">
              Выбрано:
            </div>
            <div
              data-testid="setup-selected-cards-count"
              className={`text-sm font-extrabold leading-tight ${
                hasThreeCards ? 'text-amber-300' : 'text-rose-400'
              }`}
            >
              {selectedCardIds.length} карточки
            </div>
          </div>
        </div>

        <div className="h-6 w-px bg-amber-700/60" />

        <div className="flex items-center gap-2">
          <span className="text-lg">🪙</span>
          <div>
            <div className="text-[10px] text-amber-200/80 leading-none">
              Ставка:
            </div>
            <div
              data-testid="setup-selected-stake"
              className={`text-sm font-extrabold tabular-nums leading-tight ${
                canAfford ? 'text-amber-300' : 'text-rose-400'
              }`}
            >
              {stake.toLocaleString('ru-RU')}
            </div>
          </div>
        </div>
      </div>

      {!canAfford && (
        <div className="text-center text-[11px] font-bold text-rose-300 mb-1">
          Недостаточно монет для выбранной ставки. Пополните баланс или снизьте ставку.
        </div>
      )}

      {/* Bottom Primary & Secondary Action Buttons */}
      <div className="flex items-center gap-2 pt-0.5">
        <button
          type="button"
          data-testid="setup-start-game-btn"
          disabled={!canStart}
          onClick={onStartGame}
          className={`flex-1 py-2.5 rounded-2xl border-2 font-black text-lg sm:text-xl tracking-wide shadow-lg transition-all ${
            canStart
              ? 'bg-gradient-to-b from-[#22C55E] via-[#15803D] to-[#14532D] border-[#FBBF24] text-white active:scale-95'
              : 'bg-stone-700 border-stone-500 text-stone-300 opacity-60 cursor-not-allowed'
          }`}
        >
          🌿 Начать игру 🌿
        </button>

        <button
          type="button"
          data-testid="setup-buy-coins-btn"
          onClick={onOpenStoreCoins}
          className="px-3.5 py-2 rounded-2xl bg-gradient-to-b from-[#6B3715] to-[#3B1B07] border-2 border-amber-500 text-amber-100 text-xs font-extrabold leading-tight flex items-center gap-1.5 shadow-lg active:scale-95"
        >
          <span>🪙</span>
          <span className="text-left">
            Купить
            <br />
            монеты
          </span>
        </button>
      </div>
    </div>
  );
};

interface StoreScreenProps {
  coinBalance: number;
  ownedIds: string[];
  equippedFrame: FrameStyleId;
  equippedTitle: string;
  isVip: boolean;
  crossRemoverBoosters: number;
  initialCategory?: 'coins' | 'decorations' | 'phrases' | 'emojis' | 'boosters';
  onBuyCoinsPack: (coinsToAdd: number, title: string) => void;
  onBuyOrEquipDecoration: (itemId: string) => void;
  onBuyPhrase: (phraseId: string) => void;
  onBuyEmojiPack: (packId: string) => void;
  onBuyBooster: () => void;
  onBack: () => void;
}

/**
 * SCREEN 4 — STORE (Магазин)
 * Matches Reference Image 4 (screen4Store)
 */
export const StoreScreen: React.FC<StoreScreenProps> = ({
  coinBalance,
  ownedIds,
  equippedFrame,
  equippedTitle,
  isVip,
  crossRemoverBoosters,
  initialCategory = 'coins',
  onBuyCoinsPack,
  onBuyOrEquipDecoration,
  onBuyPhrase,
  onBuyEmojiPack,
  onBuyBooster,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<
    'coins' | 'decorations' | 'phrases' | 'emojis' | 'boosters'
  >(initialCategory);

  return (
    <div
      data-testid="screen-store"
      className="relative w-full min-h-full flex flex-col px-2.5 py-2 select-none"
    >
      {/* Top Banner with Hostess & "Магазин" Sign */}
      <div className="relative h-28 sm:h-32 rounded-2xl overflow-hidden border border-amber-600/80 mb-2 shadow-lg">
        <SpriteCrop
          src={REF_IMAGES.screen4Store}
          x={0}
          y={0}
          w={941}
          h={305}
          className="w-full h-full"
        />
        <button
          type="button"
          onClick={onBack}
          aria-label="Назад"
          className="absolute top-2 left-2 z-20 w-9 h-9 rounded-xl bg-[#3B1A08]/95 border-2 border-amber-400 text-amber-200 font-black flex items-center justify-center shadow"
        >
          ‹
        </button>

        <div className="absolute top-2 right-2 z-20 flex items-center gap-1.5 bg-[#2B1205]/95 border-2 border-amber-400 rounded-full px-2.5 py-0.5 shadow">
          <span className="text-xs">🪙</span>
          <span
            data-testid="store-coin-balance"
            className="text-xs sm:text-sm font-extrabold text-white tabular-nums"
          >
            {coinBalance.toLocaleString('ru-RU')}
          </span>
        </div>
      </div>

      {/* 5 Category Tabs: Монеты / Украшения / Фразы / Смайлы / Бустеры */}
      <div className="grid grid-cols-5 gap-1 mb-2">
        {[
          { id: 'coins', label: 'Монеты', icon: '🪙' },
          { id: 'decorations', label: 'Украшения', icon: '👑' },
          { id: 'phrases', label: 'Фразы', icon: '💬' },
          { id: 'emojis', label: 'Смайлы', icon: '😀' },
          { id: 'boosters', label: 'Бустеры', icon: '🚀' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              data-testid={`store-tab-${tab.id}`}
              onClick={() =>
                setActiveTab(
                  tab.id as
                    | 'coins'
                    | 'decorations'
                    | 'phrases'
                    | 'emojis'
                    | 'boosters'
                )
              }
              className={`py-1.5 px-1 rounded-xl border flex flex-col items-center justify-center transition-all ${
                isActive
                  ? 'bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 border-yellow-100 text-[#2E1304] shadow-md'
                  : 'bg-gradient-to-b from-[#45200B] to-[#261004] border-amber-700/80 text-amber-100'
              }`}
            >
              <span className="text-sm">{tab.icon}</span>
              <span className="text-[10px] font-extrabold leading-tight mt-0.5">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Scrollable Store Content showing all 5 sections matching Reference Image 4 */}
      <div className="flex-1 space-y-2.5 overflow-y-auto pr-0.5">
        {/* 1. МОНЕТЫ */}
        <section className="bg-gradient-to-b from-[#3B1A08]/95 to-[#210D03]/95 border border-amber-600/80 rounded-2xl p-2 shadow">
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="text-sm font-black text-amber-200 flex items-center gap-1.5">
              <span>🪙</span>
              <span>Монеты</span>
            </h3>
            <span className="text-[10px] font-bold text-amber-300 bg-red-900/80 border border-amber-500/60 rounded-full px-2 py-0.5">
              Больше монет — больше эмоций!
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {STORE_COIN_PACKS.map((pack, idx) => {
              const cropX = [28, 250, 474, 698][idx] || 28;
              return (
                <div
                  key={pack.id}
                  className="bg-gradient-to-b from-[#52270E] to-[#2A1104] border border-amber-500/80 rounded-xl p-1.5 flex flex-col items-center text-center shadow"
                >
                  <div className="text-xs font-black text-white leading-none">
                    {pack.coins.toLocaleString('ru-RU')}
                  </div>
                  <div className="text-[9px] text-amber-200 mb-1">монет</div>

                  <div className="w-full h-14 rounded-lg overflow-hidden relative mb-1">
                    <SpriteCrop
                      src={REF_IMAGES.screen4Store}
                      x={cropX}
                      y={550}
                      w={198}
                      h={160}
                      className="w-full h-full"
                    />
                    {pack.bonusPercent && (
                      <span className="absolute bottom-0 right-0 bg-red-600 text-white text-[8px] font-black px-1 rounded-tl">
                        +{pack.bonusPercent}%
                      </span>
                    )}
                  </div>

                  <div className="text-[10px] font-extrabold text-amber-200 mb-1">
                    {pack.priceRub}
                  </div>

                  <button
                    type="button"
                    data-testid={`buy-${pack.id}`}
                    onClick={() => onBuyCoinsPack(pack.totalCoins, pack.title)}
                    className="w-full py-1 rounded-lg bg-gradient-to-b from-emerald-500 to-emerald-700 border border-emerald-300 text-white text-[10px] font-extrabold shadow active:scale-95"
                  >
                    Купить
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* 2. УКРАШЕНИЯ */}
        <section className="bg-gradient-to-b from-[#3B1A08]/95 to-[#210D03]/95 border border-amber-600/80 rounded-2xl p-2 shadow">
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="text-sm font-black text-amber-200 flex items-center gap-1.5">
              <span>👑</span>
              <span>Украшения</span>
            </h3>
            <span className="text-[10px] text-amber-200/80">
              Выделяйтесь за игровым столом!
            </span>
          </div>

          <div className="grid grid-cols-5 gap-1.5">
            {STORE_DECORATIONS.slice(0, 5).map((item, idx) => {
              const isOwned =
                ownedIds.includes(item.id) ||
                (item.kind === 'vip' && isVip);
              const isEquipped =
                (item.kind === 'frame' && equippedFrame === item.frameStyle) ||
                (item.kind === 'title' && equippedTitle === item.titleLabel) ||
                (item.kind === 'vip' && isVip && equippedFrame === 'vip_gold');

              const cropX = [30, 214, 398, 582, 760][idx] || 30;

              return (
                <div
                  key={item.id}
                  className="bg-gradient-to-b from-[#52270E] to-[#2A1104] border border-amber-500/80 rounded-xl p-1 flex flex-col items-center justify-between text-center shadow"
                >
                  <div className="text-[9px] font-bold text-amber-100 leading-tight h-6 flex items-center justify-center">
                    {item.title}
                  </div>

                  <div className="w-12 h-12 rounded-lg overflow-hidden my-1">
                    <SpriteCrop
                      src={REF_IMAGES.screen4Store}
                      x={cropX}
                      y={910}
                      w={158}
                      h={150}
                      className="w-full h-full"
                    />
                  </div>

                  <div className="text-[9px] font-extrabold text-amber-300 tabular-nums mb-1">
                    🪙 {item.priceCoins.toLocaleString('ru-RU')}
                  </div>

                  <button
                    type="button"
                    data-testid={`store-deco-${item.id}`}
                    onClick={() => onBuyOrEquipDecoration(item.id)}
                    className={`w-full py-1 rounded-lg border text-[9px] font-extrabold shadow active:scale-95 ${
                      isEquipped
                        ? 'bg-amber-500 border-yellow-200 text-[#2B1103]'
                        : isOwned
                        ? 'bg-sky-600 border-sky-300 text-white'
                        : 'bg-gradient-to-b from-emerald-500 to-emerald-700 border-emerald-300 text-white'
                    }`}
                  >
                    {isEquipped ? 'Надето' : isOwned ? 'Надеть' : 'Купить'}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. ФРАЗЫ */}
        <section className="bg-gradient-to-b from-[#3B1A08]/95 to-[#210D03]/95 border border-amber-600/80 rounded-2xl p-2 shadow">
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="text-sm font-black text-amber-200 flex items-center gap-1.5">
              <span>💬</span>
              <span>Фразы</span>
            </h3>
            <span className="text-[10px] text-amber-200/80">
              Общайтесь с друзьями в игре!
            </span>
          </div>

          <div className="grid grid-cols-5 gap-1">
            {STORE_PHRASES.slice(0, 5).map((phrase) => {
              const isOwned =
                Boolean(phrase.isFreeDefault) || ownedIds.includes(phrase.id);
              return (
                <div
                  key={phrase.id}
                  className="bg-gradient-to-b from-[#52270E] to-[#2A1104] border border-amber-500/80 rounded-xl p-1 flex flex-col items-center justify-between text-center"
                >
                  <div className="w-full py-1 px-0.5 rounded-lg bg-[#F5E3C3] text-[#2E1405] text-[9px] font-extrabold flex flex-col items-center justify-center leading-tight shadow-inner">
                    <span className="text-xs">{phrase.icon}</span>
                    <span>{phrase.text}</span>
                  </div>

                  <button
                    type="button"
                    data-testid={`store-phrase-${phrase.id}`}
                    disabled={isOwned}
                    onClick={() => onBuyPhrase(phrase.id)}
                    className={`mt-1 w-full py-1 rounded-lg border text-[8px] font-extrabold ${
                      isOwned
                        ? 'bg-amber-900/60 border-amber-700 text-amber-300'
                        : 'bg-gradient-to-b from-emerald-500 to-emerald-700 border-emerald-300 text-white active:scale-95'
                    }`}
                  >
                    {isOwned ? 'Куплено' : `🪙 ${phrase.priceCoins}`}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. СМАЙЛЫ & 5. БУСТЕРЫ */}
        <div className="grid grid-cols-12 gap-2">
          <section className="col-span-7 bg-gradient-to-b from-[#3B1A08]/95 to-[#210D03]/95 border border-amber-600/80 rounded-2xl p-2 shadow">
            <h3 className="text-xs sm:text-sm font-black text-amber-200 mb-1.5">
              😀 Смайлы
            </h3>
            <div className="grid grid-cols-3 gap-1">
              {STORE_EMOJI_PACKS.map((pack) => {
                const isOwned =
                  Boolean(pack.isFreeDefault) || ownedIds.includes(pack.id);
                return (
                  <div
                    key={pack.id}
                    className="bg-[#2A1104] border border-amber-600/70 rounded-xl p-1 flex flex-col items-center justify-between text-center"
                  >
                    <div className="text-[9px] font-bold text-amber-100 leading-tight">
                      {pack.title}
                    </div>
                    <div className="text-sm my-1 tracking-tighter">
                      {pack.emojis.slice(0, 3).join('')}
                    </div>
                    <button
                      type="button"
                      data-testid={`store-emoji-${pack.id}`}
                      disabled={isOwned}
                      onClick={() => onBuyEmojiPack(pack.id)}
                      className={`w-full py-1 rounded-md text-[9px] font-extrabold ${
                        isOwned
                          ? 'bg-amber-900/60 text-amber-300'
                          : 'bg-emerald-600 text-white active:scale-95'
                      }`}
                    >
                      {isOwned ? 'Открыто' : `🪙 ${pack.priceCoins}`}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="col-span-5 bg-gradient-to-b from-[#3B1A08]/95 to-[#210D03]/95 border border-amber-600/80 rounded-2xl p-2 shadow flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-black text-amber-200">
                🚀 Бустеры
              </h3>
              <span className="text-[10px] font-bold text-amber-300">
                Запас: {crossRemoverBoosters}
              </span>
            </div>

            {STORE_BOOSTERS.map((booster) => (
              <div
                key={booster.id}
                className="mt-1 bg-[#F5E3C3] border border-[#8B5A2B] rounded-xl p-1.5 text-[#2E1405] flex flex-col justify-between"
              >
                <div className="text-[10px] font-black leading-tight flex items-center gap-1">
                  <span>🔴</span>
                  <span>{booster.title}</span>
                </div>
                <div className="text-[9px] leading-tight my-0.5 text-[#4E270E]">
                  {booster.description}
                </div>
                <button
                  type="button"
                  data-testid="store-buy-booster-btn"
                  onClick={onBuyBooster}
                  className="mt-1 w-full py-1 rounded-lg bg-gradient-to-b from-emerald-500 to-emerald-700 border border-emerald-300 text-white text-[10px] font-extrabold shadow active:scale-95"
                >
                  🪙 {booster.priceCoins} · Купить
                </button>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
};

interface FriendsScreenProps {
  friends: FriendProfile[];
  onInviteOrJoinFriendTable: (friend: FriendProfile) => void;
  onAddFriend: (name: string) => void;
  onCreatePrivateTable: () => void;
  onJoinPrivateTableByCode: (code: string) => void;
  onPlayTogetherSize: (size: ParticipantCount) => void;
  onBack: () => void;
}

/**
 * SCREEN 5 — FRIENDS (Друзья)
 * Matches Reference Image 5 (screen5Friends)
 */
export const FriendsScreen: React.FC<FriendsScreenProps> = ({
  friends,
  onInviteOrJoinFriendTable,
  onAddFriend,
  onCreatePrivateTable,
  onJoinPrivateTableByCode,
  onPlayTogetherSize,
  onBack,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'online'>('all');
  const [chatFriend, setChatFriend] = useState<FriendProfile | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<
    Record<string, { from: string; text: string }[]>
  >({
    friend_aleksey: [
      { from: 'Алексей', text: 'Привет! Пойдём за стол по 500 монет?' },
    ],
    friend_katya: [{ from: 'Катя', text: 'Удачной игры сегодня! 🌼' }],
  });
  const [showJoinCodeInput, setShowJoinCodeInput] = useState(false);
  const [roomCodeText, setRoomCodeText] = useState('');

  const filteredFriends = friends.filter((f) => {
    const matchesQuery = f.name
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase());
    const matchesOnline =
      filterMode === 'all' ? true : f.status === 'online' || f.status === 'in_game';
    return matchesQuery && matchesOnline;
  });

  const handleAddFriendSubmit = () => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      onAddFriend(`Игрок_${Math.floor(100 + Math.random() * 899)}`);
    } else {
      onAddFriend(trimmed);
      setSearchQuery('');
    }
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatFriend || !chatInput.trim()) return;
    const msg = chatInput.trim();
    setChatMessages((prev) => ({
      ...prev,
      [chatFriend.id]: [
        ...(prev[chatFriend.id] || []),
        { from: 'Вы', text: msg },
        {
          from: chatFriend.name,
          text: 'Отлично! Жду тебя за игровым столом! 🎲',
        },
      ],
    }));
    setChatInput('');
  };

  return (
    <div
      data-testid="screen-friends"
      className="relative w-full min-h-full flex flex-col justify-between px-2.5 py-2 select-none"
    >
      {/* Top Wooden Header: < | Друзья | 👤+ */}
      <div className="flex items-center justify-between mb-1.5">
        <button
          type="button"
          onClick={onBack}
          aria-label="Назад"
          className="w-10 h-10 rounded-full bg-gradient-to-b from-[#4B240E] to-[#241005] border-2 border-amber-500 text-amber-200 font-black flex items-center justify-center shadow"
        >
          ‹
        </button>

        <div className="px-8 py-1 rounded-xl bg-gradient-to-b from-[#F5E3C3] to-[#DFC191] border-2 border-[#7C4A1E] text-[#7F1D1D] text-xl font-black shadow-md">
          🌺 Друзья 🌺
        </div>

        <button
          type="button"
          onClick={handleAddFriendSubmit}
          aria-label="Добавить друга"
          className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#4B240E] to-[#241005] border-2 border-amber-500 text-amber-300 font-black flex items-center justify-center shadow"
        >
          👤+
        </button>
      </div>

      {/* Search Bar & "+ Добавить друга" Button */}
      <div className="flex items-center gap-2 bg-[#2B1306]/90 border border-amber-600/80 rounded-xl p-1.5 mb-1.5">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Найти друга по имени или ID..."
          aria-label="Найти друга по имени или ID"
          className="flex-1 bg-[#1B0B03] border border-amber-800 rounded-lg px-2.5 py-1.5 text-xs text-amber-100 placeholder-amber-200/50 focus:outline-none focus:border-amber-400"
        />
        <button
          type="button"
          data-testid="friends-add-btn"
          onClick={handleAddFriendSubmit}
          className="px-3 py-1.5 rounded-lg bg-gradient-to-b from-[#B91C1C] to-[#7F1D1D] border border-amber-400 text-white text-xs font-extrabold whitespace-nowrap shadow active:scale-95"
        >
          👤+ Добавить друга
        </button>
      </div>

      {/* Friends List Box */}
      <div className="bg-gradient-to-b from-[#3A1907]/95 to-[#210D03]/95 border-2 border-[#8B5A2B] rounded-2xl overflow-hidden shadow-lg mb-2">
        <div className="bg-[#EAD0A1] px-3 py-1 flex items-center justify-between border-b border-[#8B5A2B]">
          <div className="text-xs sm:text-sm font-black text-[#4A1D06]">
            🌺 Мои друзья <span className="ml-1">{friends.length}/12</span>
          </div>
          <button
            type="button"
            onClick={() =>
              setFilterMode((m) => (m === 'all' ? 'online' : 'all'))
            }
            className="px-2.5 py-0.5 rounded-lg bg-[#3B1A08] text-amber-200 text-[11px] font-bold"
          >
            {filterMode === 'all' ? 'Все ▾' : 'Онлайн ▾'}
          </button>
        </div>

        <div className="divide-y divide-amber-900/60 max-h-[250px] overflow-y-auto">
          {filteredFriends.map((f) => (
            <div
              key={f.id}
              data-testid={`friend-row-${f.id}`}
              className="px-2.5 py-1.5 flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <PlayerAvatarBadge
                  name={f.name}
                  rating={f.rating}
                  avatarKey={f.avatarKey}
                  frame={f.frame}
                  isVip={f.isVip}
                  online={f.status !== 'offline'}
                  size="sm"
                />
                <div className="min-w-0">
                  <div className="text-sm font-extrabold text-white truncate">
                    {f.name}
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-400 tabular-nums">
                    <StarSvgIcon className="w-3 h-3 text-amber-400" />
                    <span>{f.rating}</span>
                  </div>
                  <div
                    className={`text-[10px] font-semibold ${
                      f.status === 'online'
                        ? 'text-emerald-400'
                        : f.status === 'in_game'
                        ? 'text-lime-400'
                        : 'text-amber-200/60'
                    }`}
                  >
                    {f.statusLabel}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setChatFriend(f)}
                  className="px-2.5 py-1.5 rounded-xl bg-gradient-to-b from-[#4B240E] to-[#261004] border border-amber-500/80 text-amber-100 text-[11px] font-bold shadow active:scale-95"
                >
                  💬 Сообщение
                </button>

                {f.status === 'online' && (
                  <button
                    type="button"
                    data-testid={`friend-join-${f.id}`}
                    onClick={() => onInviteOrJoinFriendTable(f)}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-b from-[#DC2626] to-[#991B1B] border border-amber-400 text-white text-[11px] font-extrabold shadow active:scale-95"
                  >
                    👥 За стол
                  </button>
                )}

                {f.status === 'in_game' && (
                  <span className="px-3 py-1.5 rounded-xl bg-stone-700/80 border border-stone-500 text-stone-300 text-[11px] font-bold">
                    👥 Занят
                  </span>
                )}

                {f.status === 'offline' && (
                  <button
                    type="button"
                    onClick={() => onInviteOrJoinFriendTable(f)}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-b from-amber-300 to-amber-500 border border-yellow-100 text-[#2E1304] text-[11px] font-extrabold shadow active:scale-95"
                  >
                    ✉️ Пригласить
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Panel: Частный стол с друзьями */}
      <div className="bg-gradient-to-b from-[#F5E3C3] to-[#DFC394] border-2 border-[#7C4A1E] rounded-2xl p-2 text-center shadow-md mb-2">
        <h3 className="text-sm font-black text-[#691911]">
          🌺 Частный стол с друзьями 🌺
        </h3>
        <p className="text-[10px] font-semibold text-[#4B250B] mb-1.5">
          Создайте свой стол и играйте только с друзьями или присоединитесь к их столу.
        </p>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            data-testid="friends-create-private-btn"
            onClick={onCreatePrivateTable}
            className="py-1.5 px-2 rounded-xl bg-gradient-to-b from-[#B91C1C] to-[#7F1D1D] border-2 border-amber-400 text-white text-xs font-extrabold shadow active:scale-95"
          >
            👥+ Создать стол
            <span className="block text-[9px] font-normal text-amber-100">
              С друзьями
            </span>
          </button>

          <button
            type="button"
            onClick={() => setShowJoinCodeInput((v) => !v)}
            className="py-1.5 px-2 rounded-xl bg-gradient-to-b from-[#15803D] to-[#14532D] border-2 border-amber-400 text-white text-xs font-extrabold shadow active:scale-95"
          >
            👥 Присоединиться
            <span className="block text-[9px] font-normal text-emerald-100">
              По коду стола 🔢
            </span>
          </button>
        </div>

        {showJoinCodeInput && (
          <div className="mt-2 flex items-center gap-1.5">
            <input
              type="text"
              value={roomCodeText}
              onChange={(e) => setRoomCodeText(e.target.value.toUpperCase())}
              placeholder="Введите код стола (напр. ЛОТО-500)"
              className="flex-1 px-2 py-1 rounded-lg bg-white border border-[#7C4A1E] text-xs font-bold text-[#2E1304]"
            />
            <button
              type="button"
              onClick={() =>
                onJoinPrivateTableByCode(roomCodeText || 'ЛОТО-777')
              }
              className="px-3 py-1 rounded-lg bg-emerald-700 text-white text-xs font-extrabold"
            >
              Войти
            </button>
          </div>
        )}
      </div>

      {/* Panel: Играть вместе (Стол на 3 / 5 / 7 игроков) */}
      <div className="bg-gradient-to-b from-[#F5E3C3] to-[#DFC394] border-2 border-[#7C4A1E] rounded-2xl p-2 text-center shadow-md">
        <h3 className="text-sm font-black text-[#691911]">
          🌺 Играть вместе 🌺
        </h3>
        <div className="grid grid-cols-3 gap-1.5 mt-1">
          {([3, 5, 7] as ParticipantCount[]).map((sz) => (
            <div
              key={sz}
              className="bg-[#E6CAA0] border border-[#8B5A2B] rounded-xl p-1.5 flex flex-col items-center"
            >
              <div className="text-[10px] font-black text-[#3B1A08]">
                Стол на {sz} игрока
              </div>
              <div className="text-xs my-1">
                {sz === 3 ? '👤👤👤' : sz === 5 ? '👤👤👤👤👤' : '👤👤👤👤👤👤👤'}
              </div>
              <button
                type="button"
                data-testid={`friends-play-size-${sz}`}
                onClick={() => onPlayTogetherSize(sz)}
                className="w-full py-1 rounded-lg bg-gradient-to-b from-[#15803D] to-[#14532D] border border-amber-400 text-white text-[10px] font-extrabold shadow active:scale-95"
              >
                Играть на {sz}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Friend Chat Modal */}
      {chatFriend && (
        <div
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4"
          onClick={() => setChatFriend(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-gradient-to-b from-[#3E1C0A] to-[#1F0D04] border-2 border-amber-500 rounded-2xl p-3 text-amber-100 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-2 border-b border-amber-700/60">
              <div className="font-extrabold text-sm text-amber-300">
                Чат с игроком {chatFriend.name}
              </div>
              <button
                type="button"
                onClick={() => setChatFriend(null)}
                className="w-6 h-6 rounded-full bg-amber-900 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="h-36 overflow-y-auto my-2 space-y-1.5 p-2 bg-[#140802] rounded-xl border border-amber-900">
              {(chatMessages[chatFriend.id] || []).map((m, idx) => (
                <div key={idx} className="text-xs">
                  <span className="font-extrabold text-amber-400">
                    {m.from}:{' '}
                  </span>
                  <span>{m.text}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChat} className="flex gap-1.5">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Написать сообщение..."
                className="flex-1 bg-[#1B0B03] border border-amber-700 rounded-lg px-2.5 py-1 text-xs text-white"
              />
              <button
                type="submit"
                className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold"
              >
                ➤
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
