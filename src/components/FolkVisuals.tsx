import React from 'react';
import {
  LottoCard,
  LottoCell,
} from '../game/lottoRules';
import {
  FrameStyleId,
  REF_IMAGES,
} from '../game/storeAndSocialData';
import { FOLK_BARREL_CALLOUTS } from '../game/soundEngine';

export type HostessAnimState =
  | 'Idle'
  | 'ReachIntoBag'
  | 'SearchBag'
  | 'LiftBarrel'
  | 'ShowBarrel'
  | 'PlaceBarrel'
  | 'Celebrate'
  | 'Waiting';

/**
 * Crisp inline SVG icons to avoid missing font glyphs (tofu boxes) in headless Linux browsers
 */
export const StarSvgIcon: React.FC<{ className?: string }> = ({
  className = 'w-3 h-3 inline-block',
}) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export const CheckSvgIcon: React.FC<{ className?: string }> = ({
  className = 'w-4 h-4',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const MenuSvgIcon: React.FC<{ className?: string }> = ({
  className = 'w-5 h-5',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    className={className}
  >
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="18" x2="20" y2="18" />
  </svg>
);

export const LoginSvgIcon: React.FC<{ className?: string }> = ({
  className = 'w-4 h-4',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <polyline points="10 17 15 12 10 7" />
    <line x1="15" y1="12" x2="3" y2="12" />
  </svg>
);

interface SpriteCropProps {
  src: string;
  x: number;
  y: number;
  w: number;
  h: number;
  className?: string;
  roundedClass?: string;
  label?: string;
}

/**
 * Extracts a crisp responsive sprite region (x, y, w, h) from a 941x1672 reference image sheet.
 */
export const SpriteCrop: React.FC<SpriteCropProps> = ({
  src,
  x,
  y,
  w,
  h,
  className = '',
  roundedClass = '',
  label,
}) => {
  return (
    <div
      className={`overflow-hidden select-none pointer-events-none ${roundedClass} ${className}`}
      aria-label={label}
    >
      <svg
        viewBox={`${x} ${y} ${w} ${h}`}
        className="w-full h-full block"
        preserveAspectRatio="xMidYMid slice"
      >
        <image href={src} width="941" height="1672" />
      </svg>
    </div>
  );
};

/**
 * Portraits coordinates on screen5Friends (941x1672)
 */
const AVATAR_COORDS: Record<
  'aleksey' | 'katya' | 'ded_sanya' | 'olga' | 'sergey',
  { x: number; y: number; w: number; h: number }
> = {
  aleksey: { x: 64, y: 334, w: 112, h: 112 },
  katya: { x: 64, y: 460, w: 112, h: 112 },
  ded_sanya: { x: 64, y: 586, w: 112, h: 112 },
  olga: { x: 64, y: 711, w: 112, h: 112 },
  sergey: { x: 64, y: 836, w: 112, h: 112 },
};

export interface PlayerAvatarProps {
  name: string;
  rating: string;
  avatarKey: 'aleksey' | 'katya' | 'ded_sanya' | 'olga' | 'sergey';
  frame?: FrameStyleId;
  isVip?: boolean;
  title?: string;
  online?: boolean;
  reaction?: string | null;
  phraseBubble?: string | null;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

/**
 * Renders a player avatar with decorative Russian folk frame, VIP crown/badge, online dot,
 * nickname, star rating, and active reaction/phrase overlay.
 */
export const PlayerAvatarBadge: React.FC<PlayerAvatarProps> = ({
  name,
  rating,
  avatarKey,
  frame = 'none',
  isVip = false,
  title,
  online = true,
  reaction,
  phraseBubble,
  size = 'md',
  onClick,
}) => {
  const coords = AVATAR_COORDS[avatarKey] || AVATAR_COORDS.aleksey;
  const dimClass =
    size === 'sm'
      ? 'w-11 h-11'
      : size === 'lg'
      ? 'w-20 h-20'
      : 'w-13 h-13 sm:w-14 sm:h-14';

  const frameBorderStyle = () => {
    switch (frame) {
      case 'vip_gold':
        return 'ring-2 ring-amber-300 border-2 border-yellow-500 shadow-[0_0_10px_rgba(245,158,11,0.7)]';
      case 'chamomile':
        return 'ring-2 ring-lime-300 border-2 border-white shadow-[0_0_8px_rgba(132,204,22,0.6)]';
      case 'kalina':
        return 'ring-2 ring-red-500 border-2 border-amber-400 shadow-[0_0_8px_rgba(220,38,38,0.6)]';
      case 'winter':
        return 'ring-2 ring-sky-300 border-2 border-cyan-100 shadow-[0_0_10px_rgba(56,189,248,0.75)]';
      default:
        return 'border-2 border-amber-500/80 shadow-md';
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Игрок ${name}, рейтинг ${rating}`}
      className="group relative flex flex-col items-center focus:outline-none transition-transform active:scale-95"
    >
      {/* Speech Bubble for Phrases */}
      {phraseBubble && (
        <div className="absolute -top-8 z-30 whitespace-nowrap bg-[#FFF8E7] text-[#3B1E08] border-2 border-amber-600 rounded-xl px-2 py-0.5 text-[10px] font-bold shadow-lg animate-bounce">
          {phraseBubble}
          <div className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-2 h-2 bg-[#FFF8E7] border-r-2 border-b-2 border-amber-600 rotate-45" />
        </div>
      )}

      {/* Animated Emoji Reaction Overlay */}
      {reaction && (
        <div className="absolute -right-2 -top-2 z-30 text-xl drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)] animate-bounce">
          {reaction}
        </div>
      )}

      {/* Avatar Circle + Frame */}
      <div
        className={`relative ${dimClass} rounded-full p-0.5 bg-gradient-to-b from-amber-300 via-amber-600 to-amber-900 ${frameBorderStyle()}`}
      >
        <SpriteCrop
          src={REF_IMAGES.screen5Friends}
          x={coords.x}
          y={coords.y}
          w={coords.w}
          h={coords.h}
          roundedClass="rounded-full"
          className="w-full h-full"
        />

        {/* Decorative Frame Accents */}
        {frame === 'chamomile' && (
          <>
            <span className="pointer-events-none absolute -top-1 -left-1 text-[10px] drop-shadow">
              🌼
            </span>
            <span className="pointer-events-none absolute -bottom-1 -right-1 text-[10px] drop-shadow">
              🌼
            </span>
          </>
        )}
        {frame === 'kalina' && (
          <>
            <span className="pointer-events-none absolute -top-1 -right-1 text-[10px] drop-shadow">
              🍒
            </span>
            <span className="pointer-events-none absolute -bottom-1 -left-1 text-[10px] drop-shadow">
              🍒
            </span>
          </>
        )}
        {frame === 'winter' && (
          <>
            <span className="pointer-events-none absolute -top-1 -left-1 text-[10px] drop-shadow">
              ❄️
            </span>
            <span className="pointer-events-none absolute -bottom-1 -right-1 text-[10px] drop-shadow">
              ❄️
            </span>
          </>
        )}

        {/* VIP Crown / Label */}
        {(isVip || frame === 'vip_gold') && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-gradient-to-b from-yellow-300 via-amber-500 to-amber-700 text-[#2D1404] border border-yellow-100 rounded px-1 py-0 text-[8px] font-black tracking-wider shadow leading-tight">
            VIP
          </div>
        )}

        {/* Online Green Dot */}
        <span
          className={`absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full border border-[#2A1405] ${
            online ? 'bg-emerald-500' : 'bg-rose-500'
          }`}
        />
      </div>

      {/* Compact Nameplate */}
      <div className="mt-0.5 bg-[#261105]/95 border border-amber-700/70 rounded-md px-1.5 py-0.5 text-center shadow min-w-[62px]">
        <div className="text-[10px] font-extrabold text-[#FFF3D1] leading-none truncate max-w-[74px]">
          {name}
        </div>
        {title && size !== 'sm' && (
          <div className="text-[7px] font-extrabold text-amber-300 uppercase tracking-tight leading-none mt-0.5">
            {title}
          </div>
        )}
        <div className="flex items-center justify-center gap-0.5 text-[9px] font-bold text-amber-400 tabular-nums leading-tight mt-0.5">
          <StarSvgIcon className="w-2.5 h-2.5 text-amber-400 shrink-0" />
          <span>{rating}</span>
        </div>
      </div>
    </button>
  );
};

interface WoodenBarrelProps {
  number: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isNewest?: boolean;
  isSelected?: boolean;
  subtitle?: string;
  onClick?: () => void;
  className?: string;
}

/**
 * Realistic wooden Russian Lotto barrel with carved wood rings, crimson number circle,
 * and traditional floral ornament. Uses lining-nums tabular-nums so digits never sink.
 */
export const WoodenBarrel: React.FC<WoodenBarrelProps> = ({
  number,
  size = 'md',
  isNewest = false,
  isSelected = false,
  subtitle,
  onClick,
  className = '',
}) => {
  const isLargeStakeNum = number >= 1000;
  const isMidStakeNum = number >= 100 && number < 1000;

  const sizeMap = {
    sm: isLargeStakeNum
      ? 'w-12 h-13 text-[11px]'
      : isMidStakeNum
      ? 'w-12 h-13 text-sm'
      : 'w-11 h-12 text-base',
    md: 'w-14 h-16 text-xl sm:w-16 sm:h-[68px] sm:text-2xl',
    lg: 'w-16 h-[74px] text-2xl sm:w-20 sm:h-[84px] sm:text-3xl',
    xl: 'w-24 h-28 text-4xl',
  };

  const Tag = onClick ? 'button' : 'div';

  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`relative inline-flex flex-col items-center justify-center select-none transition-all duration-300 ${
        sizeMap[size]
      } ${
        onClick ? 'cursor-pointer active:scale-95 focus:outline-none' : ''
      } ${className}`}
    >
      {/* Glow if newest or selected */}
      {(isNewest || isSelected) && (
        <div className="absolute -inset-1 rounded-2xl bg-amber-400/55 blur-md pointer-events-none animate-pulse" />
      )}

      {/* Barrel SVG Body */}
      <svg
        viewBox="0 0 100 112"
        className="w-full h-full drop-shadow-[0_5px_7px_rgba(0,0,0,0.65)]"
      >
        <defs>
          <linearGradient
            id={`woodGrad-${number}-${size}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#9A5B25" />
            <stop offset="22%" stopColor="#DDA15E" />
            <stop offset="50%" stopColor="#F3C98B" />
            <stop offset="78%" stopColor="#C8823B" />
            <stop offset="100%" stopColor="#783F12" />
          </linearGradient>
          <radialGradient
            id={`faceGrad-${number}-${size}`}
            cx="50%"
            cy="45%"
            r="50%"
          >
            <stop offset="0%" stopColor="#FFF8E7" />
            <stop offset="75%" stopColor="#F2D399" />
            <stop offset="100%" stopColor="#CFA05A" />
          </radialGradient>
        </defs>

        {/* Ground contact shadow directly on wooden table */}
        <ellipse cx="50" cy="106" rx="38" ry="5" fill="rgba(20, 8, 2, 0.65)" />

        {/* Barrel Rounded Cylinder Silhouette */}
        <path
          d="M 20 14 Q 50 4 80 14 C 94 36 94 74 80 98 Q 50 108 20 98 C 6 74 6 36 20 14 Z"
          fill={`url(#woodGrad-${number}-${size})`}
          stroke={isSelected || isNewest ? '#FDE047' : '#5C2D0C'}
          strokeWidth={isSelected || isNewest ? '3.5' : '2'}
        />

        {/* Top perspective rim */}
        <ellipse
          cx="50"
          cy="15"
          rx="30"
          ry="7"
          fill="#E7B97A"
          stroke="#783F12"
          strokeWidth="1.5"
        />
        <ellipse
          cx="50"
          cy="15"
          rx="18"
          ry="4"
          fill="none"
          stroke="#991B1B"
          strokeWidth="1.2"
        />

        {/* Carved horizontal wood grooves */}
        <path
          d="M 12 31 Q 50 38 88 31"
          fill="none"
          stroke="#783F12"
          strokeWidth="1.5"
          opacity="0.7"
        />
        <path
          d="M 12 83 Q 50 90 88 83"
          fill="none"
          stroke="#783F12"
          strokeWidth="1.5"
          opacity="0.7"
        />

        {/* Folk floral accents on top and bottom */}
        <circle cx="50" cy="24" r="3" fill="#B91C1C" />
        <circle cx="43" cy="25" r="1.8" fill="#15803D" />
        <circle cx="57" cy="25" r="1.8" fill="#15803D" />
        <circle cx="50" cy="95" r="3" fill="#B91C1C" />
        <circle cx="42" cy="94" r="1.8" fill="#15803D" />
        <circle cx="58" cy="94" r="1.8" fill="#15803D" />

        {/* Center Medallion Circle with Red Rim */}
        <circle
          cx="50"
          cy="58"
          r="28"
          fill={`url(#faceGrad-${number}-${size})`}
          stroke="#B91C1C"
          strokeWidth="4.5"
        />
        <circle
          cx="50"
          cy="58"
          r="24"
          fill="none"
          stroke="#D97706"
          strokeWidth="1"
          opacity="0.65"
        />
      </svg>

      {/* Barrel Number — strictly centered lining numerals */}
      <span
        className="absolute inset-0 flex items-center justify-center pt-1.5 font-extrabold text-[#991B1B] tabular-nums tracking-tighter drop-shadow-[0_1px_0_rgba(255,255,255,0.75)]"
        style={{
          fontVariantNumeric: 'lining-nums tabular-nums',
        }}
      >
        {number}
      </span>

      {subtitle && (
        <span className="mt-0.5 text-[10px] font-bold text-amber-200 whitespace-nowrap">
          {subtitle}
        </span>
      )}
    </Tag>
  );
};

interface BarrelQueueRowProps {
  visibleBarrels: number[];
  exitingBarrel: number | null;
  activeWindowBarrels: number[];
}

/**
 * Displays the 5 most recently drawn wooden barrels sitting directly on the wooden table surface.
 * NO tray, NO container, NO stand under the barrels.
 * Animates sliding transitions as new barrels are placed at the start of the row.
 */
export const BarrelQueueRow: React.FC<BarrelQueueRowProps> = ({
  visibleBarrels,
  exitingBarrel,
  activeWindowBarrels,
}) => {
  return (
    <div
      data-testid="barrel-queue-row"
      className="relative w-full flex items-end justify-center gap-2 sm:gap-3 py-1 px-2 min-h-[70px]"
    >
      {visibleBarrels.length === 0 && (
        <div className="text-xs font-semibold text-amber-200/80 italic py-4">
          Ведущая готовит первый бочонок...
        </div>
      )}

      {visibleBarrels.map((barrelNum, idx) => {
        const isNewest = idx === 0;
        const isActiveWindow = activeWindowBarrels.includes(barrelNum);
        return (
          <div
            key={barrelNum}
            data-barrel-num={barrelNum}
            className={`transition-all duration-500 ease-out flex flex-col items-center ${
              isNewest ? 'scale-105 -translate-y-0.5' : 'scale-100'
            }`}
          >
            <WoodenBarrel
              number={barrelNum}
              size="md"
              isNewest={isNewest}
              isSelected={isActiveWindow}
            />
          </div>
        );
      })}

      {/* 6th barrel smoothly fading out as it slides off the right end */}
      {exitingBarrel !== null && (
        <div
          key={`exit-${exitingBarrel}`}
          className="opacity-0 translate-x-4 scale-90 transition-all duration-500 pointer-events-none hidden sm:block"
        >
          <WoodenBarrel number={exitingBarrel} size="sm" />
        </div>
      )}
    </div>
  );
};

interface HostessGameplayStageProps {
  animState: HostessAnimState;
  currentBarrel: number | null;
  opponentsLeft: PlayerAvatarProps[];
  opponentsRight: PlayerAvatarProps[];
  onOpenDecorations?: () => void;
}

/**
 * Upper Zone of the Gameplay Screen:
 * - Central animated female hostess in traditional red-and-white Russian outfit behind the table
 * - Cloth bag with red embroidery in front of her
 * - Multi-phase draw animation (Idle -> ReachIntoBag -> SearchBag -> LiftBarrel -> ShowBarrel -> PlaceBarrel)
 * - Opponent avatars positioned on left and right sides according to selected 3/5/7 table size
 */
export const HostessGameplayStage: React.FC<HostessGameplayStageProps> = ({
  animState,
  currentBarrel,
  opponentsLeft,
  opponentsRight,
  onOpenDecorations,
}) => {
  const callout = currentBarrel ? FOLK_BARREL_CALLOUTS[currentBarrel] : undefined;

  const torsoMotion =
    animState === 'ReachIntoBag' || animState === 'SearchBag'
      ? 'translate-y-1 rotate-[-1deg]'
      : animState === 'LiftBarrel' || animState === 'ShowBarrel'
      ? '-translate-y-0.5 scale-[1.01]'
      : animState === 'Celebrate'
      ? '-translate-y-1 scale-[1.03]'
      : 'translate-y-0';

  return (
    <div
      data-testid="hostess-stage"
      data-hostess-state={animState}
      className="relative w-full h-[238px] sm:h-[255px] select-none overflow-hidden"
    >
      {/* Warm Russian wooden room background */}
      <div className="absolute inset-0">
        <SpriteCrop
          src={REF_IMAGES.screen6Gameplay}
          x={195}
          y={0}
          w={550}
          h={480}
          className="w-full h-full opacity-40 blur-[2px] scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2A1205]/40 via-transparent to-[#3B1907]" />
      </div>

      {/* Central Animated Hostess Figure + Seamless Cloth Bag */}
      <div
        className={`relative mx-auto w-[235px] sm:w-[265px] h-full transition-transform duration-500 ease-in-out ${torsoMotion}`}
      >
        <SpriteCrop
          src={REF_IMAGES.screen6Gameplay}
          x={195}
          y={18}
          w={550}
          h={525}
          className="w-full h-full drop-shadow-[0_8px_16px_rgba(0,0,0,0.7)]"
          roundedClass="rounded-b-3xl"
          label="Ведущая Русского лото"
        />

        {/* Subtle warm glow over the embroidered bag when hostess searches for a barrel */}
        {(animState === 'ReachIntoBag' || animState === 'SearchBag') && (
          <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 w-28 h-16 rounded-full bg-amber-300/25 blur-md animate-pulse" />
        )}

        {/* Dynamic Animated Barrel during LiftBarrel / ShowBarrel / PlaceBarrel */}
        {currentBarrel !== null &&
          (animState === 'LiftBarrel' ||
            animState === 'ShowBarrel' ||
            animState === 'PlaceBarrel') && (
            <div
              className={`absolute left-1/2 -translate-x-1/2 z-30 transition-all duration-500 ease-out ${
                animState === 'LiftBarrel'
                  ? 'bottom-14 scale-75 opacity-90'
                  : animState === 'ShowBarrel'
                  ? 'bottom-20 scale-110 opacity-100'
                  : 'bottom-1 scale-90 opacity-85 translate-y-6'
              }`}
            >
              <div className="relative flex flex-col items-center">
                {animState === 'ShowBarrel' && (
                  <div className="mb-1 px-2.5 py-0.5 rounded-full bg-[#4A1208]/95 border border-amber-400 text-amber-200 text-[11px] font-bold shadow-lg whitespace-nowrap">
                    Бочонок № {currentBarrel}
                    {callout ? ` — «${callout}»` : '!'}
                  </div>
                )}
                <WoodenBarrel
                  number={currentBarrel}
                  size={animState === 'ShowBarrel' ? 'lg' : 'md'}
                  isNewest
                />
              </div>
            </div>
          )}
      </div>

      {/* Left Side Opponents (1, 2, or 3 depending on 3/5/7 players) */}
      <div className="absolute left-1.5 sm:left-3 top-1.5 bottom-1.5 z-20 flex flex-col justify-around">
        {opponentsLeft.map((opp, idx) => (
          <PlayerAvatarBadge
            key={`left-${opp.name}-${idx}`}
            {...opp}
            size={opponentsLeft.length >= 3 ? 'sm' : 'md'}
          />
        ))}
      </div>

      {/* Right Side Opponents (1, 2, or 3 depending on 3/5/7 players) */}
      <div className="absolute right-1.5 sm:right-3 top-9 bottom-1.5 z-20 flex flex-col justify-around">
        {opponentsRight.map((opp, idx) => (
          <PlayerAvatarBadge
            key={`right-${opp.name}-${idx}`}
            {...opp}
            size={opponentsRight.length >= 3 ? 'sm' : 'md'}
          />
        ))}
      </div>

      {/* Top-Right "Рамки и значки" quick cosmetic button matching Reference 6 */}
      {onOpenDecorations && (
        <button
          type="button"
          onClick={onOpenDecorations}
          className="absolute top-1 right-1.5 z-30 flex items-center gap-1 bg-gradient-to-b from-[#3E1C08] to-[#230E03] border border-amber-500/80 rounded-xl px-2 py-0.5 text-[9px] font-bold text-amber-100 shadow-lg hover:border-amber-300 active:scale-95"
        >
          <span className="text-xs">👑</span>
          <span className="leading-tight text-left">
            Рамки и значки
          </span>
          <span className="text-amber-400 ml-0.5">›</span>
        </button>
      )}
    </div>
  );
};

interface StraightLottoCardProps {
  card: LottoCard;
  interactive?: boolean;
  selectedForSetup?: boolean;
  compactSetupMode?: boolean;
  activePopupCell: { cardId: string; row: number; col: number } | null;
  fixCost?: number;
  onCellTap?: (cardId: string, row: number, col: number, cell: LottoCell) => void;
  onConfirmRemoveCross?: (cardId: string, row: number, col: number) => void;
  onCancelRemoveCross?: () => void;
  onCardSelectToggle?: (cardId: string) => void;
}

/**
 * Folk vertical embroidery border SVG used on the left and right sides of every Russian Lotto card.
 */
const FolkCardSideBorder: React.FC = () => (
  <div className="w-5 sm:w-7 shrink-0 h-full bg-[#EFE0BE] border-x border-[#B5925B]/60 flex flex-col items-center justify-around py-1 select-none pointer-events-none">
    <svg viewBox="0 0 24 90" className="w-full h-full">
      <g fill="#B91C1C">
        <rect x="10" y="6" width="4" height="4" />
        <rect x="6" y="10" width="4" height="4" />
        <rect x="14" y="10" width="4" height="4" />
        <rect x="10" y="14" width="4" height="4" />
        <rect x="10" y="28" width="4" height="4" />
        <rect x="6" y="32" width="12" height="4" />
        <rect x="4" y="36" width="4" height="4" />
        <rect x="16" y="36" width="4" height="4" />
        <rect x="6" y="40" width="12" height="4" />
        <rect x="10" y="44" width="4" height="4" />
        <rect x="10" y="58" width="4" height="4" />
        <rect x="6" y="62" width="4" height="4" />
        <rect x="14" y="62" width="4" height="4" />
        <rect x="10" y="66" width="4" height="4" />
        <rect x="8" y="76" width="8" height="4" />
      </g>
      <g fill="#15803D">
        <rect x="4" y="20" width="4" height="4" />
        <rect x="16" y="20" width="4" height="4" />
        <rect x="10" y="22" width="4" height="3" />
        <rect x="4" y="50" width="4" height="4" />
        <rect x="16" y="50" width="4" height="4" />
        <rect x="10" y="52" width="4" height="3" />
        <rect x="4" y="80" width="4" height="4" />
        <rect x="16" y="80" width="4" height="4" />
      </g>
    </svg>
  </div>
);

/**
 * ABSOLUTE RULE IMPLEMENTATION:
 * Perfectly flat rectangular Russian Lotto card (`rotationZ = 0f`, zero skew, zero perspective).
 * 3 rows x 9 columns with 5 numbers per row, 15 per card.
 */
export const StraightLottoCard: React.FC<StraightLottoCardProps> = ({
  card,
  interactive = true,
  selectedForSetup = false,
  compactSetupMode = false,
  activePopupCell,
  fixCost = 50,
  onCellTap,
  onConfirmRemoveCross,
  onCancelRemoveCross,
  onCardSelectToggle,
}) => {
  const isSetupCard = Boolean(onCardSelectToggle);

  return (
    <div
      data-testid={`lotto-card-${card.id}`}
      onClick={isSetupCard ? () => onCardSelectToggle?.(card.id) : undefined}
      style={{ transform: 'rotate(0deg) skew(0deg, 0deg)' }}
      className={`relative w-full mx-auto rounded-lg bg-[#F5E6C4] p-1 sm:p-1.5 shadow-[0_4px_10px_rgba(0,0,0,0.55)] transition-shadow ${
        selectedForSetup
          ? 'ring-[3px] ring-[#22C55E] shadow-[0_0_16px_rgba(34,197,94,0.75)]'
          : 'border-2 border-[#8B5E2A]'
      } ${isSetupCard ? 'cursor-pointer active:scale-[0.99]' : ''}`}
    >
      {/* Green Checkmark SVG Badge when selected in Screen 3 Game Setup */}
      {selectedForSetup && (
        <div
          data-testid={`selected-check-${card.id}`}
          className="absolute -top-2.5 -right-2.5 z-20 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600 border-2 border-white flex items-center justify-center text-white shadow-md"
        >
          <CheckSvgIcon className="w-3.5 h-3.5" />
        </div>
      )}

      {/* Inner Double Border Frame */}
      <div className="flex items-stretch w-full border border-[#7C5324] bg-[#F8EBD0]">
        {/* Left Folk Embroidery Column */}
        {!compactSetupMode && <FolkCardSideBorder />}

        {/* 3x9 Number Grid */}
        <div className="flex-1 grid grid-rows-3 divide-y divide-[#8C6639]/70">
          {card.grid.map((rowCells, rIdx) => (
            <div
              key={`row-${rIdx}`}
              className="grid grid-cols-9 divide-x divide-[#8C6639]/70"
            >
              {rowCells.map((cell, cIdx) => {
                const isPopupOpen =
                  activePopupCell?.cardId === card.id &&
                  activePopupCell?.row === rIdx &&
                  activePopupCell?.col === cIdx;

                const cellHeight = compactSetupMode
                  ? 'h-6 sm:h-7 text-[11px] sm:text-xs'
                  : 'h-9 sm:h-11 text-base sm:text-xl';

                return (
                  <div
                    key={`cell-${rIdx}-${cIdx}`}
                    className={`relative flex items-center justify-center ${cellHeight} ${
                      cell.number === null ? 'bg-[#EFE0BE]/45' : 'bg-[#FAF0D7]'
                    }`}
                  >
                    {cell.number !== null && (
                      <button
                        type="button"
                        disabled={!interactive || isSetupCard}
                        data-testid={`cell-${card.id}-${rIdx}-${cIdx}`}
                        data-number={cell.number}
                        data-cell-state={cell.state}
                        aria-label={`Карточка ${card.id}, число ${cell.number}, статус ${cell.state}`}
                        onClick={(e) => {
                          if (isSetupCard) return;
                          e.stopPropagation();
                          onCellTap?.(card.id, rIdx, cIdx, cell);
                        }}
                        className={`w-full h-full flex items-center justify-center font-extrabold tabular-nums select-none focus:outline-none ${
                          interactive && !isSetupCard
                            ? 'cursor-pointer active:bg-amber-200/60'
                            : 'cursor-default'
                        }`}
                        style={{
                          fontVariantNumeric: 'lining-nums tabular-nums',
                          color: '#1F1209',
                        }}
                      >
                        {/* Underlying Number */}
                        <span className="leading-none">{cell.number}</span>

                        {/* Marked State: Realistic Red Round Token */}
                        {cell.state === 'marked' && (
                          <span
                            data-testid={`marked-token-${cell.number}`}
                            className="absolute inset-0.5 sm:inset-1 m-auto w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-gradient-to-b from-[#EF4444] via-[#DC2626] to-[#991B1B] border-2 border-[#FCA5A5] shadow-[0_2px_5px_rgba(0,0,0,0.45)] flex items-center justify-center text-white font-extrabold animate-[scaleIn_150ms_ease-out]"
                          >
                            {cell.number}
                          </span>
                        )}

                        {/* Missed State: Red X Cross */}
                        {cell.state === 'missed' && (
                          <span
                            data-testid={`missed-cross-${cell.number}`}
                            className="absolute inset-0 flex items-center justify-center bg-red-500/10"
                          >
                            <svg
                              viewBox="0 0 36 36"
                              className="w-6 h-6 sm:w-8 sm:h-8 drop-shadow-[0_2px_3px_rgba(0,0,0,0.4)]"
                            >
                              <path
                                d="M 7 7 L 29 29 M 29 7 L 7 29"
                                stroke="#DC2626"
                                strokeWidth="5"
                                strokeLinecap="round"
                              />
                              <path
                                d="M 7 7 L 29 29 M 29 7 L 7 29"
                                stroke="#F87171"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              />
                            </svg>
                          </span>
                        )}
                      </button>
                    )}

                    {/* Inline "Убрать крестик — 50 монет" Confirmation Popup near the missed cell */}
                    {isPopupOpen && (
                      <div
                        data-testid="remove-cross-popup"
                        onClick={(e) => e.stopPropagation()}
                        className="absolute z-40 bottom-full mb-1.5 left-1/2 -translate-x-1/2 w-48 bg-gradient-to-b from-[#FFF6DF] to-[#EAD29E] border-2 border-[#8B4513] rounded-xl p-2 shadow-[0_8px_20px_rgba(0,0,0,0.75)] text-[#2D1405]"
                      >
                        <div className="text-xs font-extrabold text-center leading-tight">
                          Убрать крестик
                        </div>
                        <div className="flex items-center justify-center gap-1 my-1 text-xs font-black text-[#B45309]">
                          <span>🪙</span>
                          <span>{fixCost} монет</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <button
                            type="button"
                            onClick={onCancelRemoveCross}
                            className="flex-1 py-1 rounded-lg bg-[#6B3E26] text-amber-100 text-[11px] font-bold hover:bg-[#542F1C]"
                          >
                            Отмена
                          </button>
                          <button
                            type="button"
                            data-testid="confirm-remove-cross-btn"
                            onClick={() =>
                              onConfirmRemoveCross?.(card.id, rIdx, cIdx)
                            }
                            className="flex-1 py-1 rounded-lg bg-gradient-to-b from-emerald-500 to-emerald-700 border border-emerald-300 text-white text-[11px] font-extrabold shadow"
                          >
                            Убрать
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Right Folk Embroidery Column */}
        {!compactSetupMode && <FolkCardSideBorder />}
      </div>
    </div>
  );
};
