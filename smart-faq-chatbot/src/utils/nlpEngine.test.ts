import assert from 'node:assert/strict';
import { defaultFaqData } from '../data/faqData';
import { createFaqEngine } from './nlpEngine';

const engine = createFaqEngine(defaultFaqData);

interface TestCase {
  query: string;
  expectMatched: boolean;
  expectedFaqIds?: string[];
  expectedCategory?: string;
  expectedCategories?: string[];
  disallowedFaqIds?: string[];
  description: string;
}

const TEST_CASES: TestCase[] = [
  {
    description: 'Exact test 1: Returned product money back',
    query: 'I returned my product. When will I get my money back?',
    expectMatched: true,
    expectedFaqIds: ['faq-23'],
    expectedCategory: 'Refunds',
    disallowedFaqIds: ['faq-32'],
  },
  {
    description: 'Exact test 2: How long does my refund take',
    query: 'How long does my refund take?',
    expectMatched: true,
    expectedFaqIds: ['faq-23'],
    expectedCategory: 'Refunds',
    disallowedFaqIds: ['faq-32'],
  },
  {
    description: 'Exact test 3: When will the amount be credited',
    query: 'When will the amount be credited?',
    expectMatched: true,
    expectedFaqIds: ['faq-23'],
    expectedCategory: 'Refunds',
    disallowedFaqIds: ['faq-32'],
  },
  {
    description: 'Exact test 4: My refund has not arrived',
    query: 'My refund has not arrived.',
    expectMatched: true,
    expectedFaqIds: ['faq-24', 'faq-27'],
    expectedCategory: 'Refunds',
  },
  {
    description: 'Exact test 5: Which items cannot be returned',
    query: 'Which items cannot be returned?',
    expectMatched: true,
    expectedFaqIds: ['faq-32'],
    expectedCategory: 'Returns & Exchanges',
  },
  {
    description: 'Exact test 6: Can I exchange a damaged product',
    query: 'Can I exchange a damaged product?',
    expectMatched: true,
    expectedFaqIds: ['faq-30'],
    expectedCategory: 'Returns & Exchanges',
  },
  {
    description: 'Exact test 7: Where is my parcel? It hasnt arrived yet.',
    query: "Where is my parcel? It hasn't arrived yet.",
    expectMatched: true,
    expectedFaqIds: ['faq-11', 'faq-14'],
    expectedCategories: ['Orders & Order Tracking', 'Shipping & Delivery'],
  },
  {
    description: 'Password recovery test 1: Cannot remember password / access account again',
    query: 'I cannot remember my password. How can I access my account again?',
    expectMatched: true,
    expectedFaqIds: ['faq-6'],
    expectedCategory: 'Login & Password Recovery',
  },
  {
    description: 'Password recovery test 2: Recover forgotten password',
    query: 'How do I recover my forgotten password?',
    expectMatched: true,
    expectedFaqIds: ['faq-6'],
    expectedCategory: 'Login & Password Recovery',
  },
  {
    description: 'Password recovery test 3: Reset lost password',
    query: 'I lost my password. How can I reset it?',
    expectMatched: true,
    expectedFaqIds: ['faq-6'],
    expectedCategory: 'Login & Password Recovery',
  },
  {
    description: 'Password recovery test 4: Expired reset link still matches faq-59',
    query: 'My password reset link expired.',
    expectMatched: true,
    expectedFaqIds: ['faq-59'],
    expectedCategory: 'Login & Password Recovery',
  },
  {
    description: 'Damaged item test 1: Damaged product return/replacement',
    query: 'I received a damaged product. Can I return it and get a replacement?',
    expectMatched: true,
    expectedFaqIds: ['faq-15'],
    expectedCategory: 'Orders & Order Tracking',
  },
  {
    description: 'Damaged item test 2: Product arrived broken / replacement',
    query: 'My product arrived broken. How can I get a replacement?',
    expectMatched: true,
    expectedFaqIds: ['faq-15'],
    expectedCategory: 'Orders & Order Tracking',
  },
  {
    description: 'Damaged item test 3: Defective item received',
    query: 'The item I received is defective. What should I do?',
    expectMatched: true,
    expectedFaqIds: ['faq-15'],
    expectedCategory: 'Orders & Order Tracking',
  },
  {
    description: 'Damaged item test 4: Damaged item want a refund',
    query: 'I received a damaged item and want a refund.',
    expectMatched: true,
    expectedFaqIds: ['faq-15'],
    expectedCategory: 'Orders & Order Tracking',
  },
  {
    description: 'Damaged item test 5: Paraphrased broken/missing item query',
    query: 'My order came cracked and something is missing from the box.',
    expectMatched: true,
    expectedFaqIds: ['faq-15'],
    expectedCategory: 'Orders & Order Tracking',
  },
  {
    description: 'Warranty test: Defective after 30-day return window still matches faq-69',
    query: 'What if my product becomes defective after the 30-day return window?',
    expectMatched: true,
    expectedFaqIds: ['faq-69'],
    expectedCategory: 'Returns & Exchanges',
  },
  {
    description: 'Order tracking: Delayed delivery phrasing',
    query: 'My parcel is late and stuck in transit.',
    expectMatched: true,
    expectedFaqIds: ['faq-44'],
    expectedCategory: 'Shipping & Delivery',
  },
  {
    description: 'Order cancellation 1: Cancel before shipping',
    query: 'I want to cancel my order before it ships.',
    expectMatched: true,
    expectedFaqIds: ['faq-34'],
    expectedCategory: 'Cancellations',
  },
  {
    description: 'Order cancellation 2: Cancel after shipping',
    query: 'Can I stop delivery on an order that already shipped?',
    expectMatched: true,
    expectedFaqIds: ['faq-35'],
    expectedCategory: 'Cancellations',
  },
  {
    description: 'Order modification 1: Wrong shipping address on placed order',
    query: 'I need to change my delivery address on the order I just placed.',
    expectMatched: true,
    expectedFaqIds: ['faq-38'],
    expectedCategory: 'Cancellations',
  },
  {
    description: 'Order modification 2: Change order items',
    query: 'Can I change the items in my order after checkout?',
    expectMatched: true,
    expectedFaqIds: ['faq-38'],
    expectedCategory: 'Cancellations',
  },
  {
    description: 'Payment problem 1: Card declined',
    query: 'My credit card payment failed at checkout.',
    expectMatched: true,
    expectedFaqIds: ['faq-18'],
    expectedCategory: 'Payments & Payment Failures',
  },
  {
    description: 'Payment problem 2: Money deducted on failed order',
    query: 'Why was money deducted even though my order failed?',
    expectMatched: true,
    expectedFaqIds: ['faq-21'],
    expectedCategory: 'Payments & Payment Failures',
  },
  {
    description: 'Payment problem 3: Charged twice',
    query: 'I was charged twice for the same order.',
    expectMatched: true,
    expectedFaqIds: ['faq-19'],
    expectedCategory: 'Payments & Payment Failures',
  },
  {
    description: 'Discounts & coupons 1: Coupon not working',
    query: 'Why is my discount code not working at checkout?',
    expectMatched: true,
    expectedFaqIds: ['faq-46'],
    expectedCategory: 'Discounts & Coupons',
  },
  {
    description: 'Discounts & coupons 2: Forgot promo code after order',
    query: 'I forgot to apply my promo code after placing the order.',
    expectMatched: true,
    expectedFaqIds: ['faq-48'],
    expectedCategory: 'Discounts & Coupons',
  },
  {
    description: 'Login 2FA / locked account check',
    query: 'Why is my account locked when I try to sign in?',
    expectMatched: true,
    expectedFaqIds: ['faq-7'],
    expectedCategory: 'Login & Password Recovery',
  },
  {
    description: 'Spelling mistake resilience: misspelled password & refund',
    query: 'I forgot my passwrod, how do I reset it?',
    expectMatched: true,
    expectedFaqIds: ['faq-6'],
    expectedCategory: 'Login & Password Recovery',
  },
  {
    description: 'Spelling mistake resilience: misspelled recieved & damged',
    query: 'I recieved a damged product and want a replacement.',
    expectMatched: true,
    expectedFaqIds: ['faq-15'],
    expectedCategory: 'Orders & Order Tracking',
  },
  {
    description: 'Unrelated fallback check: Tell me a joke',
    query: 'Tell me a joke.',
    expectMatched: false,
  },
  {
    description: 'Unrelated fallback check: Weather forecast',
    query: 'What is the weather forecast for tomorrow in Paris?',
    expectMatched: false,
  },
  {
    description: 'Unrelated OOV fallback check: Cryptocurrency Martian deliveries',
    query: 'Do you refund cryptocurrency for Martian deliveries?',
    expectMatched: false,
  },
];

console.log('=== Smart FAQ Matching Test Report ===\n');

let allPassed = true;
for (const tc of TEST_CASES) {
  const result = engine.findBestMatch(tc.query);
  const categoryOk = tc.expectedCategory
    ? result.category === tc.expectedCategory
    : tc.expectedCategories
      ? Boolean(result.category && tc.expectedCategories.includes(result.category))
      : true;
  const faqIdOk = tc.expectedFaqIds
    ? Boolean(result.matchedFaqId && tc.expectedFaqIds.includes(result.matchedFaqId))
    : true;
  const disallowedOk =
    !tc.disallowedFaqIds ||
    !result.matchedFaqId ||
    !tc.disallowedFaqIds.includes(result.matchedFaqId);
  const isCorrect =
    result.matched === tc.expectMatched && categoryOk && faqIdOk && disallowedOk;

  if (!isCorrect) allPassed = false;

  console.log(
    `Query: "${tc.query}"\n  Selected FAQ: ${result.matchedQuestion ?? 'Fallback (No match)'}\n  Category: ${result.category ?? 'None'} | Intent: ${result.intent} | Correct: ${isCorrect ? 'PASS' : 'FAIL'}\n`
  );

  assert.equal(isCorrect, true, `Test failed for "${tc.query}"`);
}

// Verify dynamic re-indexing when an FAQ is added, edited, or deleted
const customAdded = createFaqEngine([
  ...defaultFaqData,
  {
    id: 'faq-temp',
    category: 'Customer Support',
    question: 'Do you support weekend curbside pickup?',
    alternatives: ['Saturday store pickup'],
    answer: 'Yes, curbside pickup is available Saturday 9 AM to 6 PM.',
  },
]);
const addedMatch = customAdded.findBestMatch('Saturday store pickup');
assert.equal(addedMatch.matched, true);
assert.equal(addedMatch.matchedFaqId, 'faq-temp');

const customEdited = createFaqEngine(
  defaultFaqData.map((f) =>
    f.id === 'faq-1'
      ? { ...f, alternatives: [...f.alternatives, 'Onboard new shopper profile'] }
      : f
  )
);
const editedMatch = customEdited.findBestMatch('Onboard new shopper profile');
assert.equal(editedMatch.matched, true);
assert.equal(editedMatch.matchedFaqId, 'faq-1');

const customDeleted = createFaqEngine(
  defaultFaqData.filter((f) => f.id !== 'faq-temp')
);
const deletedMatch = customDeleted.findBestMatch('Saturday store pickup');
assert.notEqual(deletedMatch.matchedFaqId, 'faq-temp');

console.log(
  `Dynamic Re-indexing Check (add/edit/delete): "${addedMatch.matchedQuestion}" -> PASS`
);
assert.equal(allPassed, true);
console.log(`\nAll ${TEST_CASES.length} test queries and dynamic re-indexing checks passed!`);
