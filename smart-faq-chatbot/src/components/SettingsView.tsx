import { Moon, RotateCcw, Sun, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { ThemeMode } from '../types/chat';
import { DEFAULT_SIMILARITY_THRESHOLD } from '../utils/nlpEngine';

interface SettingsViewProps {
  theme: ThemeMode;
  onChangeTheme: (theme: ThemeMode) => void;
  similarityThreshold: number;
  onChangeThreshold: (threshold: number) => void;
  onClearHistory: () => void;
  onResetFaqs: () => void;
  totalFaqs: number;
}

export function SettingsView({
  theme,
  onChangeTheme,
  similarityThreshold,
  onChangeThreshold,
  onClearHistory,
  onResetFaqs,
  totalFaqs,
}: SettingsViewProps) {
  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    window.setTimeout(() => setFeedback(null), 3000);
  };

  const thresholdPercent = Math.round(similarityThreshold * 100);
  const defaultPercent = Math.round(DEFAULT_SIMILARITY_THRESHOLD * 100);

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Configure appearance, NLP matching threshold, and local storage data.
        </p>
      </div>

      {feedback && (
        <div
          role="status"
          className="px-4 py-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/50 text-sm text-emerald-800 dark:text-emerald-300"
        >
          {feedback}
        </div>
      )}

      {/* Theme */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Appearance Theme
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Switch between light and dark interface themes.
          </p>
        </div>

        <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => onChangeTheme('light')}
            className={`px-3.5 py-2 rounded-md text-xs sm:text-sm font-medium inline-flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              theme === 'light'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sun className="w-4 h-4" />
            <span>Light</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeTheme('dark')}
            className={`px-3.5 py-2 rounded-md text-xs sm:text-sm font-medium inline-flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              theme === 'dark'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Moon className="w-4 h-4" />
            <span>Dark</span>
          </button>
        </div>
      </section>

      {/* Similarity Threshold */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Similarity Threshold
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Minimum cosine similarity required to accept an FAQ match instead
              of showing the fallback response.
            </p>
          </div>
          <span className="text-lg font-bold font-mono tabular-nums text-blue-700 dark:text-blue-400 shrink-0">
            {thresholdPercent}%
          </span>
        </div>

        <div className="space-y-2">
          <label htmlFor="similarity-threshold-slider" className="sr-only">
            Similarity threshold percentage
          </label>
          <input
            id="similarity-threshold-slider"
            type="range"
            min={10}
            max={60}
            step={2}
            value={thresholdPercent}
            onChange={(e) => onChangeThreshold(Number(e.target.value) / 100)}
            className="w-full accent-[#0B1F3A] dark:accent-blue-500 cursor-pointer"
          />
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>10% (Lenient)</span>
            <button
              type="button"
              onClick={() => onChangeThreshold(DEFAULT_SIMILARITY_THRESHOLD)}
              className="text-blue-700 dark:text-blue-400 hover:underline font-medium"
            >
              Reset to default ({defaultPercent}%)
            </button>
            <span>60% (Strict)</span>
          </div>
        </div>
      </section>

      {/* Data Controls */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800">
        <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Clear Chat History
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Remove all saved conversations and unanswered question logs from
              local storage.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {confirmClear ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    onClearHistory();
                    setConfirmClear(false);
                    showFeedback('Chat history cleared.');
                  }}
                  className="h-9 px-3.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-medium"
                >
                  Confirm Clear
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="h-9 px-4 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear Chat History</span>
              </button>
            )}
          </div>
        </div>

        <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Reset FAQ Dataset
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Restore the default 80 customer-support FAQs and discard custom
              edits.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {confirmReset ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    onResetFaqs();
                    setConfirmReset(false);
                    showFeedback('Default 80-FAQ dataset restored.');
                  }}
                  className="h-9 px-3.5 rounded-lg bg-[#0B1F3A] hover:bg-blue-900 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-medium"
                >
                  Confirm Reset
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="h-9 px-4 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Dataset</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Application Info */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 space-y-3">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
          Application Information
        </h2>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-2">
          <div>
            <dt className="text-xs text-slate-500 dark:text-slate-400">
              Application Name
            </dt>
            <dd className="mt-0.5 font-medium text-slate-900 dark:text-white">
              FAQ Assistant – Smart Customer Support Chatbot
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500 dark:text-slate-400">
              Project Track
            </dt>
            <dd className="mt-0.5 font-medium text-slate-900 dark:text-white">
              CodeAlpha AI Internship (Task 2)
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500 dark:text-slate-400">
              NLP Pipeline
            </dt>
            <dd className="mt-0.5 font-medium text-slate-900 dark:text-white">
              Normalization, Tokenization, Stop-Words, TF-IDF & Cosine Similarity
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500 dark:text-slate-400">
              Knowledge Base & Threshold
            </dt>
            <dd className="mt-0.5 font-mono tabular-nums font-medium text-slate-900 dark:text-white">
              {totalFaqs} FAQs · {thresholdPercent}% min threshold
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
