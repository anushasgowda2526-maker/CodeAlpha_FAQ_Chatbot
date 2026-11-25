import type { FaqCategory, FaqItem } from '../data/faqData';

export type AppView =
  | 'dashboard'
  | 'chatbot'
  | 'analytics'
  | 'faq-manager'
  | 'history'
  | 'settings';

export type ThemeMode = 'light' | 'dark';

export type MessageFeedback = 'helpful' | 'not-helpful' | null;

export interface SuggestedFaq {
  id: string;
  question: string;
  category: FaqCategory;
  confidencePercent: number;
}

export interface ChatMessageItem {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  createdAt: number;
  isWelcome?: boolean;
  isFallback?: boolean;
  isRepeated?: boolean;
  matchedFaqId?: string | null;
  matchedQuestion?: string | null;
  category?: FaqCategory | null;
  confidencePercent?: number;
  suggestions?: SuggestedFaq[];
  feedback?: MessageFeedback;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessageItem[];
}

export interface UnansweredRecord {
  id: string;
  query: string;
  timestamp: number;
  bestSimilarityPercent: number;
  conversationId: string;
}

export interface SessionStats {
  totalFaqs: number;
  questionsAsked: number;
  matchedCount: number;
  unansweredCount: number;
  successRatePercent: number;
  helpfulCount: number;
  notHelpfulCount: number;
}

export interface FaqFormValues {
  category: FaqCategory;
  question: string;
  alternatives: string[];
  answer: string;
}

export type FaqList = FaqItem[];
