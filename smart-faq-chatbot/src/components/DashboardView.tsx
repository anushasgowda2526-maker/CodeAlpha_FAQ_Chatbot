import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  MessageSquarePlus,
  MessagesSquare,
  TrendingUp,
} from 'lucide-react';
import type { ComputedAnalytics } from '../utils/analytics';

interface DashboardViewProps {
  analytics: ComputedAnalytics;
  onStartNewConversation: () => void;
  onAskSampleQuestion: (question: string) => void;
  onOpenConversation: (conversationId: string) => void;
  onNavigateFaqManager: () => void;
  onNavigateAnalytics: () => void;
}

const QUICK_SAMPLE_QUESTIONS = [
  'How can I track my order and check shipment status?',
  'I forgot my password. How do I reset it?',
  'How long does it take to receive my refund?',
  'What is your return policy and how many days do I have?',
  'How do I cancel an order before it ships?',
  'How do I apply a promo code or discount coupon?',
];

export function DashboardView({
  analytics,
  onStartNewConversation,
  onAskSampleQuestion,
  onOpenConversation,
  onNavigateFaqManager,
  onNavigateAnalytics,
}: DashboardViewProps) {
  const { stats, recentActivity, frequentQuestions, popularCategories } =
    analytics;

  const evaluatedCount = stats.matchedCount + stats.unansweredCount;
  const matchedShare =
    evaluatedCount > 0
      ? Math.round((stats.matchedCount / evaluatedCount) * 100)
      : 0;
  const unansweredShare = evaluatedCount > 0 ? 100 - matchedShare : 0;

  const statCards = [
    {
      label: 'Total FAQs',
      value: String(stats.totalFaqs),
      helper: 'Indexed in knowledge base',
      icon: BookOpen,
      tone: 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60',
    },
    {
      label: 'Questions Asked',
      value: String(stats.questionsAsked),
      helper: 'Across saved session chats',
      icon: MessagesSquare,
      tone: 'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800',
    },
    {
      label: 'Matched Questions',
      value: String(stats.matchedCount),
      helper: 'Answered via TF-IDF match',
      icon: CheckCircle2,
      tone: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50',
    },
    {
      label: 'Unanswered Questions',
      value: String(stats.unansweredCount),
      helper: 'Below similarity threshold',
      icon: HelpCircle,
      tone: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50',
    },
    {
      label: 'Matching Success Rate',
      value: `${stats.successRatePercent}%`,
      helper:
        stats.helpfulCount + stats.notHelpfulCount > 0
          ? `${stats.helpfulCount} helpful · ${stats.notHelpfulCount} not helpful`
          : 'Overall match accuracy',
      icon: TrendingUp,
      tone: 'text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Welcome Banner */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="max-w-2xl space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white text-balance">
            Your Smart FAQ Assistant
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            An intelligent customer-support chatbot powered by NLP text
            preprocessing, TF-IDF vectorization, and cosine similarity matching.
            Ask questions naturally to retrieve verified answers from your
            editable ShopEase knowledge base.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onStartNewConversation}
            className="h-11 px-5 inline-flex items-center justify-center gap-2 rounded-lg bg-[#0B1F3A] hover:bg-blue-900 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-sm font-medium transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Start New Conversation</span>
          </button>
          <button
            type="button"
            onClick={onNavigateFaqManager}
            className="h-11 px-4 inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/70 text-slate-700 dark:text-slate-200 text-sm font-medium transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <span>Manage FAQs</span>
          </button>
        </div>
      </section>

      {/* Dynamic KPI Grid */}
      <section aria-label="Dashboard Metrics">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {statCards.map(({ label, value, helper, icon: Icon, tone }) => (
            <div
              key={label}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex items-start justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {label}
                </p>
                <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
                  {value}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 truncate">
                  {helper}
                </p>
              </div>
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${tone}`}
                aria-hidden="true"
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Chart + Popular Categories + Frequently Asked Questions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Matched vs Unanswered Chart */}
        <section className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                  Matched vs. Unanswered
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Live query matching performance
                </p>
              </div>
              <button
                type="button"
                onClick={onNavigateAnalytics}
                className="text-xs font-medium text-blue-700 dark:text-blue-400 hover:underline whitespace-nowrap"
              >
                Full Analytics
              </button>
            </div>

            {evaluatedCount === 0 ? (
              <div className="py-10 text-center">
                <BarChart3 className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2.5" />
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  No queries evaluated yet
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Ask a question to visualize matched vs. unanswered ratios.
                </p>
              </div>
            ) : (
              <div className="mt-5 space-y-5">
                {/* Stacked horizontal bar chart */}
                <div>
                  <div className="h-4 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
                    {matchedShare > 0 && (
                      <div
                        className="h-full bg-[#0B1F3A] dark:bg-blue-500 transition-all"
                        style={{ width: `${matchedShare}%` }}
                        title={`Matched: ${matchedShare}%`}
                      />
                    )}
                    {unansweredShare > 0 && (
                      <div
                        className="h-full bg-amber-400 dark:bg-amber-500 transition-all"
                        style={{ width: `${unansweredShare}%` }}
                        title={`Unanswered: ${unansweredShare}%`}
                      />
                    )}
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                      <p className="text-slate-500 dark:text-slate-400">
                        Matched
                      </p>
                      <p className="mt-1 text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                        {stats.matchedCount}{' '}
                        <span className="text-xs font-normal text-blue-700 dark:text-blue-400">
                          ({matchedShare}%)
                        </span>
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                      <p className="text-slate-500 dark:text-slate-400">
                        Unanswered
                      </p>
                      <p className="mt-1 text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                        {stats.unansweredCount}{' '}
                        <span className="text-xs font-normal text-amber-700 dark:text-amber-400">
                          ({unansweredShare}%)
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Popular Categories summary */}
                {popularCategories.length > 0 && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Top Categories
                    </p>
                    {popularCategories.slice(0, 3).map((cat) => (
                      <div key={cat.category} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-700 dark:text-slate-200 truncate pr-2">
                            {cat.category}
                          </span>
                          <span className="font-mono tabular-nums text-slate-500 dark:text-slate-400">
                            {cat.count} ({cat.sharePercent}%)
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-blue-600 dark:bg-blue-400 rounded-full"
                            style={{ width: `${cat.sharePercent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Frequently Asked Questions */}
        <section className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6">
          <div className="pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Frequently Asked Questions
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Most queried FAQ topics from real user sessions
              </p>
            </div>
          </div>

          {frequentQuestions.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                No frequent questions recorded yet
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Frequently matched topics will rank here automatically as users
                chat.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {frequentQuestions.slice(0, 5).map((item) => (
                <li
                  key={item.question}
                  className="py-3 flex items-start justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {item.question}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      {item.category ?? 'Unanswered Query'} ·{' '}
                      <span className="font-mono tabular-nums">
                        {item.avgConfidencePercent}% avg similarity
                      </span>
                    </p>
                  </div>
                  <span className="text-xs font-mono tabular-nums font-semibold text-blue-700 dark:text-blue-400 shrink-0">
                    {item.count}×
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Recent Activity + Quick Test Questions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 flex flex-col">
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Recent Chatbot Activity
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Live log of questions evaluated in this browser session
              </p>
            </div>
            {recentActivity.length > 0 && (
              <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                Last {Math.min(recentActivity.length, 6)}
              </span>
            )}
          </div>

          {recentActivity.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-10 px-4">
              <MessagesSquare className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-3" />
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                No questions asked yet
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                Start a conversation or click one of the sample questions to see
                live TF-IDF matching scores and activity here.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentActivity.slice(0, 6).map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onOpenConversation(item.conversationId)}
                    className="w-full text-left py-3.5 px-2 -mx-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-start justify-between gap-4 group"
                  >
                    <div className="min-w-0 space-y-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate group-hover:text-blue-700 dark:group-hover:text-blue-400">
                        {item.question}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <span
                          className={
                            item.matched
                              ? 'text-emerald-700 dark:text-emerald-400 font-medium'
                              : 'text-amber-700 dark:text-amber-400 font-medium'
                          }
                        >
                          {item.matched ? 'Matched' : 'Unanswered'}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">
                          {item.confidencePercent}% similarity
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{item.timestamp}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 shrink-0 mt-1" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6">
          <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Try Sample Support Queries
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Click any prompt to test the chatbot right away
            </p>
          </div>

          <div className="mt-4 space-y-2">
            {QUICK_SAMPLE_QUESTIONS.map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => onAskSampleQuestion(sample)}
                className="w-full text-left px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/60 dark:hover:bg-blue-950/40 text-xs sm:text-sm text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-between gap-3 group"
              >
                <span className="line-clamp-1">{sample}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 shrink-0" />
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
