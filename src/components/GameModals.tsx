import React, { useState } from 'react';
import {
  QuestItem,
  TournamentItem,
} from '../game/storeAndSocialData';

interface TutorialModalProps {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<TutorialModalProps> = ({ onClose }) => {
  return (
    <div
      data-testid="modal-howto"
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-gradient-to-b from-[#431F0A] to-[#1F0D04] border-2 border-amber-500 rounded-2xl p-4 text-amber-100 shadow-2xl max-h-[88vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between pb-2 border-b border-amber-700">
          <h3 className="text-lg font-black text-amber-300">
            📖 Как играть в «Русское лото»
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-amber-900 text-amber-200 font-bold"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 my-3 text-xs leading-relaxed">
          <div className="bg-[#2B1306] border border-amber-700/70 rounded-xl p-2.5">
            <div className="font-extrabold text-amber-300 mb-1">
              1. Классические карточки и бочонки (1–90)
            </div>
            <p>
              Перед началом партии вы выбираете <b>3 карточки из 6</b>. В каждой
              карточке 3 строки и 9 столбцов (по 5 чисел в каждой строке, всего
              15 уникальных чисел). Ведущая достаёт из мешочка деревянные бочонки
              с номерами от 1 до 90. На столе всегда видны <b>5 последних бочонков</b>.
            </p>
          </div>

          <div className="bg-[#2B1306] border border-amber-700/70 rounded-xl p-2.5">
            <div className="font-extrabold text-amber-300 mb-1">
              2. Как отмечать числа (🔴)
            </div>
            <p>
              Когда ведущая достаёт бочонок, у вас есть время (по умолчанию 7
              секунд), чтобы нажать на совпадающее число в своих карточках. На
              числе появится красная фишка.
            </p>
          </div>

          <div className="bg-[#2B1306] border border-amber-700/70 rounded-xl p-2.5">
            <div className="font-extrabold text-rose-300 mb-1">
              3. Пропущенные числа (✕) и как убрать крестик
            </div>
            <p>
              Если выпавшее число есть в вашей карточке, но вы не успели его
              отметить, на клетке появится <b>красный крестик (✕)</b>. Клетка с
              крестиком не считается отмеченной! Нажмите на красный крестик,
              чтобы открыть окно <b>«Убрать крестик» за 50 монет</b> и заменить
              его на победную фишку.
            </p>
          </div>

          <div className="bg-[#2B1306] border border-amber-700/70 rounded-xl p-2.5">
            <div className="font-extrabold text-emerald-300 mb-1">
              4. Условия победы
            </div>
            <p>
              В режиме <b>«Короткая игра»</b> побеждает тот, кто первым закроет
              все 5 чисел любой горизонтальной строки на одной из своих карточек.
              В режиме <b>«Полная карточка»</b> нужно закрыть все 15 чисел одной
              карточки. Победа определяется автоматически!
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-gradient-to-b from-emerald-500 to-emerald-700 border border-emerald-300 text-white font-extrabold text-sm shadow"
        >
          Понятно, к игре!
        </button>
      </div>
    </div>
  );
};

interface DailyBonusModalProps {
  available: boolean;
  streakDay: number;
  onClaim: (amount: number) => void;
  onClose: () => void;
}

export const DailyBonusModal: React.FC<DailyBonusModalProps> = ({
  available,
  streakDay,
  onClaim,
  onClose,
}) => {
  const rewards = [250, 400, 500, 750, 1000, 1500, 2500];
  const currentReward = rewards[(streakDay - 1) % rewards.length] || 500;

  return (
    <div
      data-testid="modal-daily-bonus"
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-gradient-to-b from-[#4B220B] to-[#210D03] border-2 border-amber-400 rounded-2xl p-4 text-center text-amber-100 shadow-2xl"
      >
        <div className="text-3xl mb-1">🎁</div>
        <h3 className="text-xl font-black text-amber-300">
          Ежедневный бонус
        </h3>
        <p className="text-xs text-amber-200/80 mb-3">
          Заходите в «Русское лото» каждый день и получайте бесплатные монеты!
        </p>

        <div className="grid grid-cols-4 gap-1.5 mb-3">
          {rewards.map((amt, idx) => {
            const dayNum = idx + 1;
            const isCurrent = dayNum === streakDay;
            return (
              <div
                key={dayNum}
                className={`p-1.5 rounded-xl border text-center ${
                  idx === 6 ? 'col-span-2' : ''
                } ${
                  isCurrent
                    ? 'bg-gradient-to-b from-amber-400 to-amber-600 border-yellow-100 text-[#2E1204] font-black shadow-md'
                    : 'bg-[#2B1306] border-amber-800 text-amber-200'
                }`}
              >
                <div className="text-[10px]">День {dayNum}</div>
                <div className="text-xs font-extrabold tabular-nums">
                  🪙 {amt}
                </div>
              </div>
            );
          })}
        </div>

        {available ? (
          <button
            type="button"
            data-testid="claim-daily-bonus-confirm-btn"
            onClick={() => onClaim(currentReward)}
            className="w-full py-2.5 rounded-xl bg-gradient-to-b from-emerald-500 to-emerald-700 border border-emerald-300 text-white font-black text-base shadow-lg active:scale-95"
          >
            Забрать +{currentReward} монет!
          </button>
        ) : (
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 rounded-xl bg-[#5C2D12] text-amber-200 font-bold text-sm"
          >
            Бонус на сегодня уже получен ✓
          </button>
        )}
      </div>
    </div>
  );
};

interface QuestsModalProps {
  quests: QuestItem[];
  onClaimQuest: (questId: string) => void;
  onClose: () => void;
}

export const QuestsModal: React.FC<QuestsModalProps> = ({
  quests,
  onClaimQuest,
  onClose,
}) => {
  return (
    <div
      data-testid="modal-quests"
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-gradient-to-b from-[#431F0A] to-[#1F0D04] border-2 border-amber-500 rounded-2xl p-4 text-amber-100 shadow-2xl"
      >
        <div className="flex items-center justify-between pb-2 border-b border-amber-700">
          <h3 className="text-lg font-black text-amber-300">
            ☑️ Ежедневные задания
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-amber-900 text-amber-200 font-bold"
          >
            ✕
          </button>
        </div>

        <div className="space-y-2.5 my-3">
          {quests.map((q) => {
            const completed = q.progress >= q.target;
            const pct = Math.min(100, Math.round((q.progress / q.target) * 100));
            return (
              <div
                key={q.id}
                className="bg-[#2B1306] border border-amber-700 rounded-xl p-2.5 flex items-center justify-between gap-3"
              >
                <div className="flex-1">
                  <div className="text-xs font-extrabold text-white">
                    {q.title}
                  </div>
                  <div className="w-full h-2 bg-[#160902] rounded-full overflow-hidden my-1 border border-amber-900">
                    <div
                      style={{ width: `${pct}%` }}
                      className="h-full bg-gradient-to-r from-amber-400 to-emerald-500"
                    />
                  </div>
                  <div className="text-[10px] text-amber-300 font-bold tabular-nums">
                    Прогресс: {q.progress}/{q.target} · Награда: 🪙 {q.rewardCoins}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!completed || q.claimed}
                  onClick={() => onClaimQuest(q.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold shrink-0 ${
                    q.claimed
                      ? 'bg-stone-700 text-stone-400'
                      : completed
                      ? 'bg-emerald-600 text-white shadow active:scale-95'
                      : 'bg-amber-900/60 text-amber-300/70'
                  }`}
                >
                  {q.claimed ? 'Получено ✓' : completed ? 'Забрать' : 'В процессе'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface TournamentsModalProps {
  tournaments: TournamentItem[];
  onJoinTournament: (id: string) => void;
  onClose: () => void;
}

export const TournamentsModal: React.FC<TournamentsModalProps> = ({
  tournaments,
  onJoinTournament,
  onClose,
}) => {
  return (
    <div
      data-testid="modal-tournaments"
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-gradient-to-b from-[#431F0A] to-[#1F0D04] border-2 border-amber-500 rounded-2xl p-4 text-amber-100 shadow-2xl"
      >
        <div className="flex items-center justify-between pb-2 border-b border-amber-700">
          <h3 className="text-lg font-black text-amber-300">
            🏆 Турниры «Русское лото»
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-amber-900 text-amber-200 font-bold"
          >
            ✕
          </button>
        </div>

        <div className="space-y-2.5 my-3">
          {tournaments.map((t) => (
            <div
              key={t.id}
              className="bg-[#2B1306] border border-amber-600 rounded-xl p-3 flex items-center justify-between gap-2"
            >
              <div>
                <div className="text-sm font-black text-amber-300">
                  {t.title}
                </div>
                <div className="text-xs font-bold text-white mt-0.5">
                  Призовой фонд: 🪙 {t.prizePool.toLocaleString('ru-RU')}
                </div>
                <div className="text-[10px] text-amber-200/80 mt-0.5">
                  Участников: {t.participantsCount} · До конца: {t.endsIn}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onJoinTournament(t.id)}
                className={`px-3 py-2 rounded-xl text-xs font-extrabold ${
                  t.joined
                    ? 'bg-amber-500 text-[#2A1104]'
                    : 'bg-gradient-to-b from-emerald-500 to-emerald-700 text-white shadow'
                }`}
              >
                {t.joined ? 'Вы в турнире ✓' : `Вход: 🪙 ${t.entryFee}`}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface SettingsAndAuthModalProps {
  playerName: string;
  soundEnabled: boolean;
  voiceEnabled: boolean;
  markingWindowSec: number;
  onUpdatePlayerName: (name: string) => void;
  onToggleSound: () => void;
  onToggleVoice: () => void;
  onChangeWindowSec: (sec: number) => void;
  onOpenAndroidCode: () => void;
  onClose: () => void;
}

export const SettingsAndAuthModal: React.FC<SettingsAndAuthModalProps> = ({
  playerName,
  soundEnabled,
  voiceEnabled,
  markingWindowSec,
  onUpdatePlayerName,
  onToggleSound,
  onToggleVoice,
  onChangeWindowSec,
  onOpenAndroidCode,
  onClose,
}) => {
  const [nameInput, setNameInput] = useState(playerName);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      onUpdatePlayerName(nameInput.trim());
    }
    onClose();
  };

  return (
    <div
      data-testid="modal-settings"
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-gradient-to-b from-[#431F0A] to-[#1F0D04] border-2 border-amber-500 rounded-2xl p-4 text-amber-100 shadow-2xl"
      >
        <div className="flex items-center justify-between pb-2 border-b border-amber-700">
          <h3 className="text-lg font-black text-amber-300">
            ⚙️ Профиль и настройки
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-amber-900 text-amber-200 font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-3 my-3">
          <div>
            <label className="block text-xs font-bold text-amber-200 mb-1">
              Имя игрока / Аккаунт:
            </label>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="w-full bg-[#1B0B03] border border-amber-600 rounded-xl px-3 py-1.5 text-sm font-bold text-white"
            />
          </div>

          <div className="flex items-center justify-between bg-[#2B1306] p-2.5 rounded-xl border border-amber-800">
            <span className="text-xs font-bold">Звуки бочонков и мешочка</span>
            <button
              type="button"
              onClick={onToggleSound}
              className={`px-3 py-1 rounded-lg text-xs font-extrabold ${
                soundEnabled ? 'bg-emerald-600 text-white' : 'bg-stone-700 text-stone-300'
              }`}
            >
              {soundEnabled ? 'Вкл 🔊' : 'Выкл 🔇'}
            </button>
          </div>

          <div className="flex items-center justify-between bg-[#2B1306] p-2.5 rounded-xl border border-amber-800">
            <span className="text-xs font-bold">Голос ведущей (озвучка чисел)</span>
            <button
              type="button"
              onClick={onToggleVoice}
              className={`px-3 py-1 rounded-lg text-xs font-extrabold ${
                voiceEnabled ? 'bg-emerald-600 text-white' : 'bg-stone-700 text-stone-300'
              }`}
            >
              {voiceEnabled ? 'Вкл 🎙️' : 'Выкл'}
            </button>
          </div>

          <div className="bg-[#2B1306] p-2.5 rounded-xl border border-amber-800">
            <div className="text-xs font-bold mb-1.5">
              Окно отметки числа (до крестика ✕):
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[5, 7, 10].map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => onChangeWindowSec(sec)}
                  className={`py-1 rounded-lg text-xs font-extrabold border ${
                    markingWindowSec === sec
                      ? 'bg-amber-500 text-[#2B1103] border-yellow-200'
                      : 'bg-[#1B0B03] text-amber-200 border-amber-800'
                  }`}
                >
                  {sec} сек.
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenAndroidCode}
            className="w-full py-2 rounded-xl bg-[#2B1306] border border-amber-500/80 text-amber-300 text-xs font-extrabold hover:bg-[#3A1A08]"
          >
            📱 Исходный код Android (Kotlin + Jetpack Compose)
          </button>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-gradient-to-b from-emerald-500 to-emerald-700 border border-emerald-300 text-white font-extrabold text-sm shadow"
          >
            Сохранить
          </button>
        </form>
      </div>
    </div>
  );
};
