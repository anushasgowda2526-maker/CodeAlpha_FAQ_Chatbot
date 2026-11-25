import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  HelpCircle,
  MessagesSquare,
  ThumbsDown,
  ThumbsUp,
  TrendingUp,
} from 'lucide-react';
import type { ComputedAnalytics } from '../utils/analytics';

interface AnalyticsViewProps {
  analytics: ComputedAnalytics;
  onOpenConversation: (conversationId: string) => void;
  onStartNewConversation: () => void;
}

export function AnalyticsView({
  analytics,
  onOpenConversation,
  onStartNewConversation,
}: AnalyticsViewProps) {
  const { stats, recentActivity, frequentQuestions, popularCategories } =
    analytics;

  const evaluated = stats.matchedCount + stats.unansweredCount;
  const matchedPct =
    evaluated > 0 ? Math.round((stats.matchedCount / evaluated) * 100) : 0;
  const unansweredPct = evaluated > 0 ? 100 - matchedPct : 0;

  const totalFeedback = stats.helpfulCount + stats.notHelpfulCount;
  const helpfulPct =
    totalFeedback > 0
      ? Math.round((stats.helpfulCount / totalFeedback) * 100)
      : 0;

  // SVG Donut ring geometry
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const matchedStroke =
    evaluated > 0 ? (stats.matchedCount / evaluated) * circumference : 0;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Chatbot Analytics
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time matching performance, category distribution, and user
            feedback from your current conversations.
          </p>
        </div>

        <button
          type="button"
          onClick={onStartNewConversation}
          className="h-10 px-4 inline-flex items-center justify-center gap-2 rounded-lg bg-[#0B1F3A] hover:bg-blue-900 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-sm font-medium transition-colors whitespace-nowrap shrink-0"
        >
          <span>Ask a Question</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Total Questions</span>
            <MessagesSquare className="w-4 h-4 text-slate-400" />
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {stats.questionsAsked}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Submitted across saved chats
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Matched Questions</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {stats.matchedCount}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Answered from FAQ base
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Unanswered Questions</span>
            <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {stats.unansweredCount}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Below similarity threshold
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Matching Success Rate</span>
            <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {stats.successRatePercent}%
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {totalFeedback > 0
              ? `${helpfulPct}% marked helpful (${totalFeedback} rated)`
              : 'No user ratings yet'}
          </p>
        </div>
      </div>

      {/* Charts Row: Matched vs Unanswered + Popular Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Matched vs Unanswered Breakdown Chart */}
        <section className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Matched vs. Unanswered Breakdown
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Proportion of queries exceeding the similarity threshold
          </p>

          {evaluated === 0 ? (
            <div className="py-12 text-center">
              <BarChart3 className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2.5" />
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                No chart data yet
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Ask questions in the Chatbot Workspace to populate live chart
                metrics.
              </p>
            </div>
          ) : (
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-6">
              <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
                <svg
                  viewBox="0 0 132 132"
                  className="w-full h-full -rotate-90"
                  aria-label={`Matched ${matchedPct}%, Unanswered ${unansweredPct}%`}
                >
                  <circle
                    cx="66"
                    cy="66"
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="16"
                    className="text-amber-400/85 dark:text-amber-500/80"
                  />
                  <circle
                    cx="66"
                    cy="66"
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="16"
                    strokeDasharray={`${matchedStroke} ${circumference}`}
                    strokeLinecap="butt"
                    className="text-blue-700 dark:text-blue-500"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                    {matchedPct}%
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Matched
                  </span>
                </div>
              </div>

              <div className="flex-1 w-full space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-slate-700 dark:text-slate-200">
                      Matched Questions
                    </span>
                    <span className="font-mono tabular-nums text-slate-600 dark:text-slate-300">
                      {stats.matchedCount} ({matchedPct}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-blue-700 dark:bg-blue-500 rounded-full"
                      style={{ width: `${matchedPct}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-slate-700 dark:text-slate-200">
                      Unanswered Questions
                    </span>
                    <span className="font-mono tabular-nums text-slate-600 dark:text-slate-300">
                      {stats.unansweredCount} ({unansweredPct}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-amber-400 dark:bg-amber-500 rounded-full"
                      style={{ width: `${unansweredPct}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <ThumbsUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-mono tabular-nums">
                      {stats.helpfulCount} Helpful
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <ThumbsDown className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono tabular-nums">
                      {stats.notHelpfulCount} Not Helpful
                    </span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Most Popular Categories */}
        <section className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Most Popular FAQ Categories
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Ranked by matched customer inquiries
          </p>

          {popularCategories.length === 0 ? (
            <div className="py-12 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Category popularity will appear once questions match the FAQ
              knowledge base.
            </div>
          ) : (
            <div className="mt-5 space-y-3.5">
              {popularCategories.slice(0, 6).map((cat) => (
                <div key={cat.category}>
                  <div className="flex items-center justify-between text-xs sm:text-sm mb-1.5">
                    <span className="font-medium text-slate-800 dark:text-slate-200 truncate pr-3">
                      {cat.category}
                    </span>
                    <span className="font-mono tabular-nums text-xs text-slate-500 dark:text-slate-400 shrink-0">
                      {cat.count} ({cat.sharePercent}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-[#0B1F3A] dark:bg-blue-500 rounded-full"
                      style={{ width: `${cat.sharePercent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Frequently Asked Questions + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Most Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 pb-4 border-b border-slate-100 dark:border-slate-800">
            Top recurring topics across your conversations
          </p>

          {frequentQuestions.length === 0 ? (
            <p className="py-10 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              No questions recorded yet.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {frequentQuestions.map((item) => (
                <li
                  key={item.question}
                  className="py-3 flex items-start justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                      {item.question}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      {item.category ?? 'Unmatched Query'} ·{' '}
                      <span className="font-mono tabular-nums">
                        {item.avgConfidencePercent}% avg similarity
                      </span>
                    </p>
                  </div>
                  <span className="text-xs font-mono tabular-nums font-semibold text-blue-700 dark:text-blue-400 shrink-0 pt-0.5">
                    {item.count}×
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Recent Chatbot Activity
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 pb-4 border-b border-slate-100 dark:border-slate-800">
            Latest questions and NLP matching outcomes
          </p>

          {recentActivity.length === 0 ? (
            <p className="py-10 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Recent activity will appear here after your first question.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentActivity.slice(0, 8).map((entry) => (
                <li key={entry.id}>
                  <button
                    type="button"
                    onClick={() => onOpenConversation(entry.conversationId)}
                    className="w-full text-left py-3 px-2 -mx-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-center justify-between gap-3 group"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate group-hover:text-blue-700 dark:group-hover:text-blue-400">
                        {entry.question}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        <span
                          className={
                            entry.matched
                              ? 'text-emerald-700 dark:text-emerald-400 font-medium'
                              : 'text-amber-700 dark:text-amber-400 font-medium'
                          }
                        >
                          {entry.matched ? 'Matched' : 'Unanswered'}
                        </span>{' '}
                        ·{' '}
                        <span className="font-mono tabular-nums">
                          {entry.confidencePercent}%
                        </span>{' '}
                        · <span className="tabular-nums">{entry.timestamp}</span>
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 shrink-0" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
