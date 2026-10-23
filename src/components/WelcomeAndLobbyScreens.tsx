import React from 'react';
import {
  ParticipantCount,
  StakeAmount,
} from '../game/lottoRules';
import {
  AVAILABLE_LOBBY_TABLES,
  FrameStyleId,
  REF_IMAGES,
} from '../game/storeAndSocialData';
import {
  LoginSvgIcon,
  MenuSvgIcon,
  SpriteCrop,
  StarSvgIcon,
  WoodenBarrel,
} from './FolkVisuals';

interface WelcomeScreenProps {
  coinBalance: number;
  dailyBonusAvailable: boolean;
  onPlayClick: () => void;
  onGuestClick: () => void;
  onLoginClick: () => void;
  onHowToPlayClick: () => void;
  onDailyBonusClick: () => void;
  onOpenStoreCoins: () => void;
  onOpenSettings: () => void;
}

/**
 * SCREEN 1 — ENTRY / WELCOME
 * Matches Reference Image 1 (screen1Welcome)
 */
export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  coinBalance,
  dailyBonusAvailable,
  onPlayClick,
  onGuestClick,
  onLoginClick,
  onHowToPlayClick,
  onDailyBonusClick,
  onOpenStoreCoins,
  onOpenSettings,
}) => {
  return (
    <div
      data-testid="screen-welcome"
      className="relative w-full min-h-full flex flex-col justify-between px-3 py-2.5 select-none overflow-hidden"
    >
      {/* Top Bar: Settings Gear + Coin Balance */}
      <div className="relative z-20 flex items-center justify-between">
        <button
          type="button"
          onClick={onOpenSettings}
          aria-label="Настройки"
          className="w-10 h-10 rounded-full bg-gradient-to-b from-[#4B240E] to-[#241005] border-2 border-amber-500/80 flex items-center justify-center text-amber-200 text-lg shadow-lg active:scale-95"
        >
          ⚙️
        </button>

        <div className="flex items-center gap-1.5 bg-gradient-to-b from-[#3B1A08] to-[#1D0B03] border-2 border-amber-500/90 rounded-full pl-1.5 pr-1 py-0.5 shadow-lg">
          <span className="w-6 h-6 rounded-full bg-gradient-to-b from-yellow-300 to-amber-600 border border-yellow-100 flex items-center justify-center text-xs font-black text-[#3B1A08] shadow">
            👑
          </span>
          <span
            data-testid="welcome-coin-balance"
            className="text-sm sm:text-base font-extrabold text-white tabular-nums px-1"
          >
            {coinBalance.toLocaleString('ru-RU')}
          </span>
          <button
            type="button"
            onClick={onOpenStoreCoins}
            aria-label="Пополнить монеты"
            className="w-6 h-6 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-700 border border-emerald-200 flex items-center justify-center text-white font-black text-sm shadow active:scale-95"
          >
            +
          </button>
        </div>
      </div>

      {/* Ornate "Русское ЛОТО" Logo Lockup */}
      <div className="relative z-10 mx-auto w-[86%] max-w-[340px] -mt-1">
        <SpriteCrop
          src={REF_IMAGES.screen1Welcome}
          x={155}
          y={16}
          w={630}
          h={312}
          className="w-full h-24 sm:h-28 drop-shadow-[0_6px_12px_rgba(0,0,0,0.8)]"
          roundedClass="rounded-2xl"
          label="Логотип Русское Лото"
        />
      </div>

      {/* Center Stage: Hostess + Cloth Bag + Daily Bonus Card + 4 Wooden Barrels */}
      <div className="relative flex-1 flex flex-col items-center justify-end min-h-[270px] sm:min-h-[310px] my-1">
        {/* Daily Bonus Floating Card on the Left */}
        <div className="absolute left-0 top-2 z-20 w-28 sm:w-32 bg-gradient-to-b from-[#4A220B]/95 to-[#240E04]/95 border-2 border-amber-400 rounded-2xl p-1.5 text-center shadow-[0_6px_16px_rgba(0,0,0,0.75)]">
          {dailyBonusAvailable && (
            <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-600 border-2 border-amber-200 text-white text-xs font-black flex items-center justify-center animate-bounce">
              !
            </span>
          )}
          <div className="w-16 h-12 mx-auto">
            <SpriteCrop
              src={REF_IMAGES.screen1Welcome}
              x={44}
              y={355}
              w={195}
              h={155}
              roundedClass="rounded-lg"
              className="w-full h-full"
            />
          </div>
          <div className="text-[11px] font-extrabold text-amber-100 leading-tight mt-0.5">
            Ежедневный
            <br />
            бонус
          </div>
          <button
            type="button"
            data-testid="welcome-daily-bonus-btn"
            onClick={onDailyBonusClick}
            className="mt-1 w-full py-1 rounded-full bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 border border-yellow-100 text-[#3B1806] text-[11px] font-black shadow active:scale-95"
          >
            Получить
          </button>
        </div>

        {/* Central Hostess Portrait & Cloth Bag */}
        <div className="relative w-[260px] sm:w-[300px] h-[240px] sm:h-[275px] mx-auto">
          <SpriteCrop
            src={REF_IMAGES.screen1Welcome}
            x={135}
            y={315}
            w={690}
            h={725}
            roundedClass="rounded-3xl"
            className="w-full h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.75)]"
            label="Ведущая с мешочком и бочонками"
          />
        </div>

        {/* Interactive Wooden Barrels sitting on the embroidered table runner */}
        <div className="relative z-20 flex items-center justify-center gap-3 sm:gap-5 -mt-5">
          <WoodenBarrel number={17} size="sm" />
          <WoodenBarrel number={24} size="sm" />
          <WoodenBarrel number={21} size="sm" />
          <WoodenBarrel number={8} size="sm" />
        </div>
      </div>

      {/* Bottom Action Controls: Играть, Гость / Войти, Как играть */}
      <div className="relative z-20 flex flex-col items-center gap-2.5 pt-1 pb-1">
        {/* Primary Ornate Red-and-Gold "Играть" CTA */}
        <button
          type="button"
          data-start="true"
          data-testid="welcome-play-btn"
          onClick={onPlayClick}
          className="relative w-[92%] max-w-[360px] py-3 sm:py-3.5 rounded-3xl bg-gradient-to-b from-[#EF4444] via-[#B91C1C] to-[#7F1D1D] border-[3px] border-[#FBBF24] shadow-[0_6px_16px_rgba(0,0,0,0.75),inset_0_2px_4px_rgba(255,255,255,0.45)] flex items-center justify-center gap-3 active:scale-[0.98] transition-transform"
        >
          <span className="text-lg">🍒</span>
          <span
            className="text-3xl sm:text-4xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-b from-[#FEF08A] via-[#FACC15] to-[#D97706] drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Играть
          </span>
          <span className="text-lg">🍒</span>
        </button>

        {/* Secondary Row: Гость & Войти */}
        <div className="w-[92%] max-w-[360px] grid grid-cols-2 gap-3">
          <button
            type="button"
            data-testid="welcome-guest-btn"
            onClick={onGuestClick}
            className="py-2.5 px-3 rounded-2xl bg-gradient-to-b from-[#6A3818] via-[#47230C] to-[#2A1205] border-2 border-[#D97706] text-amber-100 font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg active:scale-95"
          >
            <span>👤</span>
            <span>Гость</span>
          </button>

          <button
            type="button"
            data-testid="welcome-login-btn"
            onClick={onLoginClick}
            className="py-2.5 px-3 rounded-2xl bg-gradient-to-b from-[#22C55E] via-[#15803D] to-[#14532D] border-2 border-[#FBBF24] text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg active:scale-95"
          >
            <LoginSvgIcon className="w-4 h-4 text-amber-200" />
            <span>Войти</span>
          </button>
        </div>

        {/* Bottom Tutorial Button: Как играть */}
        <button
          type="button"
          data-testid="welcome-howto-btn"
          onClick={onHowToPlayClick}
          className="px-6 py-1.5 rounded-full bg-gradient-to-b from-[#47230C] to-[#241005] border border-amber-500/80 text-amber-200 font-bold text-xs sm:text-sm flex items-center gap-2 shadow active:scale-95"
        >
          <span>📖</span>
          <span>Как играть</span>
        </button>
      </div>
    </div>
  );
};

interface MainLobbyScreenProps {
  playerName: string;
  playerRating: string;
  playerFrame: FrameStyleId;
  isVip: boolean;
  playerTitle?: string;
  coinBalance: number;
  unclaimedQuestsCount: number;
  dailyBonusAvailable: boolean;
  onQuickGame: () => void;
  onSelectTableSetup: (stake?: StakeAmount, players?: ParticipantCount) => void;
  onOpenMyCards: () => void;
  onOpenFriends: () => void;
  onOpenStore: (tab?: 'coins' | 'decorations' | 'phrases' | 'emojis' | 'boosters') => void;
  onOpenTournaments: () => void;
  onOpenQuests: () => void;
  onOpenDailyBonus: () => void;
  onOpenSettings: () => void;
}

/**
 * SCREEN 2 — MAIN LOBBY
 * Matches Reference Image 2 (screen2Lobby)
 */
export const MainLobbyScreen: React.FC<MainLobbyScreenProps> = ({
  playerName,
  playerRating,
  playerFrame,
  isVip,
  playerTitle,
  coinBalance,
  unclaimedQuestsCount,
  dailyBonusAvailable,
  onQuickGame,
  onSelectTableSetup,
  onOpenMyCards,
  onOpenFriends,
  onOpenStore,
  onOpenTournaments,
  onOpenQuests,
  onOpenDailyBonus,
  onOpenSettings,
}) => {
  return (
    <div
      data-testid="screen-lobby"
      className="relative w-full min-h-full flex flex-col justify-between px-2.5 pt-2 pb-1.5 select-none"
    >
      {/* Top Header: Player Profile Pill + Coin Balance + Menu Button */}
      <div className="relative z-20 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onOpenStore('decorations')}
          className="flex items-center gap-2 bg-gradient-to-r from-[#3E1B08] to-[#240E04] border-2 border-amber-500/80 rounded-full pr-3 pl-1 py-0.5 shadow-lg active:scale-95"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-400 relative">
            <SpriteCrop
              src={REF_IMAGES.screen5Friends}
              x={64}
              y={334}
              w={112}
              h={112}
              className="w-full h-full"
            />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1">
              <span className="text-xs sm:text-sm font-extrabold text-white leading-tight">
                {playerName}
              </span>
              {(isVip || playerFrame === 'vip_gold') && (
                <span className="px-1 py-0 rounded bg-amber-400 text-[#2B1103] text-[9px] font-black">
                  VIP
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400 tabular-nums leading-tight">
              <StarSvgIcon className="w-3 h-3 text-amber-400" />
              <span>
                {playerRating} {playerTitle ? `· ${playerTitle}` : ''}
              </span>
            </div>
          </div>
        </button>

        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 bg-gradient-to-b from-[#3B1A08] to-[#1D0B03] border-2 border-amber-500/90 rounded-full pl-1.5 pr-1 py-0.5 shadow-lg">
            <span className="w-5 h-5 rounded-full bg-amber-400 text-[#2D1204] flex items-center justify-center text-xs font-black">
              🪙
            </span>
            <span
              data-testid="lobby-coin-balance"
              className="text-xs sm:text-sm font-extrabold text-white tabular-nums px-1"
            >
              {coinBalance.toLocaleString('ru-RU')}
            </span>
            <button
              type="button"
              onClick={() => onOpenStore('coins')}
              aria-label="Купить монеты"
              className="w-5 h-5 rounded-full bg-emerald-500 border border-emerald-200 text-white font-black text-xs flex items-center justify-center"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenSettings}
            aria-label="Меню настроек"
            className="w-9 h-9 rounded-xl bg-gradient-to-b from-[#4A220B] to-[#240F04] border border-amber-500/80 text-amber-200 flex items-center justify-center font-bold shadow"
          >
            <MenuSvgIcon className="w-5 h-5 text-amber-200" />
          </button>
        </div>
      </div>

      {/* Upper Stage: Hostess + Left Quick Buttons + Right Daily Bonus & Welcome Frame */}
      <div className="relative h-[195px] sm:h-[215px] my-1 flex items-center justify-center">
        {/* Left Floating Column: Рамки и значки, Турниры, Задания */}
        <div className="absolute left-0 top-1 z-20 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => onOpenStore('decorations')}
            className="w-16 py-1 rounded-xl bg-gradient-to-b from-[#431F0A]/95 to-[#210D03]/95 border border-amber-500/80 flex flex-col items-center text-center shadow-md active:scale-95"
          >
            <span className="text-base">👑</span>
            <span className="text-[9px] font-bold text-amber-100 leading-tight">
              Рамки
              <br />и значки
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenTournaments}
            className="relative w-16 py-1 rounded-xl bg-gradient-to-b from-[#431F0A]/95 to-[#210D03]/95 border border-amber-500/80 flex flex-col items-center text-center shadow-md active:scale-95"
          >
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 border border-amber-200 text-white text-[9px] font-black flex items-center justify-center">
              !
            </span>
            <span className="text-base">🏆</span>
            <span className="text-[9px] font-bold text-amber-100 leading-tight">
              Турниры
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenQuests}
            className="relative w-16 py-1 rounded-xl bg-gradient-to-b from-[#431F0A]/95 to-[#210D03]/95 border border-amber-500/80 flex flex-col items-center text-center shadow-md active:scale-95"
          >
            {unclaimedQuestsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 border border-amber-200 text-white text-[9px] font-black flex items-center justify-center">
                {unclaimedQuestsCount}
              </span>
            )}
            <span className="text-base">☑️</span>
            <span className="text-[9px] font-bold text-amber-100 leading-tight">
              Задания
            </span>
          </button>
        </div>

        {/* Center Hostess with Barrel 63 & Cloth Bag */}
        <div className="w-[235px] sm:w-[260px] h-full mx-auto">
          <SpriteCrop
            src={REF_IMAGES.screen3Setup}
            x={195}
            y={12}
            w={550}
            h={400}
            roundedClass="rounded-2xl"
            className="w-full h-full drop-shadow-[0_8px_16px_rgba(0,0,0,0.75)]"
            label="Ведущая в главном меню"
          />
        </div>

        {/* Right Floating Daily Bonus + Wooden Welcome Note */}
        <div className="absolute right-0 top-1 z-20 flex flex-col items-end gap-1.5">
          <button
            type="button"
            onClick={onOpenDailyBonus}
            className="relative w-24 p-1.5 rounded-2xl bg-gradient-to-b from-[#49220B]/95 to-[#220E04]/95 border border-amber-400 text-center shadow-lg active:scale-95"
          >
            {dailyBonusAvailable && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 border border-amber-200 text-white text-[10px] font-black flex items-center justify-center">
                1
              </span>
            )}
            <div className="text-xl leading-none">🎁</div>
            <div className="text-[9px] font-extrabold text-amber-100 leading-tight mt-0.5">
              Ежедневный
              <br />
              бонус
            </div>
            <div className="text-[9px] font-mono font-bold text-amber-300 mt-0.5">
              {dailyBonusAvailable ? 'Забрать!' : '12:36:21'}
            </div>
          </button>

          <div
            className="w-24 p-1.5 rounded-xl bg-[#EAD1A2] border-2 border-[#78471E] text-[#3B1D08] text-[9px] font-bold text-center leading-tight shadow-md"
            style={{ fontFamily: "'Marck Script', cursive" }}
          >
            Добро пожаловать в русское лото! ❤️
          </div>
        </div>
      </div>

      {/* Primary Green Banner: БЫСТРАЯ ИГРА */}
      <button
        type="button"
        data-testid="lobby-quick-game-btn"
        onClick={onQuickGame}
        className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-b from-[#22C55E] via-[#15803D] to-[#14532D] border-2 border-[#FBBF24] shadow-[0_6px_14px_rgba(0,0,0,0.65)] flex items-center justify-between active:scale-[0.99] transition-transform"
      >
        <div className="flex items-center gap-1.5">
          <WoodenBarrel number={5} size="sm" />
          <WoodenBarrel number={24} size="sm" className="-ml-3" />
        </div>
        <div className="text-center flex-1">
          <div className="text-xl sm:text-2xl font-black text-[#FEF08A] tracking-wide drop-shadow">
            БЫСТРАЯ ИГРА
          </div>
          <div className="text-xs font-bold text-emerald-100">
            Играть прямо сейчас
          </div>
        </div>
        <span className="text-2xl font-black text-amber-300">›</span>
      </button>

      {/* 2x2 Feature Cards Grid: ВЫБРАТЬ СТОЛ, МОИ КАРТОЧКИ, ДРУЗЬЯ, МАГАЗИН */}
      <div className="grid grid-cols-2 gap-2 my-1.5">
        <button
          type="button"
          data-testid="lobby-select-table-btn"
          onClick={() => onSelectTableSetup()}
          className="p-2 rounded-2xl bg-gradient-to-br from-[#991B1B] via-[#7F1D1D] to-[#450A0A] border-2 border-[#F59E0B] flex items-center justify-between text-left shadow-md active:scale-95"
        >
          <div>
            <div className="text-xs sm:text-sm font-black text-amber-200 leading-tight">
              ВЫБРАТЬ СТОЛ
            </div>
            <div className="text-[10px] text-amber-100/80 leading-tight mt-0.5">
              Разные ставки и игроки
            </div>
          </div>
          <span className="text-lg font-black text-amber-300">›</span>
        </button>

        <button
          type="button"
          data-testid="lobby-my-cards-btn"
          onClick={onOpenMyCards}
          className="p-2 rounded-2xl bg-gradient-to-br from-[#1D4ED8] via-[#1E3A8A] to-[#172554] border-2 border-[#F59E0B] flex items-center justify-between text-left shadow-md active:scale-95"
        >
          <div>
            <div className="text-xs sm:text-sm font-black text-amber-200 leading-tight">
              МОИ КАРТОЧКИ
            </div>
            <div className="text-[10px] text-blue-100/80 leading-tight mt-0.5">
              Коллекция и настройки
            </div>
          </div>
          <span className="text-lg font-black text-amber-300">›</span>
        </button>

        <button
          type="button"
          data-testid="lobby-friends-btn"
          onClick={onOpenFriends}
          className="p-2 rounded-2xl bg-gradient-to-br from-[#7E22CE] via-[#581C87] to-[#3B0764] border-2 border-[#F59E0B] flex items-center justify-between text-left shadow-md active:scale-95"
        >
          <div>
            <div className="text-xs sm:text-sm font-black text-amber-200 leading-tight">
              ДРУЗЬЯ
            </div>
            <div className="text-[10px] text-purple-100/80 leading-tight mt-0.5">
              Играть вместе
            </div>
          </div>
          <span className="text-lg font-black text-amber-300">›</span>
        </button>

        <button
          type="button"
          data-testid="lobby-store-btn"
          onClick={() => onOpenStore('coins')}
          className="p-2 rounded-2xl bg-gradient-to-br from-[#B45309] via-[#78350F] to-[#451A03] border-2 border-[#F59E0B] flex items-center justify-between text-left shadow-md active:scale-95"
        >
          <div>
            <div className="text-xs sm:text-sm font-black text-amber-200 leading-tight">
              МАГАЗИН
            </div>
            <div className="text-[10px] text-amber-100/80 leading-tight mt-0.5">
              Монеты, бустеры и украшения
            </div>
          </div>
          <span className="text-lg font-black text-amber-300">›</span>
        </button>
      </div>

      {/* ДОСТУПНЫЕ СТОЛЫ Section */}
      <div className="my-1">
        <div className="flex items-center justify-between px-1 mb-1">
          <span className="text-xs font-extrabold text-amber-200 tracking-wide uppercase">
            🌿 Доступные столы
          </span>
          <button
            type="button"
            onClick={() => onSelectTableSetup()}
            className="text-[11px] font-bold text-amber-300 hover:underline"
          >
            Все столы ›
          </button>
        </div>

        <div className="grid grid-cols-6 gap-1">
          {AVAILABLE_LOBBY_TABLES.map((t) => (
            <div
              key={t.stake}
              className="bg-gradient-to-b from-[#3E1D0A] to-[#230E04] border border-amber-600/80 rounded-xl p-1 flex flex-col items-center text-center shadow"
            >
              <span className="text-xs">🪙</span>
              <span className="text-[11px] font-extrabold text-amber-200 tabular-nums leading-tight">
                {t.stake.toLocaleString('ru-RU')}
              </span>
              <span className="text-[9px] text-amber-100/75 tabular-nums my-0.5">
                👥 {t.onlineCount}
              </span>
              <button
                type="button"
                data-testid={`lobby-table-${t.stake}`}
                onClick={() => onSelectTableSetup(t.stake, t.defaultPlayers)}
                className="w-full py-0.5 rounded-md bg-gradient-to-b from-emerald-500 to-emerald-700 border border-emerald-300 text-white text-[9px] font-extrabold active:scale-95"
              >
                Играть
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation Bar: Главная, Турниры, Друзья, Задания, Магазин, Настройки */}
      <nav
        aria-label="Нижнее меню"
        className="grid grid-cols-6 gap-1 pt-1.5 border-t border-amber-700/60 mt-1"
      >
        <button
          type="button"
          className="flex flex-col items-center py-1 rounded-xl bg-amber-500/20 border border-amber-400 text-amber-200"
        >
          <span className="text-sm">🏠</span>
          <span className="text-[9px] font-extrabold">Главная</span>
        </button>
        <button
          type="button"
          onClick={onOpenTournaments}
          className="flex flex-col items-center py-1 rounded-xl bg-[#2B1306] border border-amber-800/70 text-amber-200/80 hover:text-amber-100"
        >
          <span className="text-sm">🏆</span>
          <span className="text-[9px] font-bold">Турниры</span>
        </button>
        <button
          type="button"
          onClick={onOpenFriends}
          className="flex flex-col items-center py-1 rounded-xl bg-[#2B1306] border border-amber-800/70 text-amber-200/80 hover:text-amber-100"
        >
          <span className="text-sm">👥</span>
          <span className="text-[9px] font-bold">Друзья</span>
        </button>
        <button
          type="button"
          onClick={onOpenQuests}
          className="relative flex flex-col items-center py-1 rounded-xl bg-[#2B1306] border border-amber-800/70 text-amber-200/80 hover:text-amber-100"
        >
          {unclaimedQuestsCount > 0 && (
            <span className="absolute top-0.5 right-2 w-3.5 h-3.5 rounded-full bg-red-600 text-white text-[8px] font-black flex items-center justify-center">
              !
            </span>
          )}
          <span className="text-sm">☑️</span>
          <span className="text-[9px] font-bold">Задания</span>
        </button>
        <button
          type="button"
          onClick={() => onOpenStore('coins')}
          className="flex flex-col items-center py-1 rounded-xl bg-[#2B1306] border border-amber-800/70 text-amber-200/80 hover:text-amber-100"
        >
          <span className="text-sm">🏪</span>
          <span className="text-[9px] font-bold">Магазин</span>
        </button>
        <button
          type="button"
          onClick={onOpenSettings}
          className="flex flex-col items-center py-1 rounded-xl bg-[#2B1306] border border-amber-800/70 text-amber-200/80 hover:text-amber-100"
        >
          <span className="text-sm">⚙️</span>
          <span className="text-[9px] font-bold">Настройки</span>
        </button>
      </nav>
    </div>
  );
};
