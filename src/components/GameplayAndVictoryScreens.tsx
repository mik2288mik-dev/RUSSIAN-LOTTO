import React, { useState } from 'react';
import {
  BarrelQueueState,
  LottoCard,
  LottoCell,
  ParticipantCount,
} from '../game/lottoRules';
import {
  FriendProfile,
  REF_IMAGES,
} from '../game/storeAndSocialData';
import {
  BarrelQueueRow,
  HostessAnimState,
  HostessGameplayStage,
  PlayerAvatarBadge,
  PlayerAvatarProps,
  SpriteCrop,
  StraightLottoCard,
  WoodenBarrel,
} from './FolkVisuals';

interface GameplayScreenProps {
  participantsCount: ParticipantCount;
  opponents: FriendProfile[];
  opponentReactions: Record<string, { emoji?: string; phrase?: string }>;
  playerReaction: { emoji?: string; phrase?: string } | null;
  hostessState: HostessAnimState;
  currentShownBarrel: number | null;
  barrelQueue: BarrelQueueState;
  playerCards: LottoCard[];
  activePopupCell: { cardId: string; row: number; col: number } | null;
  fixCrossCost: number;
  ownedPhrases: string[];
  ownedEmojis: string[];
  onCellTap: (cardId: string, row: number, col: number, cell: LottoCell) => void;
  onConfirmRemoveCross: (cardId: string, row: number, col: number) => void;
  onCancelRemoveCross: () => void;
  onSendEmoji: (emoji: string) => void;
  onSendPhrase: (phrase: string) => void;
  onAddOpponentAsFriend: (opponentId: string) => void;
  onOpenDecorationsModal: () => void;
}

/**
 * SCREEN 6 — GAMEPLAY SCREEN (Игровой экран)
 * Strictly follows Section 3 ("CRITICAL GAMEPLAY SCREEN LAYOUT"):
 * - Zone A: Upper zone — animated hostess + 1/2/3 opponent avatars on each side (for 3/5/7 participants)
 * - Zone B: Middle zone — 5 wooden barrels directly on wooden surface + 3 perfectly straight lotto cards (rotationZ = 0f)
 * - Zone C: Bottom zone — 👍 😀 👏 «Круто» «Спасибо» «Привет» + ••• more reactions
 */
export const GameplayScreen: React.FC<GameplayScreenProps> = ({
  participantsCount,
  opponents,
  opponentReactions,
  playerReaction,
  hostessState,
  currentShownBarrel,
  barrelQueue,
  playerCards,
  activePopupCell,
  fixCrossCost,
  ownedPhrases,
  ownedEmojis,
  onCellTap,
  onConfirmRemoveCross,
  onCancelRemoveCross,
  onSendEmoji,
  onSendPhrase,
  onAddOpponentAsFriend,
  onOpenDecorationsModal,
}) => {
  const [selectedOpponent, setSelectedOpponent] =
    useState<FriendProfile | null>(null);
  const [showMoreReactions, setShowMoreReactions] = useState(false);

  // Split opponents evenly between left and right sides:
  // 3 total -> 2 opponents -> 1 left, 1 right
  // 5 total -> 4 opponents -> 2 left, 2 right
  // 7 total -> 6 opponents -> 3 left, 3 right
  const perSide = (participantsCount - 1) / 2;
  const activeOpponents = opponents.slice(0, participantsCount - 1);

  const toAvatarProps = (opp: FriendProfile): PlayerAvatarProps => ({
    name: opp.name,
    rating: opp.rating,
    avatarKey: opp.avatarKey,
    frame: opp.frame,
    isVip: opp.isVip,
    title: opp.title,
    online: true,
    reaction: opponentReactions[opp.id]?.emoji || null,
    phraseBubble: opponentReactions[opp.id]?.phrase || null,
    onClick: () => setSelectedOpponent(opp),
  });

  const leftOpponents = activeOpponents.slice(0, perSide).map(toAvatarProps);
  const rightOpponents = activeOpponents
    .slice(perSide, perSide * 2)
    .map(toAvatarProps);

  return (
    <div
      data-testid="screen-gameplay"
      className="relative w-full min-h-full flex flex-col justify-between select-none overflow-hidden"
    >
      {/* ZONE A: UPPER ZONE — HOSTESS AND OTHER PLAYERS */}
      <HostessGameplayStage
        animState={hostessState}
        currentBarrel={currentShownBarrel}
        opponentsLeft={leftOpponents}
        opponentsRight={rightOpponents}
        onOpenDecorations={onOpenDecorationsModal}
      />

      {/* Player's own active reaction/phrase toast indicator */}
      {(playerReaction?.emoji || playerReaction?.phrase) && (
        <div className="mx-auto -mt-2 mb-0.5 z-30 px-3 py-0.5 rounded-full bg-amber-400 text-[#2B1103] text-xs font-extrabold shadow-lg animate-bounce">
          Вы: {playerReaction.emoji} {playerReaction.phrase}
        </div>
      )}

      {/* ZONE B: MIDDLE ZONE — 5 WOODEN BARRELS DIRECTLY ON WOODEN TABLE + 3 STRAIGHT LOTTO CARDS */}
      <div className="flex-1 flex flex-col justify-between px-1.5 sm:px-2.5">
        {/* 5 Latest Wooden Barrels directly on the wooden table (no tray underneath) */}
        <div className="w-full border-t border-amber-900/50 bg-gradient-to-b from-[#4B230C]/85 to-[#331606]/90">
          <BarrelQueueRow
            visibleBarrels={barrelQueue.visibleBarrels}
            exitingBarrel={barrelQueue.exitingBarrel}
            activeWindowBarrels={barrelQueue.activeWindowBarrels}
          />
        </div>

        {/* THREE LARGE PERFECTLY STRAIGHT LOTTO CARDS (94-97% width, rotationZ = 0f) */}
        <div
          data-testid="gameplay-cards-stack"
          className="w-[96%] mx-auto flex flex-col gap-2 my-1"
        >
          {playerCards.slice(0, 3).map((card) => (
            <StraightLottoCard
              key={card.id}
              card={card}
              interactive={true}
              activePopupCell={activePopupCell}
              fixCost={fixCrossCost}
              onCellTap={onCellTap}
              onConfirmRemoveCross={onConfirmRemoveCross}
              onCancelRemoveCross={onCancelRemoveCross}
            />
          ))}
        </div>
      </div>

      {/* ZONE C: BOTTOM ZONE — REACTIONS AND MESSAGES BAR */}
      <div className="relative px-2 pt-1 pb-2">
        {showMoreReactions && (
          <div className="absolute bottom-14 left-2 right-2 z-40 bg-gradient-to-b from-[#3E1C0A] to-[#1E0C03] border-2 border-amber-500 rounded-2xl p-2.5 shadow-2xl">
            <div className="text-[11px] font-bold text-amber-300 mb-1">
              Дополнительные эмоции и фразы:
            </div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {ownedEmojis.map((em) => (
                <button
                  key={em}
                  type="button"
                  onClick={() => {
                    onSendEmoji(em);
                    setShowMoreReactions(false);
                  }}
                  className="w-9 h-9 rounded-xl bg-[#2A1205] border border-amber-700 text-lg flex items-center justify-center hover:border-amber-400"
                >
                  {em}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {ownedPhrases.map((phr) => (
                <button
                  key={phr}
                  type="button"
                  onClick={() => {
                    onSendPhrase(phr);
                    setShowMoreReactions(false);
                  }}
                  className="px-2.5 py-1 rounded-xl bg-[#2A1205] border border-amber-600 text-amber-100 text-xs font-bold hover:border-amber-300"
                >
                  {phr}
                </button>
              ))}
            </div>
          </div>
        )}

        <div
          data-testid="gameplay-reaction-bar"
          className="w-full bg-gradient-to-b from-[#2A1205]/95 to-[#170902]/95 border border-amber-700/80 rounded-2xl px-2 py-1.5 flex items-center justify-between gap-1.5 overflow-x-auto shadow-inner"
        >
          <button
            type="button"
            data-testid="react-thumbsup"
            aria-label="Реакция Палец вверх"
            onClick={() => onSendEmoji('👍')}
            className="w-9 h-9 shrink-0 rounded-full bg-[#3B1A08] border border-amber-600/80 flex items-center justify-center text-lg shadow active:scale-90"
          >
            👍
          </button>

          <button
            type="button"
            data-testid="react-smile"
            aria-label="Реакция Улыбка"
            onClick={() => onSendEmoji('😀')}
            className="w-9 h-9 shrink-0 rounded-full bg-[#3B1A08] border border-amber-600/80 flex items-center justify-center text-lg shadow active:scale-90"
          >
            😀
          </button>

          <button
            type="button"
            data-testid="react-clap"
            aria-label="Реакция Аплодисменты"
            onClick={() => onSendEmoji('👏')}
            className="w-9 h-9 shrink-0 rounded-full bg-[#3B1A08] border border-amber-600/80 flex items-center justify-center text-lg shadow active:scale-90"
          >
            👏
          </button>

          <button
            type="button"
            data-testid="phrase-kruto"
            onClick={() => onSendPhrase('Круто')}
            className="px-3 py-1.5 shrink-0 rounded-full bg-[#3B1A08] border border-amber-600/80 text-amber-100 text-xs font-bold shadow active:scale-95"
          >
            Круто
          </button>

          <button
            type="button"
            data-testid="phrase-spasibo"
            onClick={() => onSendPhrase('Спасибо')}
            className="px-3 py-1.5 shrink-0 rounded-full bg-[#3B1A08] border border-amber-600/80 text-amber-100 text-xs font-bold shadow active:scale-95"
          >
            Спасибо
          </button>

          <button
            type="button"
            data-testid="phrase-privet"
            onClick={() => onSendPhrase('Привет')}
            className="px-3 py-1.5 shrink-0 rounded-full bg-[#3B1A08] border border-amber-600/80 text-amber-100 text-xs font-bold shadow active:scale-95"
          >
            Привет
          </button>

          <button
            type="button"
            data-testid="react-more-btn"
            aria-label="Дополнительные реакции и фразы"
            onClick={() => setShowMoreReactions((v) => !v)}
            className="w-9 h-9 shrink-0 rounded-xl bg-[#3B1A08] border border-amber-600/80 text-amber-200 font-black text-xs flex items-center justify-center shadow active:scale-95"
          >
            •••
          </button>
        </div>
      </div>

      {/* Opponent Profile Popup when clicking an avatar */}
      {selectedOpponent && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setSelectedOpponent(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xs bg-gradient-to-b from-[#431F0A] to-[#210D03] border-2 border-amber-500 rounded-2xl p-4 text-center text-amber-100 shadow-2xl"
          >
            <div className="flex justify-center mb-2">
              <PlayerAvatarBadge
                name={selectedOpponent.name}
                rating={selectedOpponent.rating}
                avatarKey={selectedOpponent.avatarKey}
                frame={selectedOpponent.frame}
                isVip={selectedOpponent.isVip}
                title={selectedOpponent.title}
                size="lg"
              />
            </div>
            <div className="text-base font-black text-white">
              {selectedOpponent.name}
            </div>
            <div className="text-xs text-amber-300 font-bold mb-3">
              Рейтинг: ★ {selectedOpponent.rating}{' '}
              {selectedOpponent.title ? `· ${selectedOpponent.title}` : ''}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  onAddOpponentAsFriend(selectedOpponent.id);
                  setSelectedOpponent(null);
                }}
                className="flex-1 py-2 rounded-xl bg-gradient-to-b from-emerald-500 to-emerald-700 border border-emerald-300 text-white text-xs font-extrabold shadow"
              >
                👤+ В друзья
              </button>
              <button
                type="button"
                onClick={() => setSelectedOpponent(null)}
                className="px-4 py-2 rounded-xl bg-[#5C2D12] text-amber-100 text-xs font-bold"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface VictoryScreenProps {
  payoutCoins: number;
  winnerNames: string[];
  playerWon: boolean;
  visibleBarrels: number[];
  playerCards: LottoCard[];
  opponents: FriendProfile[];
  onClaimReward: () => void;
  onPlayAgain: () => void;
}

/**
 * SCREEN 7 — VICTORY SCREEN (Экран победы)
 * Matches Reference Image 7 (screen7Victory)
 */
export const VictoryScreen: React.FC<VictoryScreenProps> = ({
  payoutCoins,
  winnerNames,
  playerWon,
  visibleBarrels,
  playerCards,
  opponents,
  onClaimReward,
  onPlayAgain,
}) => {
  const winningBarrel = visibleBarrels[0] || 63;
  const sideBarrels =
    visibleBarrels.length >= 5
      ? visibleBarrels.slice(1, 5)
      : [17, 24, 21, 8];

  return (
    <div
      data-testid="screen-victory"
      className="relative w-full min-h-full flex flex-col justify-between px-2.5 py-2 select-none overflow-hidden"
    >
      {/* Celebratory Golden Confetti Particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-10">
        {Array.from({ length: 16 }).map((_, idx) => (
          <span
            key={idx}
            style={{
              left: `${(idx * 19) % 95}%`,
              top: `${(idx * 13) % 85}%`,
            }}
            className="absolute w-3 h-1.5 rounded-sm bg-gradient-to-r from-yellow-200 via-amber-400 to-yellow-600 rotate-45 opacity-80 animate-pulse"
          />
        ))}
      </div>

      {/* Upper Celebrating Hostess + 4 Applauding Opponent Avatars */}
      <div className="relative h-56 sm:h-64 flex items-center justify-center">
        {/* Left Avatars */}
        <div className="absolute left-0 top-2 bottom-2 z-20 flex flex-col justify-between">
          {opponents.slice(0, 2).map((opp) => (
            <PlayerAvatarBadge
              key={opp.id}
              name={opp.name}
              rating={opp.rating}
              avatarKey={opp.avatarKey}
              frame={opp.frame}
              isVip={opp.isVip}
              reaction="👏"
              size="sm"
            />
          ))}
        </div>

        {/* Celebrating Hostess + "Победа!" Banner & Reward Plaque */}
        <div className="relative w-full max-w-[235px] sm:max-w-[260px] h-full flex flex-col items-center justify-end">
          <div className="w-48 h-36 -mb-5">
            <SpriteCrop
              src={REF_IMAGES.screen7Victory}
              x={165}
              y={22}
              w={610}
              h={440}
              roundedClass="rounded-2xl"
              className="w-full h-full drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)]"
            />
          </div>

          {/* Ornate Red & Gold Ribbon Banner: Победа! */}
          <div className="relative z-20 w-full bg-gradient-to-b from-[#DC2626] via-[#991B1B] to-[#650F0F] border-2 border-[#FACC15] rounded-2xl px-3 py-1.5 text-center shadow-[0_8px_20px_rgba(0,0,0,0.85)]">
            <div className="text-xs text-amber-200 font-bold">👑</div>
            <h1
              className="text-2xl sm:text-3xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-b from-[#FEF9C3] via-[#FDE047] to-[#D97706] drop-shadow"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              {playerWon ? 'Победа!' : 'Партия завершена!'}
            </h1>
            <div className="mt-0.5 bg-[#3A1907] border border-amber-500/80 rounded-xl py-1 px-2">
              <div className="text-xs font-bold text-amber-100">
                {playerWon
                  ? 'Вы выиграли'
                  : `Победитель: ${winnerNames.join(', ')}`}
              </div>
              <div
                data-testid="victory-payout-amount"
                className="text-xl sm:text-2xl font-black text-[#FDE047] tabular-nums leading-tight"
              >
                🪙 {payoutCoins.toLocaleString('ru-RU')}
              </div>
              <div className="text-[10px] font-bold text-amber-200">монет</div>
            </div>
          </div>
        </div>

        {/* Right Avatars */}
        <div className="absolute right-0 top-2 bottom-2 z-20 flex flex-col justify-between">
          {opponents.slice(2, 4).map((opp) => (
            <PlayerAvatarBadge
              key={opp.id}
              name={opp.name}
              rating={opp.rating}
              avatarKey={opp.avatarKey}
              frame={opp.frame}
              isVip={opp.isVip}
              reaction="👏"
              size="sm"
            />
          ))}
        </div>
      </div>

      {/* Center: Overflowing Coin Chest + 5 Final Barrels */}
      <div className="relative my-1 flex flex-col items-center">
        <div className="flex items-end justify-center gap-2">
          <WoodenBarrel number={sideBarrels[0] ?? 17} size="sm" />
          <WoodenBarrel number={sideBarrels[1] ?? 24} size="sm" />
          <div className="px-1.5 py-0.5 rounded-xl bg-gradient-to-b from-[#991B1B] to-[#450A0A] border-2 border-amber-400 shadow-lg">
            <WoodenBarrel number={winningBarrel} size="md" isNewest />
          </div>
          <WoodenBarrel number={sideBarrels[2] ?? 21} size="sm" />
          <WoodenBarrel number={sideBarrels[3] ?? 8} size="sm" />
        </div>
      </div>

      {/* Winning Player Cards Preview (3 straight cards) */}
      <div className="space-y-1.5 my-1">
        {playerCards.slice(0, 3).map((card) => (
          <StraightLottoCard
            key={card.id}
            card={card}
            interactive={false}
            compactSetupMode={true}
            activePopupCell={null}
          />
        ))}
      </div>

      {/* Bottom Action Row: Забрать & Играть еще */}
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        <button
          type="button"
          data-testid="victory-claim-btn"
          onClick={onClaimReward}
          className="py-3 px-4 rounded-2xl bg-gradient-to-b from-[#22C55E] via-[#15803D] to-[#14532D] border-2 border-[#FBBF24] text-white font-black text-xl flex items-center justify-center gap-2 shadow-xl active:scale-95"
        >
          <span>🪙</span>
          <span>Забрать</span>
        </button>

        <button
          type="button"
          data-start="true"
          data-testid="victory-play-again-btn"
          onClick={onPlayAgain}
          className="py-3 px-4 rounded-2xl bg-gradient-to-b from-[#5C2D12] via-[#3A1A08] to-[#210D03] border-2 border-[#FBBF24] text-amber-100 font-black text-lg flex items-center justify-center gap-2 shadow-xl active:scale-95"
        >
          <span>🌺</span>
          <span>Играть еще</span>
        </button>
      </div>
    </div>
  );
};
