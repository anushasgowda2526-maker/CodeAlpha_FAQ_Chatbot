import {
  History,
  MessageSquarePlus,
  RotateCcw,
  Search,
  Send,
  X,
} from 'lucide-react';
import { type FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import type { Conversation, MessageFeedback } from '../types/chat';
import { ChatMessage, TypingIndicator } from './ChatMessage';

interface ChatbotViewProps {
  conversation: Conversation;
  conversations: Conversation[];
  isTyping: boolean;
  onSendMessage: (text: string) => void;
  onClearConversation: () => void;
  onNewConversation: () => void;
  onSelectConversation: (conversationId: string) => void;
  onMessageFeedback: (messageId: string, feedback: MessageFeedback) => void;
}

const SUGGESTED_STARTERS = [
  'How can I track my order?',
  'I forgot my password. How do I reset it?',
  'How long does it take to receive my refund?',
  'What is your return policy?',
];

export function ChatbotView({
  conversation,
  conversations,
  isTyping,
  onSendMessage,
  onClearConversation,
  onNewConversation,
  onSelectConversation,
  onMessageFeedback,
}: ChatbotViewProps) {
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);
  const [convSearch, setConvSearch] = useState('');
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages, isTyping]);

  const filteredConversations = useMemo(() => {
    const q = convSearch.trim().toLowerCase();
    const sorted = [...conversations].sort((a, b) => b.updatedAt - a.updatedAt);
    if (!q) return sorted;
    return sorted.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.messages.some((m) => m.text.toLowerCase().includes(q))
    );
  }, [conversations, convSearch]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) {
      setInputError('Please enter a question before sending.');
      inputRef.current?.focus();
      return;
    }
    if (isTyping) return;
    setInputError(null);
    setInputValue('');
    onSendMessage(trimmed);
  };

  const handleSuggestionClick = (question: string) => {
    if (isTyping) return;
    setInputError(null);
    onSendMessage(question);
  };

  const showStarterChips = conversation.messages.length <= 1;

  const conversationListPanel = (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
      <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-xs font-semibold text-slate-700 dark:text-slate-200">
            Conversations
          </h2>
          <button
            type="button"
            onClick={() => setShowHistoryDrawer(false)}
            aria-label="Close conversations panel"
            className="xl:hidden p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <label htmlFor="workspace-conv-search" className="sr-only">
            Search conversations
          </label>
          <input
            id="workspace-conv-search"
            type="text"
            value={convSearch}
            onChange={(e) => setConvSearch(e.target.value)}
            placeholder="Search conversations..."
            className="w-full h-8 pl-8 pr-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredConversations.length === 0 ? (
          <p className="p-3 text-xs text-slate-500 dark:text-slate-400 text-center">
            No matching conversations.
          </p>
        ) : (
          filteredConversations.map((conv) => {
            const isActive = conv.id === conversation.id;
            const userCount = conv.messages.filter(
              (m) => m.sender === 'user'
            ).length;
            return (
              <button
                key={conv.id}
                type="button"
                onClick={() => {
                  onSelectConversation(conv.id);
                  setShowHistoryDrawer(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <p
                  className={`text-xs font-medium truncate ${
                    isActive
                      ? 'text-blue-800 dark:text-blue-300'
                      : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {conv.title}
                </p>
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                  {userCount} question{userCount === 1 ? '' : 's'}
                </p>
              </button>
            );
          })
        )}
      </div>
    </div>
  );

  return (
    <div className="h-full max-w-6xl mx-auto p-3 sm:p-6 grid grid-cols-1 xl:grid-cols-[260px_1fr] gap-4 min-h-0">
      {/* Desktop Conversation List */}
      <div className="hidden xl:block min-h-0">{conversationListPanel}</div>

      {/* Mobile / Tablet Conversation Drawer */}
      {showHistoryDrawer && (
        <div className="xl:hidden fixed inset-0 z-40 flex justify-end">
          <div
            className="fixed inset-0 bg-slate-950/40"
            onClick={() => setShowHistoryDrawer(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 w-72 max-w-[85vw] h-full p-3 bg-slate-100 dark:bg-slate-950">
            {conversationListPanel}
          </div>
        </div>
      )}

      {/* Main Chat Container */}
      <div className="flex-1 min-h-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col overflow-hidden">
        {/* Workspace Header */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white truncate">
              {conversation.title}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              ShopEase Customer Support Assistant
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowHistoryDrawer(true)}
              className="xl:hidden h-9 px-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium whitespace-nowrap"
            >
              <History className="w-3.5 h-3.5" />
              <span>Chats</span>
            </button>

            <button
              type="button"
              onClick={onNewConversation}
              className="h-9 px-3 inline-flex items-center gap-1.5 rounded-lg bg-[#0B1F3A] hover:bg-blue-900 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-medium transition-colors whitespace-nowrap"
            >
              <MessageSquarePlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Chat</span>
            </button>
            <button
              type="button"
              onClick={onClearConversation}
              className="h-9 px-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-50/50 dark:bg-slate-950/40">
          {conversation.messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              onSelectSuggestion={handleSuggestionClick}
              onFeedback={onMessageFeedback}
              disableSuggestions={isTyping}
            />
          ))}

          {showStarterChips && (
            <div className="pl-10 space-y-2">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Suggested questions:
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_STARTERS.map((starter) => (
                  <button
                    key={starter}
                    type="button"
                    disabled={isTyping}
                    onClick={() => handleSuggestionClick(starter)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-600 hover:text-blue-700 dark:hover:text-blue-400 text-xs text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    {starter}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Composer */}
        <form
          onSubmit={handleSubmit}
          className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 sm:p-4 shrink-0"
        >
          {inputError && (
            <p
              className="mb-2 text-xs text-red-600 dark:text-red-400"
              role="alert"
            >
              {inputError}
            </p>
          )}
          <div className="flex items-center gap-2.5">
            <label htmlFor="chat-input" className="sr-only">
              Ask a customer support question
            </label>
            <input
              ref={inputRef}
              id="chat-input"
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (inputError) setInputError(null);
              }}
              placeholder="Ask about orders, refunds, shipping, coupons, or account help..."
              autoComplete="off"
              className="flex-1 h-11 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm sm:text-[15px] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
            />
            <button
              type="submit"
              disabled={isTyping}
              className="h-11 px-4 sm:px-5 inline-flex items-center justify-center gap-2 rounded-lg bg-[#0B1F3A] hover:bg-blue-900 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-sm font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:opacity-50"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
