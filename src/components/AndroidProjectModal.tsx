import React, { useState } from 'react';

interface AndroidProjectModalProps {
  onClose: () => void;
}

const KOTLIN_FILES: Record<string, { title: string; path: string; code: string }> = {
  buildGradle: {
    title: 'app/build.gradle.kts',
    path: 'app/build.gradle.kts',
    code: `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("org.jetbrains.kotlin.plugin.serialization")
}

android {
    namespace = "ru.russkoeloto.game"
    compileSdk = 35

    defaultConfig {
        applicationId = "ru.russkoeloto.game"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0-rustore"
    }

    buildFeatures {
        compose = true
    }
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.14"
    }
}

dependencies {
    implementation(platform("androidx.compose:compose-bom:2024.09.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.activity:activity-compose:1.9.2")
    implementation("androidx.datastore:datastore-preferences:1.1.1")
    implementation("io.ktor:ktor-client-okhttp:2.3.12")
    implementation("io.ktor:ktor-client-websockets:2.3.12")
    implementation("ru.rustore.sdk:billingclient:6.1.0")
}`,
  },
  lottoRulesKt: {
    title: 'LottoRules.kt',
    path: 'app/src/main/java/ru/russkoeloto/game/domain/LottoRules.kt',
    code: `package ru.russkoeloto.game.domain

import kotlin.random.Random

enum class CellState { EMPTY, UNMARKED, MARKED, MISSED }
enum class GameModeVariant { SHORT, FULL }

data class LottoCell(
    val row: Int,
    val col: Int,
    val number: Int?,
    val state: CellState = if (number != null) CellState.UNMARKED else CellState.EMPTY
)

data class LottoCard(
    val id: String,
    val grid: List<List<LottoCell>> // 3 rows x 9 columns
)

object RussianLottoEngine {
    fun getColumnRange(col: Int): IntRange = when (col) {
        0 -> 1..9
        8 -> 80..90
        else -> (col * 10)..(col * 10 + 9)
    }

    fun generateDeck(seed: Long? = null): List<Int> {
        val rng = seed?.let { Random(it) } ?: Random.Default
        return (1..90).shuffled(rng)
    }

    fun expireBarrelWindow(cards: List<LottoCard>, expiredNumber: Int): List<LottoCard> =
        cards.map { card ->
            card.copy(
                grid = card.grid.map { row ->
                    row.map { cell ->
                        if (cell.number == expiredNumber && cell.state == CellState.UNMARKED) {
                            cell.copy(state = CellState.MISSED)
                        } else cell
                    }
                }
            )
        }
}`,
  },
  gameplayScreenKt: {
    title: 'GameplayScreen.kt',
    path: 'app/src/main/java/ru/russkoeloto/game/ui/GameplayScreen.kt',
    code: `package ru.russkoeloto.game.ui

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.unit.dp
import ru.russkoeloto.game.domain.*

enum class HostessState {
    Idle, ReachIntoBag, SearchBag, LiftBarrel, ShowBarrel, PlaceBarrel, Celebrate, Waiting
}

@Composable
fun StraightLottoCardView(
    card: LottoCard,
    onCellTap: (String, Int, Int, LottoCell) -> Unit,
    modifier: Modifier = Modifier
) {
    // ABSOLUTE RULE: rotationZ = 0f, no skew, no perspective distortion
    Box(
        modifier = modifier
            .fillMaxWidth(0.96f)
            .graphicsLayer(rotationZ = 0f, rotationX = 0f, rotationY = 0f)
            .background(Color(0xFFF5E6C4), RoundedCornerShape(8.dp))
            .border(2.dp, Color(0xFF8B5E2A), RoundedCornerShape(8.dp))
            .padding(4.dp)
    ) {
        Column(modifier = Modifier.fillMaxWidth()) {
            card.grid.forEachIndexed { rIdx, row ->
                Row(modifier = Modifier.fillMaxWidth()) {
                    row.forEachIndexed { cIdx, cell ->
                        Box(
                            contentAlignment = Alignment.Center,
                            modifier = Modifier
                                .weight(1f)
                                .height(42.dp)
                                .border(0.5.dp, Color(0xFF8C6639))
                                .clickable(enabled = cell.number != null) {
                                    onCellTap(card.id, rIdx, cIdx, cell)
                                }
                        ) {
                            cell.number?.let { Text(text = it.toString()) }
                        }
                    }
                }
            }
        }
    }
}`,
  },
};

export const AndroidProjectModal: React.FC<AndroidProjectModalProps> = ({
  onClose,
}) => {
  const [selectedKey, setSelectedKey] = useState<string>('gameplayScreenKt');
  const [copied, setCopied] = useState(false);

  const activeFile = KOTLIN_FILES[selectedKey];

  const handleCopy = () => {
    navigator.clipboard?.writeText(activeFile.code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-gradient-to-b from-[#3A1B09] to-[#1F0D04] border-2 border-amber-500 rounded-2xl p-4 text-amber-100 shadow-2xl max-h-[88vh] flex flex-col"
      >
        <div className="flex items-center justify-between pb-3 border-b border-amber-700/60">
          <div>
            <h3 className="text-lg font-extrabold text-amber-300">
              Android Kotlin + Jetpack Compose (RuStore APK Архитектура)
            </h3>
            <p className="text-xs text-amber-200/80">
              Нативные исходные модули Gradle/Kotlin с идентичной архитектурой правил и экранов
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-amber-900/80 border border-amber-500 text-amber-200 font-bold"
          >
            ✕
          </button>
        </div>

        <div className="flex items-center gap-2 my-3 overflow-x-auto">
          {Object.entries(KOTLIN_FILES).map(([key, item]) => (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedKey(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap border ${
                selectedKey === key
                  ? 'bg-amber-500 text-[#2A1104] border-amber-200'
                  : 'bg-[#2B1306] text-amber-200 border-amber-800'
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>

        <div className="text-[11px] font-mono text-amber-300/80 mb-1 flex items-center justify-between">
          <span>{activeFile.path}</span>
          <button
            type="button"
            onClick={handleCopy}
            className="px-2.5 py-1 rounded bg-emerald-700 text-white font-sans font-bold text-xs"
          >
            {copied ? 'Скопировано ✓' : 'Копировать код'}
          </button>
        </div>

        <pre className="flex-1 overflow-auto bg-[#120803] border border-amber-900/80 rounded-xl p-3 text-xs font-mono text-amber-100/95 leading-relaxed">
          <code>{activeFile.code}</code>
        </pre>
      </div>
    </div>
  );
};
