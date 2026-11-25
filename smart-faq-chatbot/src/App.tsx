import { Menu, MessageSquarePlus, ShieldCheck } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnalyticsView } from './components/AnalyticsView';
import { ChatbotView } from './components/ChatbotView';
import { DashboardView } from './components/DashboardView';
import { FaqManagerView } from './components/FaqManagerView';
import { HistoryView } from './components/HistoryView';
import { SettingsView } from './components/SettingsView';
import { Sidebar } from './components/Sidebar';
import { defaultFaqData, type FaqItem } from './data/faqData';
import type {
  AppView,
  ChatMessageItem,
  Conversation,
  FaqFormValues,
  MessageFeedback,
  ThemeMode,
  UnansweredRecord,
} from './types/chat';
import { computeAnalytics } from './utils/analytics';
import {
  createFaqEngine,
  DEFAULT_SIMILARITY_THRESHOLD,
} from './utils/nlpEngine';

const STORAGE_KEYS = {
  faqs: 'faq_assistant_faqs_v1',
  migrated80: 'faq_assistant_migrated_80_v1',
  migratedAlternativesV2: 'faq_assistant_migrated_alts_v8',
  conversations: 'faq_assistant_conversations_v1',
  activeConvId: 'faq_assistant_active_conv_v1',
  unanswered: 'faq_assistant_unanswered_v1',
  theme: 'faq_assistant_theme_v1',
  threshold: 'faq_assistant_threshold_v1',
} as const;

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function createWelcomeMessage(): ChatMessageItem {
  const now = new Date();
  return {
    id: `welcome-${now.getTime()}`,
    sender: 'bot',
    text: "Hello! Welcome to FAQ Assistant. Ask any question about account registration, login, order tracking, payments, refunds, returns, cancellations, shipping, coupons, or customer support, and I'll match the best answer from our FAQ knowledge base.",
    timestamp: formatTime(now),
    createdAt: now.getTime(),
    isWelcome: true,
  };
}

function createEmptyConversation(): Conversation {
  const now = Date.now();
  return {
    id: `conv-${now}-${Math.random().toString(36).slice(2, 7)}`,
    title: 'New Conversation',
    createdAt: now,
    updatedAt: now,
    messages: [createWelcomeMessage()],
  };
}

function safeLoadJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function loadInitialFaqs(): FaqItem[] {
  const stored = safeLoadJson<FaqItem[] | null>(STORAGE_KEYS.faqs, null);
  if (!Array.isArray(stored) || stored.length === 0) {
    try {
      window.localStorage.setItem(STORAGE_KEYS.migrated80, 'true');
      window.localStorage.setItem(STORAGE_KEYS.migratedAlternativesV2, 'true');
    } catch {
      // ignore
    }
    return defaultFaqData;
  }

  let result = stored;

  // Upgrade existing 55-FAQ storage once to include expanded default FAQs (faq-56..faq-80)
  const alreadyMigrated =
    window.localStorage.getItem(STORAGE_KEYS.migrated80) === 'true';
  if (!alreadyMigrated) {
    const existingIds = new Set(result.map((f) => f.id));
    const missingDefaults = defaultFaqData.filter(
      (f) => !existingIds.has(f.id)
    );
    try {
      window.localStorage.setItem(STORAGE_KEYS.migrated80, 'true');
    } catch {
      // ignore
    }
    if (missingDefaults.length > 0) {
      result = [...result, ...missingDefaults];
    }
  }

  // Merge updated default alternative phrasings into existing default FAQs once
  const migratedAlts =
    window.localStorage.getItem(STORAGE_KEYS.migratedAlternativesV2) === 'true';
  if (!migratedAlts) {
    const defaultMap = new Map(defaultFaqData.map((f) => [f.id, f]));
    result = result.map((item) => {
      const def = defaultMap.get(item.id);
      if (!def) return item;
      const mergedAlts = Array.from(
        new Set([...item.alternatives, ...def.alternatives])
      );
      return { ...item, alternatives: mergedAlts };
    });
    try {
      window.localStorage.setItem(STORAGE_KEYS.migratedAlternativesV2, 'true');
    } catch {
      // ignore
    }
  }

  return result;
}

export default function App() {
  const [faqs, setFaqs] = useState<FaqItem[]>(loadInitialFaqs);

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const stored = safeLoadJson<Conversation[] | null>(
      STORAGE_KEYS.conversations,
      null
    );
    if (Array.isArray(stored) && stored.length > 0) {
      return stored;
    }
    return [createEmptyConversation()];
  });

  const [activeConversationId, setActiveConversationId] = useState<string>(
    () => {
      const savedId = window.localStorage.getItem(STORAGE_KEYS.activeConvId);
      const storedConvs = safeLoadJson<Conversation[]>(
        STORAGE_KEYS.conversations,
        []
      );
      if (savedId && storedConvs.some((c) => c.id === savedId)) {
        return savedId;
      }
      return storedConvs[0]?.id ?? '';
    }
  );

  const [unansweredLog, setUnansweredLog] = useState<UnansweredRecord[]>(() =>
    safeLoadJson<UnansweredRecord[]>(STORAGE_KEYS.unanswered, [])
  );

  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = window.localStorage.getItem(STORAGE_KEYS.theme);
    return saved === 'dark' ? 'dark' : 'light';
  });

  const [similarityThreshold, setSimilarityThreshold] = useState<number>(() => {
    const raw = window.localStorage.getItem(STORAGE_KEYS.threshold);
    const parsed = raw ? Number(raw) : NaN;
    if (!Number.isNaN(parsed) && parsed >= 0.1 && parsed <= 0.6) {
      return parsed;
    }
    return DEFAULT_SIMILARITY_THRESHOLD;
  });

  const [activeView, setActiveView] = useState<AppView>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [prefillFaqQuestion, setPrefillFaqQuestion] = useState<string | null>(
    null
  );

  const replyTimerRef = useRef<number | null>(null);
  const conversationsRef = useRef<Conversation[]>(conversations);
  conversationsRef.current = conversations;

  const activeConversation = useMemo(() => {
    return (
      conversations.find((c) => c.id === activeConversationId) ??
      conversations[0]
    );
  }, [conversations, activeConversationId]);

  useEffect(() => {
    if (activeConversation && activeConversation.id !== activeConversationId) {
      setActiveConversationId(activeConversation.id);
    }
  }, [activeConversation, activeConversationId]);

  const faqEngine = useMemo(() => createFaqEngine(faqs), [faqs]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.faqs, JSON.stringify(faqs));
    } catch {
      // Ignore storage quota errors
    }
  }, [faqs]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.conversations,
        JSON.stringify(conversations)
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [conversations]);

  useEffect(() => {
    try {
      if (activeConversation?.id) {
        window.localStorage.setItem(
          STORAGE_KEYS.activeConvId,
          activeConversation.id
        );
      }
    } catch {
      // Ignore storage quota errors
    }
  }, [activeConversation]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.unanswered,
        JSON.stringify(unansweredLog)
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [unansweredLog]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.threshold,
        String(similarityThreshold)
      );
    } catch {
      // Ignore storage errors
    }
  }, [similarityThreshold]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
      window.localStorage.setItem(STORAGE_KEYS.theme, theme);
    } catch {
      // Ignore storage errors
    }
  }, [theme]);

  useEffect(() => {
    return () => {
      if (replyTimerRef.current !== null) {
        window.clearTimeout(replyTimerRef.current);
      }
    };
  }, []);

  const analytics = useMemo(
    () => computeAnalytics(faqs.length, conversations),
    [faqs.length, conversations]
  );

  const savedHistoryCount = useMemo(
    () =>
      conversations.filter((c) => c.messages.some((m) => m.sender === 'user'))
        .length,
    [conversations]
  );

  const handleStartNewConversation = () => {
    if (replyTimerRef.current !== null) {
      window.clearTimeout(replyTimerRef.current);
      replyTimerRef.current = null;
      setIsTyping(false);
    }
    const fresh = createEmptyConversation();
    setConversations((prev) => [fresh, ...prev]);
    setActiveConversationId(fresh.id);
    setActiveView('chatbot');
  };

  const handleClearCurrentConversation = () => {
    if (!activeConversation) return;
    if (replyTimerRef.current !== null) {
      window.clearTimeout(replyTimerRef.current);
      replyTimerRef.current = null;
      setIsTyping(false);
    }
    setUnansweredLog((prev) =>
      prev.filter((entry) => entry.conversationId !== activeConversation.id)
    );
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === activeConversation.id
          ? {
              ...conv,
              title: 'New Conversation',
              updatedAt: Date.now(),
              messages: [createWelcomeMessage()],
            }
          : conv
      )
    );
  };

  const sendMessageToConversation = (targetConvId: string, rawText: string) => {
    const trimmed = rawText.trim();
    if (!trimmed || isTyping) return;

    const currentConv = conversationsRef.current.find(
      (c) => c.id === targetConvId
    );
    const normalizedQuery = trimmed.toLowerCase().replace(/\s+/g, ' ');
    const askedTextBefore = currentConv?.messages.some(
      (m) =>
        m.sender === 'user' &&
        m.text.trim().toLowerCase().replace(/\s+/g, ' ') === normalizedQuery
    );

    const now = new Date();
    const userMsg: ChatMessageItem = {
      id: `user-${now.getTime()}-${Math.random().toString(36).slice(2, 6)}`,
      sender: 'user',
      text: trimmed,
      timestamp: formatTime(now),
      createdAt: now.getTime(),
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id !== targetConvId) return conv;
        const isFirstUserMsg = !conv.messages.some((m) => m.sender === 'user');
        const derivedTitle =
          trimmed.length > 46 ? `${trimmed.slice(0, 46)}…` : trimmed;
        return {
          ...conv,
          title: isFirstUserMsg ? derivedTitle : conv.title,
          updatedAt: now.getTime(),
          messages: [...conv.messages, userMsg],
        };
      })
    );

    setIsTyping(true);

    replyTimerRef.current = window.setTimeout(() => {
      const result = faqEngine.findBestMatch(trimmed, similarityThreshold);
      const replyNow = new Date();

      const latestConv = conversationsRef.current.find(
        (c) => c.id === targetConvId
      );
      const matchedFaqBefore =
        result.matched &&
        result.matchedFaqId &&
        latestConv?.messages.some(
          (m) => m.sender === 'bot' && m.matchedFaqId === result.matchedFaqId
        );

      const botMsg: ChatMessageItem = {
        id: `bot-${replyNow.getTime()}-${Math.random().toString(36).slice(2, 6)}`,
        sender: 'bot',
        text: result.answer,
        timestamp: formatTime(replyNow),
        createdAt: replyNow.getTime(),
        isFallback: !result.matched,
        isRepeated: Boolean(askedTextBefore || matchedFaqBefore),
        matchedFaqId: result.matchedFaqId,
        matchedQuestion: result.matchedQuestion,
        category: result.category,
        confidencePercent: result.confidencePercent,
        suggestions: result.suggestions,
        feedback: null,
      };

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === targetConvId
            ? {
                ...conv,
                updatedAt: replyNow.getTime(),
                messages: [...conv.messages, botMsg],
              }
            : conv
        )
      );

      if (!result.matched) {
        setUnansweredLog((prev) => [
          {
            id: `unans-${replyNow.getTime()}`,
            query: trimmed,
            timestamp: replyNow.getTime(),
            bestSimilarityPercent: result.confidencePercent,
            conversationId: targetConvId,
          },
          ...prev,
        ]);
      }

      setIsTyping(false);
      replyTimerRef.current = null;
    }, 420);
  };

  const handleMessageFeedback = (
    messageId: string,
    feedback: MessageFeedback
  ) => {
    if (!activeConversation) return;
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === activeConversation.id
          ? {
              ...conv,
              messages: conv.messages.map((msg) =>
                msg.id === messageId ? { ...msg, feedback } : msg
              ),
            }
          : conv
      )
    );
  };

  const handleAskSampleFromDashboard = (question: string) => {
    if (replyTimerRef.current !== null) {
      window.clearTimeout(replyTimerRef.current);
      replyTimerRef.current = null;
      setIsTyping(false);
    }
    const fresh = createEmptyConversation();
    setConversations((prev) => [fresh, ...prev]);
    setActiveConversationId(fresh.id);
    setActiveView('chatbot');
    window.setTimeout(() => {
      sendMessageToConversation(fresh.id, question);
    }, 30);
  };

  const handleReopenConversation = (conversationId: string) => {
    setActiveConversationId(conversationId);
    setActiveView('chatbot');
  };

  const handleRenameConversation = (
    conversationId: string,
    newTitle: string
  ) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId
          ? { ...conv, title: newTitle, updatedAt: Date.now() }
          : conv
      )
    );
  };

  const handleDeleteConversation = (conversationId: string) => {
    if (
      conversationId === activeConversationId &&
      replyTimerRef.current !== null
    ) {
      window.clearTimeout(replyTimerRef.current);
      replyTimerRef.current = null;
      setIsTyping(false);
    }
    setUnansweredLog((prev) =>
      prev.filter((entry) => entry.conversationId !== conversationId)
    );
    setConversations((prev) => {
      const remaining = prev.filter((c) => c.id !== conversationId);
      if (remaining.length === 0) {
        const fresh = createEmptyConversation();
        setActiveConversationId(fresh.id);
        return [fresh];
      }
      if (conversationId === activeConversationId) {
        setActiveConversationId(remaining[0].id);
      }
      return remaining;
    });
  };

  const handleClearHistory = () => {
    if (replyTimerRef.current !== null) {
      window.clearTimeout(replyTimerRef.current);
      replyTimerRef.current = null;
      setIsTyping(false);
    }
    const fresh = createEmptyConversation();
    setConversations([fresh]);
    setActiveConversationId(fresh.id);
    setUnansweredLog([]);
  };

  const handleAddFaq = (values: FaqFormValues) => {
    const newFaq: FaqItem = {
      id: `faq-${Date.now()}`,
      ...values,
    };
    setFaqs((prev) => [newFaq, ...prev]);
  };

  const handleUpdateFaq = (id: string, values: FaqFormValues) => {
    setFaqs((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...values } : item))
    );
  };

  const handleDeleteFaq = (id: string) => {
    setFaqs((prev) => prev.filter((item) => item.id !== id));
  };

  const handleResetFaqs = () => {
    setFaqs(defaultFaqData);
  };

  const handleAddFaqFromUnanswered = (questionText: string) => {
    setPrefillFaqQuestion(questionText);
    setActiveView('faq-manager');
  };

  return (
    <div className="h-dvh flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden">
      {/* Mobile Header */}
      <header className="lg:hidden bg-[#0B1F3A] text-white px-4 py-3 flex items-center justify-between gap-3 shrink-0 border-b border-slate-800">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            className="p-1.5 -ml-1.5 rounded-lg text-slate-200 hover:bg-white/10"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
            <span className="text-sm font-bold tracking-tight truncate">
              FAQ Assistant
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleStartNewConversation}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium whitespace-nowrap shrink-0"
        >
          <MessageSquarePlus className="w-3.5 h-3.5" />
          <span>New Chat</span>
        </button>
      </header>

      {/* Sidebar */}
      <Sidebar
        activeView={activeView}
        onSelectView={setActiveView}
        onNewConversation={handleStartNewConversation}
        totalFaqs={faqs.length}
        historyCount={savedHistoryCount}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <main className="flex-1 min-w-0 h-full overflow-y-auto">
        {activeView === 'dashboard' && (
          <DashboardView
            analytics={analytics}
            onStartNewConversation={handleStartNewConversation}
            onAskSampleQuestion={handleAskSampleFromDashboard}
            onOpenConversation={handleReopenConversation}
            onNavigateFaqManager={() => setActiveView('faq-manager')}
            onNavigateAnalytics={() => setActiveView('analytics')}
          />
        )}

        {activeView === 'chatbot' && activeConversation && (
          <ChatbotView
            conversation={activeConversation}
            conversations={conversations}
            isTyping={isTyping}
            onSendMessage={(text) =>
              sendMessageToConversation(activeConversation.id, text)
            }
            onClearConversation={handleClearCurrentConversation}
            onNewConversation={handleStartNewConversation}
            onSelectConversation={setActiveConversationId}
            onMessageFeedback={handleMessageFeedback}
          />
        )}

        {activeView === 'analytics' && (
          <AnalyticsView
            analytics={analytics}
            onOpenConversation={handleReopenConversation}
            onStartNewConversation={handleStartNewConversation}
          />
        )}

        {activeView === 'faq-manager' && (
          <FaqManagerView
            faqs={faqs}
            onAddFaq={handleAddFaq}
            onUpdateFaq={handleUpdateFaq}
            onDeleteFaq={handleDeleteFaq}
            prefillQuestion={prefillFaqQuestion}
            onClearPrefill={() => setPrefillFaqQuestion(null)}
          />
        )}

        {activeView === 'history' && (
          <HistoryView
            conversations={conversations}
            activeConversationId={activeConversation?.id ?? ''}
            unansweredLog={unansweredLog}
            onReopenConversation={handleReopenConversation}
            onRenameConversation={handleRenameConversation}
            onDeleteConversation={handleDeleteConversation}
            onClearHistory={handleClearHistory}
            onAddFaqFromUnanswered={handleAddFaqFromUnanswered}
          />
        )}

        {activeView === 'settings' && (
          <SettingsView
            theme={theme}
            onChangeTheme={setTheme}
            similarityThreshold={similarityThreshold}
            onChangeThreshold={setSimilarityThreshold}
            onClearHistory={handleClearHistory}
            onResetFaqs={handleResetFaqs}
            totalFaqs={faqs.length}
          />
        )}
      </main>
    </div>
  );
}
