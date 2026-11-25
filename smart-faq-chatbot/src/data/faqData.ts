export type FaqCategory =
  | 'Account & Registration'
  | 'Login & Password Recovery'
  | 'Orders & Order Tracking'
  | 'Payments & Payment Failures'
  | 'Refunds'
  | 'Returns & Exchanges'
  | 'Cancellations'
  | 'Shipping & Delivery'
  | 'Discounts & Coupons'
  | 'Customer Support';

export interface FaqItem {
  id: string;
  category: FaqCategory;
  question: string;
  alternatives: string[];
  answer: string;
}

export const FAQ_CATEGORIES: FaqCategory[] = [
  'Account & Registration',
  'Login & Password Recovery',
  'Orders & Order Tracking',
  'Payments & Payment Failures',
  'Refunds',
  'Returns & Exchanges',
  'Cancellations',
  'Shipping & Delivery',
  'Discounts & Coupons',
  'Customer Support',
];

/**
 * Editable Customer Support FAQ Knowledge Base (55 Q&A pairs across 10 categories).
 * Includes alternative phrasings so TF-IDF cosine similarity matches natural variations.
 */
export const defaultFaqData: FaqItem[] = [
  // 1. Account & Registration (5)
  {
    id: 'faq-1',
    category: 'Account & Registration',
    question: 'How do I create a new customer account?',
    alternatives: [
      'How to register or sign up on ShopEase',
      'Create new shopping account',
      'Where can I sign up as a new user',
    ],
    answer:
      'Click "Sign Up" at the top-right corner of the storefront, enter your full name, email address, and password, and verify your email using the confirmation link sent to your inbox.',
  },
  {
    id: 'faq-2',
    category: 'Account & Registration',
    question: 'Do I need an account to place an order?',
    alternatives: [
      'Can I buy as a guest without registering',
      'Is guest checkout available',
      'Shop without creating an account',
    ],
    answer:
      'No, guest checkout is supported for most items. However, creating a free account lets you track orders easily, save delivery addresses, and manage returns from one dashboard.',
  },
  {
    id: 'faq-3',
    category: 'Account & Registration',
    question: 'How do I update my email address or phone number?',
    alternatives: [
      'Change registered email or mobile number',
      'Edit my profile details and contact information',
      'Update account phone number',
    ],
    answer:
      'Sign in, go to Account Settings > Personal Information, and edit your email or phone number. You will be asked to enter your password or a one-time verification code to save changes.',
  },
  {
    id: 'faq-4',
    category: 'Account & Registration',
    question: 'How can I save or edit my shipping addresses?',
    alternatives: [
      'Add a new delivery address to my account',
      'Manage saved addresses in address book',
      'Remove old home or office address',
    ],
    answer:
      'Open My Account > Address Book to add a new address, edit an existing one, or set a default shipping and billing address for faster checkout.',
  },
  {
    id: 'faq-5',
    category: 'Account & Registration',
    question: 'How do I permanently delete or deactivate my account?',
    alternatives: [
      'Close my ShopEase account',
      'Delete my personal account and data',
      'Deactivate customer profile',
    ],
    answer:
      'Go to Account Settings > Privacy & Data and choose "Request Account Deletion". Ensure all active orders and pending refunds are settled before submitting the request.',
  },

  // 2. Login & Password Recovery (5)
  {
    id: 'faq-6',
    category: 'Login & Password Recovery',
    question: 'I forgot my password. How do I reset it?',
    alternatives: [
      'Reset forgotten password',
      'Recover my account password',
      'Password reset link not working',
      'I cannot remember my password',
      'How can I access my account if I forgot my password',
      'Lost password need to get back into my account',
    ],
    answer:
      'Click "Forgot Password" on the Login screen and enter your registered email address. We will send a secure password reset link valid for 30 minutes.',
  },
  {
    id: 'faq-7',
    category: 'Login & Password Recovery',
    question: 'Why is my account locked or unable to log in?',
    alternatives: [
      'Cannot sign in to my account',
      'Account temporarily locked after failed attempts',
      'Login error or blocked account',
    ],
    answer:
      'For security, accounts lock for 15 minutes after five consecutive incorrect password attempts. Wait 15 minutes before retrying, or reset your password immediately.',
  },
  {
    id: 'faq-8',
    category: 'Login & Password Recovery',
    question: 'I am not receiving the OTP or verification email to log in.',
    alternatives: [
      'Verification code email did not arrive',
      'OTP SMS not received during sign in',
      'Did not get login confirmation code',
    ],
    answer:
      'Check your spam or promotions folder for the verification email, and ensure your phone has network signal for SMS codes. Wait 60 seconds and click "Resend Code".',
  },
  {
    id: 'faq-9',
    category: 'Login & Password Recovery',
    question: 'How do I enable two-factor authentication (2FA)?',
    alternatives: [
      'Turn on 2FA for extra login security',
      'Set up authenticator app or SMS two-step verification',
      'Protect my account with two-factor authentication',
    ],
    answer:
      'Navigate to Account Settings > Security and enable Two-Factor Authentication. You can link an authenticator app or verify logins via SMS.',
  },
  {
    id: 'faq-10',
    category: 'Login & Password Recovery',
    question: 'Can I sign in using Google or Apple single sign-on?',
    alternatives: [
      'Log in with Google account',
      'Social login options available',
      'Use Apple ID to sign in',
    ],
    answer:
      'Yes, you can sign in using "Continue with Google" or "Continue with Apple" on the login page. If your email matches an existing account, both login methods link automatically.',
  },

  // 3. Orders & Order Tracking (6)
  {
    id: 'faq-11',
    category: 'Orders & Order Tracking',
    question: 'How can I track my order and check shipment status?',
    alternatives: [
      'Where is my order right now',
      'Where is my package or parcel',
      'How can I track my purchase',
      'Check live package tracking status',
      'Track my parcel delivery progress',
    ],
    answer:
      'Open "My Orders" in your account, select the order, and click "Track Package" to view live carrier milestones and the estimated delivery date.',
  },
  {
    id: 'faq-12',
    category: 'Orders & Order Tracking',
    question: 'How do I track a guest order without logging in?',
    alternatives: [
      'Track order using order ID without account',
      'Check guest checkout order status',
      'Find my order without signing in',
    ],
    answer:
      'Use the "Track Order" link in your confirmation email or footer, then enter your Order ID and the email address used at checkout.',
  },
  {
    id: 'faq-13',
    category: 'Orders & Order Tracking',
    question: 'Where can I find my order number or download an invoice?',
    alternatives: [
      'Get PDF receipt or tax invoice for my order',
      'Lost my order confirmation number',
      'Download billing invoice',
    ],
    answer:
      'Your order number is in your confirmation email and under "My Orders". Click "View Details" on any order to download a PDF invoice.',
  },
  {
    id: 'faq-14',
    category: 'Orders & Order Tracking',
    question: 'Why does tracking say delivered when I did not receive my package?',
    alternatives: [
      'Order marked delivered but package is missing',
      'My order has not arrived or been received yet',
      'I have not received my package or parcel',
      'My order was supposed to arrive but I have not received it',
      'Did not receive parcel marked as delivered',
    ],
    answer:
      'Check porches, mailrooms, reception desks, and neighbors first, as carriers occasionally scan parcels early. If it has not appeared within 24 hours, contact Support for an investigation.',
  },
  {
    id: 'faq-15',
    category: 'Orders & Order Tracking',
    question: 'What should I do if an item is missing or damaged in my order?',
    alternatives: [
      'Received broken or damaged product',
      'Part of my order is missing from the box',
      'Wrong item delivered in my package',
      'I received a damaged product. Can I return it and get a replacement?',
      'My product arrived broken. How can I get a replacement?',
      'The item I received is defective. What should I do?',
      'I received a damaged item and want a refund.',
    ],
    answer:
      'Go to "My Orders" within 48 hours of delivery, select the order, and click "Report Missing or Damaged Item". Attach a photo so we can send a replacement or refund promptly.',
  },
  {
    id: 'faq-16',
    category: 'Orders & Order Tracking',
    question: 'Why did I not receive an order confirmation email?',
    alternatives: [
      'Order placed but no confirmation email received',
      'Check if my order went through',
      'Missing purchase confirmation email',
    ],
    answer:
      'Confirmation emails usually arrive within 5 minutes. Check your spam folder and verify the order appears in "My Orders". If it is missing, contact Customer Support with your payment timestamp.',
  },

  // 4. Payments & Payment Failures (6)
  {
    id: 'faq-17',
    category: 'Payments & Payment Failures',
    question: 'What payment methods are accepted at checkout?',
    alternatives: [
      'Can I pay with PayPal, Apple Pay, or credit card',
      'Accepted debit cards and digital wallets',
      'Do you offer Cash on Delivery',
    ],
    answer:
      'We accept Visa, Mastercard, American Express, PayPal, Apple Pay, Google Pay, ShopEase Gift Cards, and Cash on Delivery for eligible domestic orders.',
  },
  {
    id: 'faq-18',
    category: 'Payments & Payment Failures',
    question: 'Why did my payment fail or get declined at checkout?',
    alternatives: [
      'Credit card declined during payment',
      'Transaction failed at checkout',
      'Unable to complete payment',
      'My payment is not going through',
      'Card payment error at checkout',
    ],
    answer:
      'Payments fail most commonly due to mistyped card details, expired cards, insufficient funds, or bank fraud filters. Verify your billing address and card info, or try another payment method.',
  },
  {
    id: 'faq-19',
    category: 'Payments & Payment Failures',
    question: 'I was charged twice for the same order. What should I do?',
    alternatives: [
      'Duplicate charge on my bank statement',
      'Paid twice for one order',
      'Double deduction after failed payment',
    ],
    answer:
      'Duplicate entries are usually temporary authorization holds that clear automatically within 3 to 5 business days. If two settled charges remain, share your Order ID and statement reference with Support.',
  },
  {
    id: 'faq-20',
    category: 'Payments & Payment Failures',
    question: 'Is my credit card and payment information stored securely?',
    alternatives: [
      'Are online payments safe on ShopEase',
      'Card data encryption and PCI security',
      'How do you protect payment details',
    ],
    answer:
      'Yes. All transactions are encrypted via TLS and processed through PCI-DSS Level 1 certified payment gateways. We never store your full card number or CVV on our servers.',
  },
  {
    id: 'faq-21',
    category: 'Payments & Payment Failures',
    question: 'Why was money deducted even though my order failed?',
    alternatives: [
      'Amount debited for unsuccessful order',
      'Payment charged but order not confirmed',
      'Pending bank hold after failed checkout',
    ],
    answer:
      'When an order fails after authorization, banks automatically reverse the hold within 3 to 7 business days. If the funds are not returned after 7 days, contact Support with your transaction ID.',
  },
  {
    id: 'faq-22',
    category: 'Payments & Payment Failures',
    question: 'Do you support EMI or buy-now-pay-later installments?',
    alternatives: [
      'Can I pay in monthly installments',
      'Split payment or Klarna / Afterpay options',
      'Interest-free payment plans',
    ],
    answer:
      'Yes, orders over $100 qualify for 4 interest-free biweekly installments or monthly EMI plans through supported partners shown on the checkout payment screen.',
  },

  // 5. Refunds (5)
  {
    id: 'faq-23',
    category: 'Refunds',
    question: 'How long does it take to receive my refund?',
    alternatives: [
      'How do I get my refund',
      'When will I get my money back',
      'How long does my refund take',
      'I returned my item. When will the amount be credited',
      'When will the money come back to my account',
      'How many days does a refund take',
      'Refund processing time',
      'When will my money be returned to my bank account',
      'How many days for refund credit',
    ],
    answer:
      'Refunds are initiated within 2 business days after your cancellation or returned item inspection. Card issuers and banks typically post the funds within 5 to 7 business days.',
  },
  {
    id: 'faq-24',
    category: 'Refunds',
    question: 'How can I check the status of my refund?',
    alternatives: [
      'Track my pending refund',
      'Where is my refund',
      'My returned product has been received. Where is my refund',
      'Check if refund has been issued',
    ],
    answer:
      'Open "My Orders", select the cancelled or returned order, and click "Refund Status" to view real-time progress from initiation to bank settlement.',
  },
  {
    id: 'faq-25',
    category: 'Refunds',
    question: 'Will my refund go back to my original payment method?',
    alternatives: [
      'Can I get refund to a different card or store credit',
      'How are refunds issued for Cash on Delivery',
      'Where is my refund credited',
    ],
    answer:
      'Refunds return automatically to your original payment method. For Cash on Delivery orders, you can choose instant ShopEase Store Credit or provide bank details for a direct transfer.',
  },
  {
    id: 'faq-26',
    category: 'Refunds',
    question: 'Are shipping charges included in my refund?',
    alternatives: [
      'Will delivery fee be refunded',
      'Do I get shipping cost back on return',
      'Why was my refund less than the total paid',
    ],
    answer:
      'Original shipping charges are refunded in full if the order was cancelled before dispatch or if you received a damaged, defective, or wrong item. Otherwise, original express fees are non-refundable.',
  },
  {
    id: 'faq-27',
    category: 'Refunds',
    question: 'What if my refund has not arrived after 7 business days?',
    alternatives: [
      'My refund has not arrived',
      'Refund not received yet',
      'Delayed refund not showing in bank account',
      'Refund completed on site but missing in card',
      'Overdue refund help',
    ],
    answer:
      'First check with your bank using the ARN (Acquirer Reference Number) shown in your Refund Status page. If your bank cannot locate it, contact Support so we can trace the transfer.',
  },

  // 6. Returns & Exchanges (6)
  {
    id: 'faq-28',
    category: 'Returns & Exchanges',
    question: 'What is your return policy and how many days do I have?',
    alternatives: [
      'What is your return policy',
      'Return window duration and rules',
      'How long after delivery can I return an item',
      'Eligibility for product returns',
    ],
    answer:
      'We offer a 30-day return window from the delivery date. Returned items must be unused, unwashed, and in original packaging with all tags and accessories.',
  },
  {
    id: 'faq-29',
    category: 'Returns & Exchanges',
    question: 'How do I start or request a product return?',
    alternatives: [
      'Steps to return an item',
      'Initiate a return request online',
      'How to get a return shipping label',
    ],
    answer:
      'Go to "My Orders", select the item, and click "Return or Replace". Choose your reason, pick home pickup or drop-off, and download your prepaid return label.',
  },
  {
    id: 'faq-30',
    category: 'Returns & Exchanges',
    question: 'Can I exchange an item for a different size or color?',
    alternatives: [
      'Can I exchange a damaged or defective product',
      'Swap product for another size',
      'Replace item with different color or variant',
      'Size exchange policy',
    ],
    answer:
      'Yes. Select "Exchange Item" in "My Orders" within 30 days of delivery and pick your preferred size or color. The replacement ships as soon as your original parcel is scanned.',
  },
  {
    id: 'faq-31',
    category: 'Returns & Exchanges',
    question: 'Is return shipping free or is there a return fee?',
    alternatives: [
      'Do I have to pay for return shipping',
      'Cost of returning an order',
      'Free returns policy',
    ],
    answer:
      'Return shipping is completely free for damaged, defective, or wrong items and for size exchanges. Standard preference returns carry a flat $4.99 label fee deducted from the refund.',
  },
  {
    id: 'faq-32',
    category: 'Returns & Exchanges',
    question: 'Which items are non-returnable or excluded from returns?',
    alternatives: [
      'Which items cannot be returned',
      'Products that cannot be returned',
      'Non-refundable categories list',
      'Can I return opened cosmetics or gift cards',
    ],
    answer:
      'Digital gift cards, perishable goods, personalized custom items, and opened personal care or hygiene products cannot be returned unless they arrive defective or damaged.',
  },
  {
    id: 'faq-33',
    category: 'Returns & Exchanges',
    question: 'Can I return an item without the original box or tags?',
    alternatives: [
      'Lost original packaging before return',
      'Return product without tags',
      'Missing box for return item',
    ],
    answer:
      'Original tags and manufacturer packaging are required for standard returns. If the item is defective, contact Support before returning so we can approve an exception.',
  },

  // 7. Cancellations (5)
  {
    id: 'faq-34',
    category: 'Cancellations',
    question: 'How do I cancel an order before it ships?',
    alternatives: [
      'Cancel my recent order',
      'Stop order before dispatch',
      'How to cancel purchase online',
      'I want to cancel my order',
      'How can I cancel an order I just placed',
    ],
    answer:
      'Visit "My Orders", select the order you want to cancel, and click "Cancel Order". Orders can be cancelled immediately anytime before they enter the shipping stage.',
  },
  {
    id: 'faq-35',
    category: 'Cancellations',
    question: 'Can I cancel an order after it has already been shipped?',
    alternatives: [
      'Stop delivery for shipped package',
      'Cancel order in transit',
      'Cancel button is disabled because order shipped',
    ],
    answer:
      'Once an order has shipped, it can no longer be cancelled directly. You can refuse the delivery at the door or initiate a return through "My Orders" after it arrives.',
  },
  {
    id: 'faq-36',
    category: 'Cancellations',
    question: 'Can I cancel just one item from a multi-item order?',
    alternatives: [
      'Partial order cancellation',
      'Remove a single product from my order',
      'Cancel part of an order',
    ],
    answer:
      'Yes, as long as that specific item has not yet been packed. Select the order in "My Orders", choose "Cancel Items", and check only the item you want to remove.',
  },
  {
    id: 'faq-37',
    category: 'Cancellations',
    question: 'Why was my order cancelled automatically by ShopEase?',
    alternatives: [
      'Order cancelled without my permission',
      'System cancelled my order',
      'Why did my order get cancelled',
    ],
    answer:
      'Automatic cancellations occur when payment verification fails, stock runs out before packing, or the delivery address cannot be verified. Any captured payment is automatically refunded.',
  },
  {
    id: 'faq-38',
    category: 'Cancellations',
    question: 'Can I change my delivery address or items after placing an order?',
    alternatives: [
      'Modify shipping address on placed order',
      'Edit order details after checkout',
      'Update address before shipment',
      'I entered the wrong shipping address on my order',
      'Can I change the items in my order',
    ],
    answer:
      'You can update the shipping address within 1 hour of ordering from "My Orders" if packing has not started. To change product variants or quantities, please cancel and reorder.',
  },

  // 8. Shipping & Delivery (6)
  {
    id: 'faq-39',
    category: 'Shipping & Delivery',
    question: 'How long does standard and express shipping take?',
    alternatives: [
      'Estimated delivery time for orders',
      'How fast is express delivery',
      'Standard shipping transit days',
    ],
    answer:
      'Standard shipping delivers in 3 to 5 business days, while Express shipping arrives within 1 to 2 business days after dispatch.',
  },
  {
    id: 'faq-40',
    category: 'Shipping & Delivery',
    question: 'How much does shipping cost and is free shipping available?',
    alternatives: [
      'Delivery charges and free shipping threshold',
      'Shipping fees for orders',
      'Minimum order value for free delivery',
    ],
    answer:
      'Standard shipping is free on orders over $50. Orders under $50 carry a flat $5.99 fee, and Express shipping is available for $12.99.',
  },
  {
    id: 'faq-41',
    category: 'Shipping & Delivery',
    question: 'Do you offer international shipping outside the country?',
    alternatives: [
      'Ship to other countries worldwide',
      'International delivery availability and duties',
      'Global shipping rates',
    ],
    answer:
      'Yes, we ship to over 40 countries worldwide. International orders take 7 to 14 business days, with estimated customs duties calculated transparently at checkout.',
  },
  {
    id: 'faq-42',
    category: 'Shipping & Delivery',
    question: 'What happens if I miss my delivery or am not home?',
    alternatives: [
      'Missed courier delivery attempt',
      'Nobody home when package arrives',
      'Redelivery or pickup locker options',
    ],
    answer:
      'If a signature is required and no one is home, the carrier leaves a notice and retries on the next business day, or holds the parcel at a local pickup point for 5 days.',
  },
  {
    id: 'faq-43',
    category: 'Shipping & Delivery',
    question: 'Can I schedule a delivery time or add delivery instructions?',
    alternatives: [
      'Leave gate code or drop-off note for courier',
      'Choose preferred delivery window',
      'Add special delivery instructions',
    ],
    answer:
      'Yes. You can add gate codes or safe drop-off notes at checkout, or choose a preferred 2-hour delivery slot from your carrier tracking link where supported.',
  },
  {
    id: 'faq-44',
    category: 'Shipping & Delivery',
    question: 'Why is my shipment delayed or stuck in transit?',
    alternatives: [
      'Tracking has not updated for days',
      'Package delayed at carrier facility',
      'My parcel or package is late',
      'My order has not arrived on time and is delayed',
      'Late delivery help',
    ],
    answer:
      'Severe weather, peak seasonal volume, or carrier hub delays can add 1 to 2 days to transit. If tracking has not updated for 4 business days, contact Support to open a carrier trace.',
  },

  // 9. Discounts & Coupons (5)
  {
    id: 'faq-45',
    category: 'Discounts & Coupons',
    question: 'How do I apply a promo code or discount coupon?',
    alternatives: [
      'Where to enter coupon code at checkout',
      'Use voucher or promo code on my order',
      'Apply discount code',
    ],
    answer:
      'On the Checkout page, find the "Promo Code or Gift Card" box above your order summary, type your code, and click "Apply" before completing payment.',
  },
  {
    id: 'faq-46',
    category: 'Discounts & Coupons',
    question: 'Why is my coupon or promo code not working?',
    alternatives: [
      'Discount code invalid or expired',
      'Promo code rejected at checkout',
      'Coupon does not apply to my cart',
      'My discount code is not working',
    ],
    answer:
      'Promo codes may be expired, require a minimum cart subtotal, or exclude clearance and select electronics. Check the coupon terms and ensure there are no extra spaces.',
  },
  {
    id: 'faq-47',
    category: 'Discounts & Coupons',
    question: 'Can I use multiple coupons or stack discounts on one order?',
    alternatives: [
      'Combine two promo codes together',
      'Stack coupon with sale price',
      'Apply more than one discount code',
    ],
    answer:
      'Only one promotional code can be used per order. However, you can combine a single promo code with a ShopEase Gift Card or loyalty reward points.',
  },
  {
    id: 'faq-48',
    category: 'Discounts & Coupons',
    question: 'I forgot to apply my promo code after placing the order.',
    alternatives: [
      'Add coupon code after checkout',
      'Forgot discount code on recent order',
      'Apply voucher retroactively',
    ],
    answer:
      'If your order has not shipped yet, contact Customer Support within 2 hours with your Order ID and valid promo code so we can verify eligibility and adjust the difference.',
  },
  {
    id: 'faq-49',
    category: 'Discounts & Coupons',
    question: 'Do you offer student, military, or first-order discounts?',
    alternatives: [
      'New customer welcome discount code',
      'Student discount program',
      'First purchase promo offer',
    ],
    answer:
      'New subscribers receive a 10% welcome code upon signing up for our newsletter. Verified students also receive an extra 10% off eligible items through Student Verify in Account Settings.',
  },

  // 10. Customer Support (6)
  {
    id: 'faq-50',
    category: 'Customer Support',
    question: 'How can I contact customer support?',
    alternatives: [
      'Speak to a live support agent',
      'Customer service phone number and email',
      'Reach help desk for assistance',
    ],
    answer:
      'You can reach Customer Support 24/7 via Live Chat in the Help Center, by emailing support@shopease.example, or by calling our helpline at 1-800-555-0199.',
  },
  {
    id: 'faq-51',
    category: 'Customer Support',
    question: 'What are your customer support working hours?',
    alternatives: [
      'When is customer service open',
      'Support team schedule and weekend availability',
      'Phone support hours',
    ],
    answer:
      'Live Chat and email support are available 24/7. Phone support operates Monday through Saturday from 8:00 AM to 9:00 PM local time.',
  },
  {
    id: 'faq-52',
    category: 'Customer Support',
    question: 'How long does it take to get a reply to a support email or ticket?',
    alternatives: [
      'Support ticket response time',
      'When will customer service reply to my email',
      'Waiting for help desk answer',
    ],
    answer:
      'Email tickets are answered within 12 to 24 hours. For urgent order or payment issues, use Live Chat for an immediate response.',
  },
  {
    id: 'faq-53',
    category: 'Customer Support',
    question: 'How do I report a website bug or technical problem?',
    alternatives: [
      'App crashing or checkout page glitch',
      'Report technical error on site',
      'Website not loading properly',
    ],
    answer:
      'Go to Help Center > Report a Technical Issue and describe what happened along with your device, browser, and screenshots so our engineering team can resolve it.',
  },
  {
    id: 'faq-54',
    category: 'Customer Support',
    question: 'How do I submit feedback or file a complaint about a seller?',
    alternatives: [
      'Complain about poor service or seller',
      'Leave product or delivery feedback',
      'Escalate an unresolved support issue',
    ],
    answer:
      'Open "My Orders", select the order, and click "Leave Feedback" or "Report Seller Issue". All escalations are reviewed by a senior specialist within 24 hours.',
  },
  {
    id: 'faq-55',
    category: 'Customer Support',
    question: 'Do products come with a warranty and how do I claim it?',
    alternatives: [
      'Manufacturer warranty coverage on electronics',
      'Claim product repair or warranty service',
      'Warranty period details',
    ],
    answer:
      'Eligible electronics and appliances include a 1-year manufacturer warranty. Visit My Orders > Warranty Claim with your invoice and serial number to initiate service.',
  },

  // Expanded Knowledge Base (faq-56 to faq-80) — Total 80 FAQs
  {
    id: 'faq-56',
    category: 'Account & Registration',
    question: 'How do I manage or unsubscribe from promotional emails and newsletters?',
    alternatives: [
      'Stop receiving marketing emails',
      'Update email notification preferences',
      'Unsubscribe from ShopEase newsletter',
    ],
    answer:
      'Go to Account Settings > Notification Preferences to toggle promotional emails, SMS alerts, and order updates. You can also click the Unsubscribe link at the bottom of any marketing email.',
  },
  {
    id: 'faq-57',
    category: 'Account & Registration',
    question: 'Can I merge two ShopEase accounts into one?',
    alternatives: [
      'Combine order history from two different emails',
      'Consolidate duplicate accounts',
      'Move orders to my primary account',
    ],
    answer:
      'For security reasons, separate accounts cannot be merged automatically. However, you can update the email on your preferred account or contact Support to archive an unused duplicate profile.',
  },
  {
    id: 'faq-58',
    category: 'Login & Password Recovery',
    question: 'How do I log out of all devices if I signed in on a shared computer?',
    alternatives: [
      'Sign out remotely from other browsers',
      'End all active login sessions',
      'Secure account after using public device',
    ],
    answer:
      'Open Account Settings > Security > Active Sessions and click "Sign Out of All Devices". We also recommend changing your password if you used a shared computer.',
  },
  {
    id: 'faq-59',
    category: 'Login & Password Recovery',
    question: 'My password reset link expired or says invalid. What should I do?',
    alternatives: [
      'Password recovery email link stopped working',
      'Request a new reset password email',
      'Reset link invalid error',
    ],
    answer:
      'Password reset links expire after 30 minutes and can only be used once. Return to the Login screen, click "Forgot Password" again, and use the newest email link.',
  },
  {
    id: 'faq-60',
    category: 'Orders & Order Tracking',
    question: 'Why did my order arrive in multiple separate packages?',
    alternatives: [
      'Order split into two shipments',
      'Missing item that is shipping separately',
      'Multiple tracking numbers for one order',
    ],
    answer:
      'Items stored in different fulfillment centers may ship separately so you receive available products faster. Each shipment has its own tracking number listed inside "My Orders".',
  },
  {
    id: 'faq-61',
    category: 'Orders & Order Tracking',
    question: 'When will my pre-order or backordered item ship?',
    alternatives: [
      'Estimated dispatch date for pre-order',
      'Backorder shipping timeline',
      'Check release date of pre-ordered product',
    ],
    answer:
      'Pre-order and backordered items ship on the estimated release date displayed on the product page and in your order summary. You will receive a tracking email as soon as it dispatches.',
  },
  {
    id: 'faq-62',
    category: 'Orders & Order Tracking',
    question: 'Can I add a gift message or hide prices on the packing slip?',
    alternatives: [
      'Send order as a gift without price on receipt',
      'Include personalized gift note',
      'Gift receipt option at checkout',
    ],
    answer:
      'Yes. Select "This order is a gift" during checkout to include a complimentary gift message and automatically omit item prices from the printed packing slip.',
  },
  {
    id: 'faq-63',
    category: 'Payments & Payment Failures',
    question: 'How do I check my ShopEase Gift Card balance?',
    alternatives: [
      'View remaining gift card amount',
      'Check voucher balance online',
      'How much credit is left on my gift card',
    ],
    answer:
      'Sign in and visit My Account > Gift Cards & Store Credit, enter your 16-digit gift card code and PIN, and click "Check Balance".',
  },
  {
    id: 'faq-64',
    category: 'Payments & Payment Failures',
    question: 'What currencies do you accept and are there international card fees?',
    alternatives: [
      'Pay in local currency instead of USD',
      'Foreign transaction fee on credit card',
      'Multi-currency checkout options',
    ],
    answer:
      'ShopEase supports USD, EUR, GBP, CAD, AUD, and INR at checkout. Your card issuer may apply a standard foreign conversion fee if your card currency differs from the selected checkout currency.',
  },
  {
    id: 'faq-65',
    category: 'Refunds',
    question: 'How are refunds calculated if I used a coupon or bundle discount?',
    alternatives: [
      'Refund amount on discounted order',
      'Partial return refund with promo code',
      'Do I lose my coupon if I return one item',
    ],
    answer:
      'When you return part of a discounted order, the refund reflects the actual net price paid for that item after proportional coupon or bundle savings are applied.',
  },
  {
    id: 'faq-66',
    category: 'Refunds',
    question: 'Do ShopEase Store Credit refunds ever expire?',
    alternatives: [
      'Validity period of store credit',
      'When does refund wallet credit expire',
      'How long can I keep store credit',
    ],
    answer:
      'ShopEase Store Credit issued from a return or refund never expires and remains available in your account wallet for any future purchase.',
  },
  {
    id: 'faq-67',
    category: 'Returns & Exchanges',
    question: 'How long does return quality inspection take after I drop off my parcel?',
    alternatives: [
      'Warehouse return verification time',
      'Returned package delivered when is it approved',
      'Return inspection status',
    ],
    answer:
      'Once your return parcel arrives at our warehouse, quality inspection is completed within 1 to 2 business days, after which your refund or exchange is processed immediately.',
  },
  {
    id: 'faq-68',
    category: 'Returns & Exchanges',
    question: 'Can I reschedule or cancel a scheduled return pickup?',
    alternatives: [
      'Change return courier pickup date',
      'Missed return pickup appointment',
      'Switch from home pickup to drop-off',
    ],
    answer:
      'Open "My Orders", select the active return request, and click "Reschedule Pickup" to choose a new date or switch to a drop-off QR code.',
  },
  {
    id: 'faq-69',
    category: 'Returns & Exchanges',
    question: 'What if my product becomes defective after the 30-day return window?',
    alternatives: [
      'Item stopped working after 30 days',
      'Broken product past return period',
      'Post-return warranty replacement',
    ],
    answer:
      'Items that develop a manufacturing defect after 30 days are covered under the manufacturer warranty. Go to My Orders > Warranty Claim or contact Support for repair or replacement assistance.',
  },
  {
    id: 'faq-70',
    category: 'Cancellations',
    question: 'How do I cancel an auto-ship subscription or recurring order?',
    alternatives: [
      'Stop monthly auto-replenish subscription',
      'Pause or cancel recurring delivery',
      'Unsubscribe from scheduled deliveries',
    ],
    answer:
      'Go to My Account > Subscriptions, select the active plan, and click "Pause" or "Cancel Subscription" at least 24 hours before the next scheduled billing date.',
  },
  {
    id: 'faq-71',
    category: 'Cancellations',
    question: 'Why is my order stuck in Processing status and can I cancel it?',
    alternatives: [
      'Order processing for too long',
      'Order has not shipped yet',
      'Cancel delayed processing order',
    ],
    answer:
      'Orders usually stay in Processing for 12 to 24 hours during verification and packing. If it exceeds 48 hours, you can cancel directly from "My Orders" or contact Support for an immediate update.',
  },
  {
    id: 'faq-72',
    category: 'Shipping & Delivery',
    question: 'Do carriers deliver orders on weekends or public holidays?',
    alternatives: [
      'Saturday and Sunday package delivery',
      'Holiday shipping schedule',
      'Are orders delivered on weekends',
    ],
    answer:
      'Standard and Express carriers deliver Monday through Saturday in most regions. Deliveries do not operate on major public holidays and resume on the next business day.',
  },
  {
    id: 'faq-73',
    category: 'Shipping & Delivery',
    question: 'Do you ship to PO Boxes, military APO/FPO, or locker addresses?',
    alternatives: [
      'Deliver package to PO Box address',
      'Ship to parcel locker or military base',
      'Can I use a PO Box for shipping',
    ],
    answer:
      'Yes, standard shipping supports PO Boxes, parcel lockers, and APO/FPO military addresses. Express overnight shipping requires a physical street address.',
  },
  {
    id: 'faq-74',
    category: 'Shipping & Delivery',
    question: 'Can I redirect my package to a pickup store after it has shipped?',
    alternatives: [
      'Hold package at courier pickup location',
      'Reroute parcel while in transit',
      'Pick up shipment at local locker',
    ],
    answer:
      'Open your carrier tracking link and select "Hold at Location" if offered by the courier. Pickup redirection is free for most standard shipments.',
  },
  {
    id: 'faq-75',
    category: 'Discounts & Coupons',
    question: 'How do I earn and redeem ShopEase loyalty reward points?',
    alternatives: [
      'Use reward points at checkout',
      'Check loyalty points balance',
      'ShopEase rewards program details',
    ],
    answer:
      'You earn 10 points per $1 spent on eligible orders. At checkout, select "Redeem Reward Points" to convert every 500 points into a $5 discount.',
  },
  {
    id: 'faq-76',
    category: 'Discounts & Coupons',
    question: 'Do you offer a price match or price adjustment if an item goes on sale?',
    alternatives: [
      'Price dropped after I bought an item',
      'Request sale price adjustment',
      'Price match guarantee policy',
    ],
    answer:
      'If an item you purchased drops in price on ShopEase within 7 days of delivery, contact Customer Support with your Order ID to receive the difference as Store Credit.',
  },
  {
    id: 'faq-77',
    category: 'Discounts & Coupons',
    question: 'How does the refer-a-friend discount program work?',
    alternatives: [
      'Invite friends for referral coupon',
      'Share referral link for discount',
      'Referral reward promo code',
    ],
    answer:
      'Share your unique referral link from My Account > Refer & Earn. Your friend gets 15% off their first order over $40, and you receive a $10 credit once their order ships.',
  },
  {
    id: 'faq-78',
    category: 'Customer Support',
    question: 'Can I request a transcript of my live chat support conversation?',
    alternatives: [
      'Email copy of support chat',
      'Download chat history with agent',
      'Save customer support transcript',
    ],
    answer:
      'Yes. Click the menu icon in the Live Chat window and choose "Email Transcript", or use the Copy button on any assistant response.',
  },
  {
    id: 'faq-79',
    category: 'Customer Support',
    question: 'How do I place a bulk, wholesale, or corporate gift order?',
    alternatives: [
      'Buy large quantities for company',
      'Corporate bulk purchase discount',
      'Wholesale inquiry contact',
    ],
    answer:
      'For orders of 20 or more units, email corporate@shopease.example or contact Support with SKU numbers and quantities for custom volume pricing and invoicing.',
  },
  {
    id: 'faq-80',
    category: 'Customer Support',
    question: 'What accessibility support options are available for shopping assistance?',
    alternatives: [
      'Screen reader or hearing impaired support',
      'Accessibility assistance for placing orders',
      'Accessible customer service contact',
    ],
    answer:
      'ShopEase supports keyboard navigation and screen readers across all pages. Users needing dedicated ordering assistance can reach our priority accessibility desk at support@shopease.example.',
  },
];
