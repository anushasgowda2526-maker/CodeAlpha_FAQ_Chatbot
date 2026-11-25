import type { FaqCategory, FaqItem } from '../data/faqData';
import type { SuggestedFaq } from '../types/chat';

export const DEFAULT_SIMILARITY_THRESHOLD = 0.24;
export const WEAK_SUGGESTION_THRESHOLD = 0.14;
export const WEAK_MATCH_CUTOFF = 0.45;

export const FALLBACK_MESSAGE =
  "I couldn't find an answer to that in our FAQ knowledge base. Please try rephrasing your question with a few more details about your order, payment, delivery, or account.";

export const FALLBACK_MESSAGE_WITH_SUGGESTIONS =
  "I couldn't find an exact answer for that in our FAQ knowledge base. Please try rephrasing your question, or select one of the related questions below.";

export type QueryIntent =
  | 'refund_timing'
  | 'refund_status'
  | 'return_eligibility'
  | 'product_exchange'
  | 'order_tracking'
  | 'order_modification'
  | 'order_cancellation'
  | 'payment_issue'
  | 'discounts_coupons'
  | 'password_recovery'
  | 'damaged_or_missing_item'
  | 'general';

const CONTRACTION_REPLACEMENTS: Array<[RegExp, string]> = [
  [/\bcan't\b/g, 'can not'],
  [/\bcannot\b/g, 'can not'],
  [/\bwon't\b/g, 'will not'],
  [/\bshan't\b/g, 'shall not'],
  [/([a-z]+)n't\b/g, '$1 not'],
  [/\bi'm\b/g, 'i am'],
  [/\bi've\b/g, 'i have'],
  [/\bi'll\b/g, 'i will'],
  [/\bi'd\b/g, 'i would'],
  [/\b(it|that|what|where|who|how)'s\b/g, '$1 is'],
  [/'re\b/g, ' are'],
  [/'ve\b/g, ' have'],
  [/'ll\b/g, ' will'],
  [/'d\b/g, ' would'],
  [/'s\b/g, ''],
];

const PHRASE_SYNONYMS: Array<[RegExp, string]> = [
  // Refund & reimbursement expressions
  [/\bget\s+(?:my\s+)?money\s+back\b/g, ' refund '],
  [/\bmoney\s+(?:come\s+)?back\b/g, ' refund '],
  [/\bmoney\s+(?:be\s+)?returned\b/g, ' refund '],
  [/\bamount\s+(?:be\s+)?credited\b/g, ' refund credit '],
  // Return exclusion negation phrases
  [/\bnon[\s-]+returnable\b/g, ' nonreturnable '],
  [/\bcan\s+not\s+be\s+returned\b/g, ' nonreturnable '],
  [/\bcan\s+not\s+return\b/g, ' nonreturnable '],
  // Tracking & account expressions
  [
    /\bcheck\s+(?:the\s+)?(?:my\s+)?(?:order\s+|shipment\s+|delivery\s+|package\s+|parcel\s+)?status\b/g,
    ' track ',
  ],
  [/\bshipment\s+status\b/g, ' track '],
  [/\bdelivery\s+status\b/g, ' track '],
  [/\bwhere\s+is\b/g, ' track '],
  [/\bwheres\b/g, ' track '],
  [/\bsign\s+in\b/g, ' login '],
  [/\blog\s+in\b/g, ' login '],
  [/\bsign\s+up\b/g, ' register '],
  // Password recovery expressions
  [
    /\b(?:can\s+not|could\s+not|do\s+not|did\s+not|unable\s+to)\s+remember\b/g,
    ' forgot ',
  ],
  [/\b(?:lost|misplaced)\s+(?:my\s+)?password\b/g, ' forgot password '],
  [
    /\b(?:regain|get\s+back)\s+(?:access\s+to\s+|into\s+)?(?:my\s+)?account\b/g,
    ' access account ',
  ],
];

const STOP_WORDS = new Set([
  'a',
  'able',
  'about',
  'above',
  'actually',
  'after',
  'again',
  'all',
  'already',
  'also',
  'am',
  'an',
  'and',
  'any',
  'anyone',
  'anything',
  'are',
  'as',
  'at',
  'basically',
  'be',
  'because',
  'been',
  'before',
  'being',
  'below',
  'between',
  'both',
  'but',
  'by',
  'can',
  'could',
  'did',
  'do',
  'does',
  'doing',
  'down',
  'during',
  'each',
  'everything',
  'excuse',
  'few',
  'for',
  'from',
  'further',
  'get',
  'got',
  'had',
  'has',
  'have',
  'having',
  'he',
  'hello',
  'her',
  'here',
  'hers',
  'herself',
  'hey',
  'hi',
  'him',
  'himself',
  'his',
  'how',
  'i',
  'if',
  'in',
  'into',
  'is',
  'it',
  'its',
  'itself',
  'just',
  'kindly',
  'know',
  'maybe',
  'me',
  'more',
  'most',
  'my',
  'myself',
  'need',
  'no',
  'nor',
  'not',
  'nothing',
  'now',
  'of',
  'off',
  'on',
  'once',
  'only',
  'or',
  'other',
  'our',
  'ours',
  'ourselves',
  'out',
  'over',
  'own',
  'please',
  'possibly',
  'really',
  'same',
  'she',
  'should',
  'so',
  'some',
  'someone',
  'something',
  'still',
  'such',
  'supposed',
  'tell',
  'than',
  'thank',
  'thanks',
  'that',
  'the',
  'their',
  'theirs',
  'them',
  'themselves',
  'then',
  'there',
  'these',
  'they',
  'this',
  'those',
  'through',
  'to',
  'today',
  'tomorrow',
  'too',
  'tried',
  'trying',
  'under',
  'until',
  'up',
  'very',
  'want',
  'was',
  'we',
  'were',
  'what',
  'when',
  'where',
  'which',
  'while',
  'who',
  'whom',
  'why',
  'will',
  'with',
  'wondering',
  'would',
  'yesterday',
  'yet',
  'you',
  'your',
  'yours',
  'yourself',
  'yourselves',
]);

const STEM_OVERRIDES: Record<string, string> = {
  arrived: 'arrive',
  arriving: 'arrive',
  arrival: 'arrive',
  received: 'receive',
  receiving: 'receive',
  delivered: 'deliver',
  delivering: 'deliver',
  delivery: 'deliver',
  damaged: 'damage',
  damaging: 'damage',
  expired: 'expire',
  expiring: 'expire',
  charged: 'charge',
  charging: 'charge',
  credited: 'credit',
  crediting: 'credit',
  updated: 'update',
  updating: 'update',
  scheduled: 'schedule',
  scheduling: 'schedule',
  disabled: 'disable',
  completed: 'complete',
  issued: 'issue',
  placed: 'place',
  placing: 'place',
  cancelled: 'cancel',
  cancelling: 'cancel',
  canceled: 'cancel',
  canceling: 'cancel',
  cancellation: 'cancel',
  cancellations: 'cancel',
  shipped: 'ship',
  shipping: 'ship',
  shipment: 'ship',
  shipments: 'ship',
  missed: 'miss',
  missing: 'miss',
  failed: 'fail',
  failing: 'fail',
  failure: 'fail',
  used: 'use',
  using: 'use',
  locked: 'lock',
  locking: 'lock',
  paid: 'pay',
  paying: 'pay',
  payment: 'pay',
  payments: 'pay',
  returning: 'return',
  returned: 'return',
  returns: 'return',
  refunded: 'refund',
  refunding: 'refund',
  refunds: 'refund',
  exchanging: 'exchange',
  exchanged: 'exchange',
  exchanges: 'exchange',
  tracking: 'track',
  tracked: 'track',
  delayed: 'delay',
  delaying: 'delay',
  delays: 'delay',
  replacement: 'replace',
  replacements: 'replace',
  replaced: 'replace',
  replacing: 'replace',
  defective: 'defect',
  defects: 'defect',
  recieved: 'receive',
  recieve: 'receive',
  adress: 'address',
  cancle: 'cancel',
  pasword: 'password',
  passwrod: 'password',
  cupon: 'promo',
  delivry: 'deliver',
  shiping: 'ship',
  traking: 'track',
  exchage: 'exchange',
  damged: 'damage',
  paymnet: 'pay',
  refud: 'refund',
  forgotten: 'forgot',
  forgetting: 'forgot',
  forget: 'forgot',
  forgets: 'forgot',
  remembered: 'remember',
  remembering: 'remember',
  accessed: 'access',
  accessing: 'access',
  reimbursed: 'reimburse',
  reimbursing: 'reimburse',
  reimbursement: 'reimburse',
};

const SYNONYM_MAP: Record<string, string> = {
  purchase: 'order',
  purchased: 'order',
  purchases: 'order',
  parcel: 'package',
  parcels: 'package',
  box: 'package',
  product: 'item',
  products: 'item',
  arrive: 'deliver',
  broken: 'damage',
  defect: 'damage',
  faulty: 'damage',
  cracked: 'damage',
  shattered: 'damage',
  late: 'delay',
  overdue: 'delay',
  slow: 'delay',
  reimburse: 'refund',
  coupon: 'promo',
  voucher: 'promo',
  discount: 'promo',
  signin: 'login',
  signup: 'register',
  create: 'register',
  recover: 'reset',
  recovery: 'reset',
  helpline: 'support',
  agent: 'support',
  representative: 'support',
  service: 'support',
};

function normalizeToken(token: string): string {
  if (STEM_OVERRIDES[token]) {
    const stem = STEM_OVERRIDES[token];
    return SYNONYM_MAP[stem] ?? stem;
  }

  let stem = token;
  if (stem.length > 3) {
    if (stem.endsWith('ies') && stem.length > 4) {
      stem = stem.slice(0, -3) + 'y';
    } else if (stem.endsWith('ied') && stem.length > 4) {
      stem = stem.slice(0, -3) + 'y';
    } else if (stem.endsWith('ing') && stem.length > 5) {
      stem = stem.slice(0, -3);
      if (stem.length >= 3 && stem[stem.length - 1] === stem[stem.length - 2]) {
        stem = stem.slice(0, -1);
      }
    } else if (stem.endsWith('ed') && stem.length > 4) {
      stem = stem.slice(0, -2);
      if (stem.length >= 3 && stem[stem.length - 1] === stem[stem.length - 2]) {
        stem = stem.slice(0, -1);
      }
    } else if (stem.endsWith('es') && stem.length > 4 && !stem.endsWith('ss')) {
      stem = stem.slice(0, -2);
    } else if (stem.endsWith('s') && stem.length > 3 && !stem.endsWith('ss')) {
      stem = stem.slice(0, -1);
    }
  }

  if (STEM_OVERRIDES[stem]) {
    stem = STEM_OVERRIDES[stem];
  }

  return SYNONYM_MAP[stem] ?? stem;
}

function damerauLevenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (Math.abs(m - n) > 2) return 3;

  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array<number>(n + 1).fill(0)
  );

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let val = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
      if (
        i > 1 &&
        j > 1 &&
        a[i - 1] === b[j - 2] &&
        a[i - 2] === b[j - 1]
      ) {
        val = Math.min(val, dp[i - 2][j - 2] + cost);
      }
      dp[i][j] = val;
    }
  }

  return dp[m][n];
}

export function preprocessText(text: string): string[] {
  let normalized = text.normalize('NFKC').toLowerCase().replace(/[’‘]/g, "'");

  for (const [pattern, replacement] of CONTRACTION_REPLACEMENTS) {
    normalized = normalized.replace(pattern, replacement);
  }

  for (const [pattern, replacement] of PHRASE_SYNONYMS) {
    normalized = normalized.replace(pattern, ` ${replacement} `);
  }

  const cleaned = normalized
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned) return [];

  const rawTokens = cleaned.split(' ').filter(Boolean);
  const tokens: string[] = [];

  for (const token of rawTokens) {
    if (STOP_WORDS.has(token)) continue;
    const canonical = normalizeToken(token);
    if (canonical && !STOP_WORDS.has(canonical)) {
      tokens.push(canonical);
    }
  }

  return tokens;
}

export function detectQueryIntent(
  rawQuery: string,
  tokens: string[]
): QueryIntent {
  const tokenSet = new Set(tokens);
  const lower = rawQuery.toLowerCase();

  // 0a. Explicit size/color/item exchange intent takes precedence
  if (tokenSet.has('exchange') || tokenSet.has('swap')) {
    return 'product_exchange';
  }

  // 0b. Damaged, broken, defective, or missing item intent
  const hasDamageCue =
    tokenSet.has('damage') ||
    /\b(damaged?|broken|defective|defect|faulty|cracked|shattered)\b/.test(
      lower
    );
  const hasMissingItemCue =
    tokenSet.has('miss') &&
    (tokenSet.has('item') || tokenSet.has('order') || tokenSet.has('part')) &&
    !tokenSet.has('refund') &&
    !tokenSet.has('email') &&
    !tokenSet.has('confirm');

  if (
    (hasDamageCue || hasMissingItemCue) &&
    !tokenSet.has('fee') &&
    !tokenSet.has('charge')
  ) {
    return 'damaged_or_missing_item';
  }

  // 1. Refund timing vs Refund status (check before cancellation/discounts when refund is requested)
  const hasMoneyRefundCue =
    /\b(?:money\s+back|get\s+(?:my\s+)?money|money\s+return|money\s+come\s+back)\b/.test(
      lower
    );
  const isPaymentDeductionIssue =
    (tokenSet.has('deduct') ||
      tokenSet.has('debit') ||
      tokenSet.has('declin') ||
      tokenSet.has('decline') ||
      tokenSet.has('fail') ||
      /\bcharged\s+twice\b/.test(lower) ||
      /\bduplicate\s+charge\b/.test(lower)) &&
    !tokenSet.has('refund');

  if (
    !isPaymentDeductionIssue &&
    (tokenSet.has('refund') ||
      hasMoneyRefundCue ||
      /\breimburs/.test(lower) ||
      (tokenSet.has('credit') && !/\bgift\s+card\b/.test(lower) && !tokenSet.has('card')))
  ) {
    const hasTimingCue =
      /\b(when|how\s+long|how\s+many\s+days|days|time|credited|take|takes)\b/.test(
        lower
      ) ||
      tokenSet.has('long') ||
      tokenSet.has('day') ||
      tokenSet.has('credit');

    const hasStatusCue =
      /\b(status|where|not\s+arrived|hasn't\s+arrived|haven't\s+received|missing|pending|delayed|overdue)\b/.test(
        lower
      ) ||
      tokenSet.has('track') ||
      tokenSet.has('delay') ||
      tokenSet.has('pending');

    if (hasTimingCue && !hasStatusCue) {
      return 'refund_timing';
    }
    if (hasStatusCue) {
      return 'refund_status';
    }
    return 'refund_timing';
  }

  // 2. Product exchanges intent
  if (
    tokenSet.has('exchange') ||
    tokenSet.has('swap') ||
    tokenSet.has('replace')
  ) {
    return 'product_exchange';
  }

  // 3. Return eligibility & non-returnable products intent
  if (
    tokenSet.has('nonreturnable') ||
    tokenSet.has('exclude') ||
    tokenSet.has('excluded') ||
    tokenSet.has('eligibility') ||
    tokenSet.has('eligible') ||
    (tokenSet.has('return') && tokenSet.has('policy'))
  ) {
    return 'return_eligibility';
  }

  // 4. Order cancellation intent
  if (
    tokenSet.has('cancel') ||
    /\bstop\s+(?:my\s+)?(?:order|delivery|subscription)\b/.test(lower)
  ) {
    return 'order_cancellation';
  }

  // 5. Order & address modification intent (checked before order_tracking so "delivery address" routes here)
  if (
    (tokenSet.has('address') ||
      tokenSet.has('detail') ||
      tokenSet.has('details') ||
      tokenSet.has('quantity') ||
      tokenSet.has('variant')) &&
    (tokenSet.has('change') ||
      tokenSet.has('edit') ||
      tokenSet.has('modify') ||
      tokenSet.has('update') ||
      tokenSet.has('wrong') ||
      tokenSet.has('save') ||
      tokenSet.has('remove') ||
      tokenSet.has('add')) &&
    !tokenSet.has('email') &&
    !tokenSet.has('phone')
  ) {
    return 'order_modification';
  }
  if (
    (tokenSet.has('change') || tokenSet.has('edit') || tokenSet.has('modify')) &&
    tokenSet.has('order') &&
    (tokenSet.has('item') || tokenSet.has('detail') || tokenSet.has('details'))
  ) {
    return 'order_modification';
  }

  // 6. Discounts & coupons intent
  if (
    tokenSet.has('promo') ||
    tokenSet.has('reward') ||
    tokenSet.has('referral') ||
    tokenSet.has('refer') ||
    /\b(coupon|voucher|discount|promo\s*code|price\s+match|price\s+drop)\b/.test(
      lower
    )
  ) {
    return 'discounts_coupons';
  }

  // 7. Password recovery & reset intent
  if (
    tokenSet.has('password') &&
    (tokenSet.has('forgot') ||
      tokenSet.has('reset') ||
      tokenSet.has('remember') ||
      tokenSet.has('access') ||
      /\b(forgot|forgotten|forget|reset|recover|recovery|remember|lost|access)\b/.test(
        lower
      ))
  ) {
    return 'password_recovery';
  }

  // 8. Payment issues & billing intent
  if (
    isPaymentDeductionIssue ||
    tokenSet.has('pay') ||
    tokenSet.has('paypal') ||
    tokenSet.has('emi') ||
    tokenSet.has('installment') ||
    /\b(credit\s+card|debit\s+card|transaction|declined|charged\s+twice|gift\s+card)\b/.test(
      lower
    )
  ) {
    return 'payment_issue';
  }

  // 9. Order tracking & delivery intent
  if (
    (tokenSet.has('track') ||
      tokenSet.has('package') ||
      tokenSet.has('delay') ||
      tokenSet.has('transit') ||
      tokenSet.has('deliver')) &&
    !tokenSet.has('return') &&
    !tokenSet.has('cancel')
  ) {
    return 'order_tracking';
  }

  return 'general';
}

interface IndexedFaqDocument {
  faqItem: FaqItem;
  combinedTokens: Set<string>;
  combinedVector: Map<string, number>;
  combinedNorm: number;
  phrasingVectors: Array<{ vector: Map<string, number>; norm: number }>;
}

export interface MatchResult {
  matched: boolean;
  intent: QueryIntent;
  answer: string;
  matchedFaqId: string | null;
  matchedQuestion: string | null;
  category: FaqCategory | null;
  similarity: number;
  confidencePercent: number;
  suggestions: SuggestedFaq[];
}

export class TfidfFaqEngine {
  private idfMap: Map<string, number> = new Map();
  private vocabTerms: string[] = [];
  private indexedDocs: IndexedFaqDocument[] = [];

  constructor(faqs: FaqItem[]) {
    this.buildIndex(faqs);
  }

  /**
   * Builds the TF-IDF document corpus where each FAQ's searchable representation
   * combines its main question and all alternative phrasings.
   */
  private buildIndex(faqs: FaqItem[]): void {
    const preparedFaqs = faqs.map((faqItem) => {
      const phrasings = [faqItem.question, ...(faqItem.alternatives || [])];
      const combinedText = phrasings.join(' ');
      const combinedTokens = preprocessText(combinedText);
      const phrasingTokenLists = phrasings
        .map((p) => preprocessText(p))
        .filter((list) => list.length > 0);
      return {
        faqItem,
        combinedTokens,
        phrasingTokenLists,
      };
    });

    const totalFaqs = preparedFaqs.length;
    const documentFrequency = new Map<string, number>();

    for (const doc of preparedFaqs) {
      const uniqueTerms = new Set(doc.combinedTokens);
      for (const term of uniqueTerms) {
        documentFrequency.set(term, (documentFrequency.get(term) ?? 0) + 1);
      }
    }

    for (const [term, df] of documentFrequency.entries()) {
      const idf = Math.log((totalFaqs + 1) / (df + 1)) + 1;
      this.idfMap.set(term, idf);
    }

    this.vocabTerms = Array.from(this.idfMap.keys());

    this.indexedDocs = preparedFaqs.map(
      ({ faqItem, combinedTokens, phrasingTokenLists }) => {
        const combinedVector = this.computeTfIdfVector(
          combinedTokens.map((t) => ({ term: t, weight: 1 })),
          combinedTokens.length
        );
        const combinedNorm = this.computeNorm(combinedVector);

        const phrasingVectors = phrasingTokenLists.map((tokens) => {
          const vector = this.computeTfIdfVector(
            tokens.map((t) => ({ term: t, weight: 1 })),
            tokens.length
          );
          return { vector, norm: this.computeNorm(vector) };
        });

        return {
          faqItem,
          combinedTokens: new Set(combinedTokens),
          combinedVector,
          combinedNorm,
          phrasingVectors,
        };
      }
    );
  }

  private resolveQueryToken(token: string): { term: string; weight: number } | null {
    if (this.idfMap.has(token)) {
      return { term: token, weight: 1 };
    }

    if (token.length < 5) return null;

    const maxDist = token.length >= 8 ? 2 : 1;
    let bestTerm: string | null = null;
    let bestDist = maxDist + 1;

    for (const candidate of this.vocabTerms) {
      if (candidate.length < 4) continue;
      if (Math.abs(candidate.length - token.length) > maxDist) continue;
      if (candidate[0] !== token[0]) continue;

      const dist = damerauLevenshtein(token, candidate);
      if (dist <= maxDist && dist < bestDist) {
        bestDist = dist;
        bestTerm = candidate;
        if (dist === 1) break;
      }
    }

    if (!bestTerm) return null;
    return { term: bestTerm, weight: bestDist === 1 ? 0.9 : 0.78 };
  }

  private computeTfIdfVector(
    weightedTokens: Array<{ term: string; weight: number }>,
    totalLength: number
  ): Map<string, number> {
    const vector = new Map<string, number>();
    if (totalLength === 0) return vector;

    const termWeights = new Map<string, number>();
    for (const { term, weight } of weightedTokens) {
      termWeights.set(term, (termWeights.get(term) ?? 0) + weight);
    }

    for (const [term, countWeight] of termWeights.entries()) {
      const idf = this.idfMap.get(term);
      if (idf !== undefined) {
        const tf = countWeight / totalLength;
        vector.set(term, tf * idf);
      }
    }

    return vector;
  }

  private computeNorm(vector: Map<string, number>): number {
    let sumSq = 0;
    for (const weight of vector.values()) {
      sumSq += weight * weight;
    }
    return Math.sqrt(sumSq);
  }

  private cosineSimilarity(
    vecA: Map<string, number>,
    normA: number,
    vecB: Map<string, number>,
    normB: number
  ): number {
    if (normA === 0 || normB === 0) return 0;

    let dot = 0;
    for (const [term, weightA] of vecA.entries()) {
      const weightB = vecB.get(term);
      if (weightB !== undefined) {
        dot += weightA * weightB;
      }
    }

    return dot / (normA * normB);
  }

  private isIntentCompatible(doc: IndexedFaqDocument, intent: QueryIntent): boolean {
    const { faqItem, combinedTokens } = doc;

    switch (intent) {
      case 'refund_timing':
      case 'refund_status':
        return (
          faqItem.category === 'Refunds' ||
          combinedTokens.has('refund') ||
          faqItem.answer.toLowerCase().includes('refund')
        );
      case 'product_exchange':
        return (
          faqItem.category === 'Returns & Exchanges' ||
          combinedTokens.has('exchange') ||
          combinedTokens.has('replace') ||
          combinedTokens.has('damage')
        );
      case 'return_eligibility':
        return faqItem.category === 'Returns & Exchanges';
      case 'order_tracking':
        return (
          faqItem.category === 'Orders & Order Tracking' ||
          faqItem.category === 'Shipping & Delivery'
        );
      case 'order_cancellation':
        return (
          faqItem.category === 'Cancellations' ||
          combinedTokens.has('cancel')
        );
      case 'order_modification':
        return (
          faqItem.category === 'Cancellations' ||
          faqItem.category === 'Account & Registration' ||
          combinedTokens.has('address')
        );
      case 'payment_issue':
        return (
          faqItem.category === 'Payments & Payment Failures' ||
          combinedTokens.has('pay')
        );
      case 'discounts_coupons':
        return (
          faqItem.category === 'Discounts & Coupons' ||
          combinedTokens.has('promo')
        );
      case 'password_recovery':
        return (
          faqItem.category === 'Login & Password Recovery' ||
          combinedTokens.has('password')
        );
      case 'damaged_or_missing_item':
        return (
          faqItem.category === 'Orders & Order Tracking' ||
          faqItem.category === 'Returns & Exchanges' ||
          combinedTokens.has('damage') ||
          combinedTokens.has('miss')
        );
      case 'general':
      default:
        return true;
    }
  }

  private computeRankingScore(
    doc: IndexedFaqDocument,
    rawScore: number,
    intent: QueryIntent,
    queryTokenSet: Set<string>
  ): number {
    if (rawScore < WEAK_SUGGESTION_THRESHOLD) return rawScore;
    const { faqItem, combinedTokens } = doc;

    if (intent === 'refund_timing') {
      if (faqItem.category === 'Refunds') {
        const isTimingFaq =
          (combinedTokens.has('long') ||
            combinedTokens.has('time') ||
            combinedTokens.has('take') ||
            combinedTokens.has('day')) &&
          !combinedTokens.has('method') &&
          !combinedTokens.has('delay') &&
          !combinedTokens.has('miss');
        return isTimingFaq ? rawScore * 1.45 : rawScore * 0.85;
      }
      return rawScore * 0.7;
    }

    if (intent === 'refund_status') {
      if (faqItem.category === 'Refunds') {
        const isStatusFaq =
          combinedTokens.has('status') ||
          combinedTokens.has('track') ||
          combinedTokens.has('delay') ||
          combinedTokens.has('miss') ||
          combinedTokens.has('deliver');
        return isStatusFaq ? rawScore * 1.3 : rawScore * 1.05;
      }
      return rawScore * 0.7;
    }

    if (intent === 'product_exchange' && faqItem.category === 'Returns & Exchanges') {
      return combinedTokens.has('exchange') ? rawScore * 1.25 : rawScore * 1.05;
    }

    if (
      intent === 'return_eligibility' &&
      faqItem.category === 'Returns & Exchanges'
    ) {
      return rawScore * 1.15;
    }

    if (
      intent === 'order_tracking' &&
      (faqItem.category === 'Orders & Order Tracking' ||
        faqItem.category === 'Shipping & Delivery')
    ) {
      return rawScore * 1.15;
    }

    if (intent === 'order_cancellation' && faqItem.category === 'Cancellations') {
      return rawScore * 1.2;
    }

    if (intent === 'order_modification') {
      const isAddressBookQuery =
        queryTokenSet.has('save') ||
        queryTokenSet.has('book') ||
        queryTokenSet.has('remove');
      if (isAddressBookQuery) {
        return faqItem.category === 'Account & Registration'
          ? rawScore * 1.25
          : rawScore * 0.95;
      }
      return combinedTokens.has('place') ||
        combinedTokens.has('order') ||
        combinedTokens.has('checkout')
        ? rawScore * 1.25
        : rawScore * 0.95;
    }

    if (
      intent === 'payment_issue' &&
      faqItem.category === 'Payments & Payment Failures'
    ) {
      return rawScore * 1.2;
    }

    if (
      intent === 'discounts_coupons' &&
      faqItem.category === 'Discounts & Coupons'
    ) {
      return rawScore * 1.2;
    }

    if (intent === 'password_recovery') {
      if (faqItem.category === 'Login & Password Recovery') {
        const isExpiredLinkQuery =
          queryTokenSet.has('expire') || queryTokenSet.has('invalid');
        if (isExpiredLinkQuery) {
          return combinedTokens.has('expire') || combinedTokens.has('invalid')
            ? rawScore * 1.3
            : rawScore * 1.05;
        }
        return combinedTokens.has('forgot') ? rawScore * 1.3 : rawScore * 1.1;
      }
      return rawScore * 0.7;
    }

    if (intent === 'damaged_or_missing_item') {
      const isWarrantyQuery =
        queryTokenSet.has('warranty') ||
        queryTokenSet.has('30') ||
        queryTokenSet.has('window') ||
        queryTokenSet.has('period');
      if (isWarrantyQuery) {
        return combinedTokens.has('warranty') || combinedTokens.has('30')
          ? rawScore * 1.35
          : rawScore * 0.9;
      }
      if (combinedTokens.has('damage') && combinedTokens.has('miss')) {
        return rawScore * 1.35;
      }
      if (
        faqItem.category === 'Orders & Order Tracking' &&
        (combinedTokens.has('damage') || combinedTokens.has('miss'))
      ) {
        return rawScore * 1.2;
      }
      return rawScore * 0.85;
    }

    return rawScore;
  }

  public findBestMatch(
    userQuery: string,
    similarityThreshold: number = DEFAULT_SIMILARITY_THRESHOLD
  ): MatchResult {
    const rawQueryTokens = preprocessText(userQuery);
    const resolvedTokens: Array<{ term: string; weight: number }> = [];
    let oovCount = 0;

    for (const tok of rawQueryTokens) {
      const resolved = this.resolveQueryToken(tok);
      if (resolved) {
        resolvedTokens.push(resolved);
      } else {
        oovCount += 1;
      }
    }

    const intent = detectQueryIntent(
      userQuery,
      resolvedTokens.map((t) => t.term)
    );

    const totalLen = Math.max(rawQueryTokens.length, 1);
    const queryVector = this.computeTfIdfVector(resolvedTokens, totalLen);

    const oovIdf = Math.log(this.indexedDocs.length + 1) + 1;
    const oovWeightPerToken = (1 / totalLen) * oovIdf;
    let queryNormSq = 0;
    for (const w of queryVector.values()) {
      queryNormSq += w * w;
    }
    queryNormSq += oovCount * oovWeightPerToken * oovWeightPerToken;
    const queryNorm = Math.sqrt(queryNormSq);

    const vocabCoverage =
      rawQueryTokens.length > 0
        ? resolvedTokens.length / rawQueryTokens.length
        : 0;
    const hasLowVocabularyCoverage = oovCount >= 2 && vocabCoverage <= 0.5;

    const candidates: Array<{
      item: FaqItem;
      score: number;
      rankingScore: number;
    }> = [];

    const queryTokenSet = new Set(resolvedTokens.map((t) => t.term));

    for (const doc of this.indexedDocs) {
      if (!this.isIntentCompatible(doc, intent)) continue;

      const combinedScore = this.cosineSimilarity(
        queryVector,
        queryNorm,
        doc.combinedVector,
        doc.combinedNorm
      );

      let bestPhrasingScore = 0;
      for (const pv of doc.phrasingVectors) {
        const pScore = this.cosineSimilarity(
          queryVector,
          queryNorm,
          pv.vector,
          pv.norm
        );
        if (pScore > bestPhrasingScore) {
          bestPhrasingScore = pScore;
        }
      }

      // Score combines unified FAQ document representation and best phrasing alignment
      const score = Math.max(combinedScore, bestPhrasingScore);

      candidates.push({
        item: doc.faqItem,
        score,
        rankingScore: this.computeRankingScore(
          doc,
          score,
          intent,
          queryTokenSet
        ),
      });
    }

    const ranked = candidates.sort((a, b) => b.rankingScore - a.rankingScore);
    const top = ranked[0];
    const bestScore = top ? Math.min(1, Math.max(0, top.score)) : 0;
    const confidencePercent = Math.round(bestScore * 100);

    const sameCategorySuggestions = (startIndex: number): SuggestedFaq[] => {
      if (!top || bestScore < WEAK_SUGGESTION_THRESHOLD) return [];
      const primaryCategory = top.item.category;
      return ranked
        .slice(startIndex)
        .filter(
          (entry) =>
            entry.item.category === primaryCategory &&
            entry.score >= WEAK_SUGGESTION_THRESHOLD
        )
        .slice(0, 3)
        .map((entry) => ({
          id: entry.item.id,
          question: entry.item.question,
          category: entry.item.category,
          confidencePercent: Math.round(entry.score * 100),
        }));
    };

    if (!top || bestScore < similarityThreshold || hasLowVocabularyCoverage) {
      const fallbackSuggestions = sameCategorySuggestions(0);
      return {
        matched: false,
        intent,
        answer:
          fallbackSuggestions.length > 0
            ? FALLBACK_MESSAGE_WITH_SUGGESTIONS
            : FALLBACK_MESSAGE,
        matchedFaqId: null,
        matchedQuestion: null,
        category: null,
        similarity: bestScore,
        confidencePercent,
        suggestions: fallbackSuggestions,
      };
    }

    const suggestions =
      bestScore < WEAK_MATCH_CUTOFF ? sameCategorySuggestions(1) : [];

    return {
      matched: true,
      intent,
      answer: top.item.answer,
      matchedFaqId: top.item.id,
      matchedQuestion: top.item.question,
      category: top.item.category,
      similarity: bestScore,
      confidencePercent,
      suggestions,
    };
  }
}

export function createFaqEngine(faqs: FaqItem[]): TfidfFaqEngine {
  return new TfidfFaqEngine(faqs);
}
