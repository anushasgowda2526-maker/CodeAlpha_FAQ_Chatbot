import {
  ArrowUpRight,
  Check,
  Edit2,
  History,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import type { Conversation, UnansweredRecord } from '../types/chat';

interface HistoryViewProps {
  conversations: Conversation[];
  activeConversationId: string;
  unansweredLog: UnansweredRecord[];
  onReopenConversation: (conversationId: string) => void;
  onRenameConversation: (conversationId: string, newTitle: string) => void;
  onDeleteConversation: (conversationId: string) => void;
  onClearHistory: () => void;
  onAddFaqFromUnanswered: (question: string) => void;
}

function formatDateTime(ts: number): string {
  return new Date(ts).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function HistoryView({
  conversations,
  activeConversationId,
  unansweredLog,
  onReopenConversation,
  onRenameConversation,
  onDeleteConversation,
  onClearHistory,
  onAddFaqFromUnanswered,
}: HistoryViewProps) {
  const [confirmClearAll, setConfirmClearAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const savedWithUserMessages = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return conversations
      .filter((c) => c.messages.some((m) => m.sender === 'user'))
      .filter((c) => {
        if (!q) return true;
        return (
          c.title.toLowerCase().includes(q) ||
          c.messages.some((m) => m.text.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [conversations, searchQuery]);

  const startRename = (conv: Conversation) => {
    setRenamingId(conv.id);
    setRenameValue(conv.title);
  };

  const commitRename = (convId: string) => {
    const trimmed = renameValue.trim();
    if (trimmed) {
      onRenameConversation(convId, trimmed);
    }
    setRenamingId(null);
    setRenameValue('');
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Conversations Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Conversation History
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Search, rename, reopen, or remove conversations saved in local
              browser storage.
            </p>
          </div>

          {conversations.some((c) =>
            c.messages.some((m) => m.sender === 'user')
          ) && (
            <div className="flex items-center gap-2 shrink-0">
              {confirmClearAll ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      onClearHistory();
                      setConfirmClearAll(false);
                    }}
                    className="h-9 px-3.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-medium"
                  >
                    Confirm Clear History
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmClearAll(false)}
                    className="h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmClearAll(true)}
                  className="h-9 px-3.5 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All History</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Search Conversations */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <label htmlFor="history-search" className="sr-only">
              Search previous conversations
            </label>
            <input
              id="history-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations by title or message content..."
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>

        {savedWithUserMessages.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-10 text-center">
            <History className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {searchQuery.trim()
                ? 'No matching conversations found'
                : 'No saved conversations yet'}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {searchQuery.trim()
                ? 'Try a different search keyword.'
                : 'Your conversations will appear here as soon as you ask a question in the Chatbot Workspace.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {savedWithUserMessages.map((conv) => {
              const userMsgs = conv.messages.filter((m) => m.sender === 'user');
              const matchedCount = conv.messages.filter(
                (m) => m.sender === 'bot' && !m.isWelcome && !m.isFallback
              ).length;
              const isCurrent = conv.id === activeConversationId;
              const isRenaming = renamingId === conv.id;

              return (
                <div
                  key={conv.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    {isRenaming ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          commitRename(conv.id);
                        }}
                        className="flex items-center gap-2 max-w-md"
                      >
                        <input
                          type="text"
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          autoFocus
                          aria-label="Conversation title"
                          className="flex-1 h-8 px-2.5 rounded-lg border border-blue-500 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none"
                        />
                        <button
                          type="submit"
                          aria-label="Save conversation name"
                          className="p-1.5 rounded-lg bg-[#0B1F3A] dark:bg-blue-600 text-white"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setRenamingId(null)}
                          aria-label="Cancel rename"
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    ) : (
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white truncate">
                          {conv.title}
                        </h2>
                        {isCurrent && (
                          <span className="text-xs font-medium text-blue-700 dark:text-blue-400 shrink-0">
                            · Active
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                      <span>
                        {userMsgs.length} question
                        {userMsgs.length === 1 ? '' : 's'}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{matchedCount} matched</span>
                      <span aria-hidden="true">·</span>
                      <span>Updated {formatDateTime(conv.updatedAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onReopenConversation(conv.id)}
                      className="h-9 px-3.5 inline-flex items-center gap-1.5 rounded-lg bg-[#0B1F3A] hover:bg-blue-900 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-medium transition-colors whitespace-nowrap"
                    >
                      <span>Open Chat</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => startRename(conv)}
                      aria-label={`Rename conversation ${conv.title}`}
                      className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteConversation(conv.id)}
                      aria-label={`Delete conversation ${conv.title}`}
                      className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Unanswered Questions Tracker */}
      <section className="space-y-3">
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
            Unanswered Questions Log
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Queries that fell below the similarity threshold. Add them to the
            FAQ Knowledge Base to improve future coverage.
          </p>
        </div>

        {unansweredLog.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            No unanswered questions recorded in this session.
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800">
            {unansweredLog.map((entry) => (
              <div
                key={entry.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    "{entry.query}"
                  </p>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                    <span className="font-mono">
                      Top similarity: {entry.bestSimilarityPercent}%
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{formatDateTime(entry.timestamp)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onAddFaqFromUnanswered(entry.query)}
                  className="h-9 px-3.5 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-400 whitespace-nowrap shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to FAQ</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
