import type { FaqCategory } from '../data/faqData';
import type { ChatMessageItem, Conversation, SessionStats } from '../types/chat';

export interface ActivityEntry {
  id: string;
  conversationId: string;
  question: string;
  matched: boolean;
  confidencePercent: number;
  timestamp: string;
  createdAt: number;
  matchedQuestion: string | null;
  category: FaqCategory | null;
  feedback: 'helpful' | 'not-helpful' | null;
}

export interface FrequentQuestionItem {
  question: string;
  category: FaqCategory | null;
  count: number;
  avgConfidencePercent: number;
}

export interface PopularCategoryItem {
  category: FaqCategory;
  count: number;
  sharePercent: number;
}

export interface ComputedAnalytics {
  stats: SessionStats;
  recentActivity: ActivityEntry[];
  frequentQuestions: FrequentQuestionItem[];
  popularCategories: PopularCategoryItem[];
}

export function computeAnalytics(
  totalFaqs: number,
  conversations: Conversation[]
): ComputedAnalytics {
  let questionsAsked = 0;
  let matchedCount = 0;
  let unansweredCount = 0;
  let helpfulCount = 0;
  let notHelpfulCount = 0;

  const recentActivity: ActivityEntry[] = [];
  const questionFreqMap = new Map<
    string,
    { question: string; category: FaqCategory | null; count: number; confidenceSum: number }
  >();
  const categoryCountMap = new Map<FaqCategory, number>();

  for (const conv of conversations) {
    const msgs = conv.messages;
    for (let i = 0; i < msgs.length; i++) {
      const msg: ChatMessageItem = msgs[i];
      if (msg.sender !== 'user') continue;

      const reply = msgs[i + 1];
      if (!reply || reply.sender !== 'bot') continue;

      questionsAsked += 1;

      const isMatched = !reply.isFallback;
      if (isMatched) {
        matchedCount += 1;
      } else {
        unansweredCount += 1;
      }

      if (reply.feedback === 'helpful') helpfulCount += 1;
      if (reply.feedback === 'not-helpful') notHelpfulCount += 1;

      recentActivity.push({
        id: msg.id,
        conversationId: conv.id,
        question: msg.text,
        matched: isMatched,
        confidencePercent: reply.confidencePercent ?? 0,
        timestamp: msg.timestamp,
        createdAt: msg.createdAt,
        matchedQuestion: reply.matchedQuestion ?? null,
        category: reply.category ?? null,
        feedback: reply.feedback ?? null,
      });

      const freqKey =
        isMatched && reply.matchedQuestion
          ? reply.matchedQuestion
          : msg.text.trim().toLowerCase();
      const displayQuestion =
        isMatched && reply.matchedQuestion ? reply.matchedQuestion : msg.text;

      const existingFreq = questionFreqMap.get(freqKey);
      if (existingFreq) {
        existingFreq.count += 1;
        existingFreq.confidenceSum += reply.confidencePercent ?? 0;
      } else {
        questionFreqMap.set(freqKey, {
          question: displayQuestion,
          category: reply.category ?? null,
          count: 1,
          confidenceSum: reply.confidencePercent ?? 0,
        });
      }

      if (isMatched && reply.category) {
        categoryCountMap.set(
          reply.category,
          (categoryCountMap.get(reply.category) ?? 0) + 1
        );
      }
    }
  }

  const evaluatedCount = matchedCount + unansweredCount;
  const successRatePercent =
    evaluatedCount > 0 ? Math.round((matchedCount / evaluatedCount) * 100) : 0;

  const frequentQuestions: FrequentQuestionItem[] = Array.from(
    questionFreqMap.values()
  )
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)
    .map((entry) => ({
      question: entry.question,
      category: entry.category,
      count: entry.count,
      avgConfidencePercent: Math.round(entry.confidenceSum / entry.count),
    }));

  const popularCategories: PopularCategoryItem[] = Array.from(
    categoryCountMap.entries()
  )
    .sort((a, b) => b[1] - a[1])
    .map(([category, count]) => ({
      category,
      count,
      sharePercent:
        matchedCount > 0 ? Math.round((count / matchedCount) * 100) : 0,
    }));

  return {
    stats: {
      totalFaqs,
      questionsAsked,
      matchedCount,
      unansweredCount,
      successRatePercent,
      helpfulCount,
      notHelpfulCount,
    },
    recentActivity: recentActivity.sort((a, b) => b.createdAt - a.createdAt),
    frequentQuestions,
    popularCategories,
  };
}
