import { Bot, Check, Copy, ThumbsDown, ThumbsUp, User } from 'lucide-react';
import { useState } from 'react';
import type { ChatMessageItem, MessageFeedback } from '../types/chat';

interface ChatMessageProps {
  message: ChatMessageItem;
  onSelectSuggestion: (question: string) => void;
  onFeedback: (messageId: string, feedback: MessageFeedback) => void;
  disableSuggestions?: boolean;
}

export function ChatMessage({
  message,
  onSelectSuggestion,
  onFeedback,
  disableSuggestions,
}: ChatMessageProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const textToCopy = message.matchedQuestion
      ? `${message.matchedQuestion}\n\n${message.text}`
      : message.text;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API unavailable in restricted contexts
    }
  };

  if (message.sender === 'user') {
    return (
      <div className="flex items-end justify-end gap-2.5">
        <div className="flex flex-col items-end max-w-[85%] sm:max-w-[74%]">
          <div className="bg-[#0B1F3A] dark:bg-blue-600 text-white px-4 py-3 rounded-2xl rounded-br-sm text-sm sm:text-[15px] leading-relaxed">
            {message.text}
          </div>
          <span className="mt-1 text-[11px] text-slate-400 dark:text-slate-500 tabular-nums">
            {message.timestamp}
          </span>
        </div>
        <div
          className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 mb-5"
          aria-hidden="true"
        >
          <User className="w-4 h-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end justify-start gap-2.5">
      <div
        className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 flex items-center justify-center shrink-0 mb-5"
        aria-hidden="true"
      >
        <Bot className="w-4 h-4" />
      </div>

      <div className="flex flex-col items-start max-w-[88%] sm:max-w-[78%]">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 px-4 py-3.5 rounded-2xl rounded-bl-sm text-sm sm:text-[15px] leading-relaxed">
          {!message.isWelcome && message.matchedQuestion && (
            <div className="mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-medium text-blue-700 dark:text-blue-400">
                  Matched FAQ
                </span>
                {message.isRepeated && (
                  <>
                    <span
                      aria-hidden="true"
                      className="text-slate-300 dark:text-slate-700"
                    >
                      ·
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      Asked earlier in this chat
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                {message.matchedQuestion}
              </p>
            </div>
          )}

          {!message.isWelcome && !message.matchedQuestion && message.isRepeated && (
            <p className="mb-1.5 text-xs text-slate-500 dark:text-slate-400">
              Repeated question detected
            </p>
          )}

          <p className="whitespace-pre-line">{message.text}</p>

          {!message.isWelcome && (
            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                {message.isFallback ? (
                  <span className="font-medium text-amber-700 dark:text-amber-400">
                    No exact match found
                  </span>
                ) : (
                  message.category && (
                    <span className="font-medium text-slate-600 dark:text-slate-300">
                      {message.category}
                    </span>
                  )
                )}
              </div>

              <div className="flex items-center gap-3">
                <div
                  className="flex items-center gap-1.5"
                  role="group"
                  aria-label="Answer feedback"
                >
                  <button
                    type="button"
                    onClick={() =>
                      onFeedback(
                        message.id,
                        message.feedback === 'helpful' ? null : 'helpful'
                      )
                    }
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${
                      message.feedback === 'helpful'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-medium'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                    aria-pressed={message.feedback === 'helpful'}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Helpful</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onFeedback(
                        message.id,
                        message.feedback === 'not-helpful' ? null : 'not-helpful'
                      )
                    }
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${
                      message.feedback === 'not-helpful'
                        ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 font-medium'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                    aria-pressed={message.feedback === 'not-helpful'}
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                    <span>Not Helpful</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap"
                  aria-label="Copy response"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-emerald-600 dark:text-emerald-400">
                        Copied
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {message.suggestions && message.suggestions.length > 0 && (
            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Related FAQ suggestions:
              </p>
              <div className="flex flex-col gap-1.5">
                {message.suggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    type="button"
                    disabled={disableSuggestions}
                    onClick={() => onSelectSuggestion(suggestion.question)}
                    className="text-left px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/70 dark:hover:bg-blue-950/40 text-xs text-slate-700 dark:text-slate-200 transition-colors disabled:opacity-50"
                  >
                    <span className="font-medium">{suggestion.question}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <span className="mt-1 text-[11px] text-slate-400 dark:text-slate-500 tabular-nums">
          {message.timestamp}
        </span>
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div
      className="flex items-end justify-start gap-2.5"
      role="status"
      aria-label="Chatbot is matching your question"
    >
      <div
        className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 flex items-center justify-center shrink-0"
        aria-hidden="true"
      >
        <Bot className="w-4 h-4" />
      </div>
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-3.5 rounded-2xl rounded-bl-sm flex items-center gap-1.5">
        <span className="typing-dot w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500" />
        <span className="typing-dot w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500" />
        <span className="typing-dot w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500" />
        <span className="sr-only">Matching FAQ...</span>
      </div>
    </div>
  );
}
