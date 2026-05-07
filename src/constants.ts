export const CATEGORIES = [
  'Food',
  'Rent',
  'Transport',
  'Entertainment',
  'Health',
  'Shopping',
  'Utilities',
  'Education',
  'Investment',
  'Other'
];

export const BLOGS = [
  {
    id: 'sip-basics',
    title: 'What is a SIP and Why Should You Start at 22?',
    description: 'Learn the power of compounding and how small monthly investments can create massive wealth over time.',
    tag: 'Beginner',
    content: `A Systematic Investment Plan (SIP) is a method of investing in mutual funds where you contribute a fixed amount at regular intervals. 

Starting at 22 gives you a massive "Time Advantage". For example, if you invest ₹5,000 monthly at a 12% return:
- Starting at 22 (for 38 years): ₹5.2 Crores
- Starting at 30 (for 30 years): ₹1.7 Crores

The early bird really does get the worm (and the compound interest). It's not about timing the market, but about time IN the market.`
  },
  {
    id: 'cibil-score',
    title: 'Understanding Your CIBIL Score',
    description: 'Your financial reputation in 3 digits. How it impacts your loan approvals and interest rates.',
    tag: 'Credit',
    content: `Your CIBIL score is a 3-digit numeric summary of your credit history. It ranges from 300 to 900.
- 750+ is considered excellent.
- Below 600 makes it hard to get loans.

How to improve it:
1. Pay all EMIs on time.
2. Keep credit card utilization below 30%.
3. Don't apply for multiple loans simultaneously.
4. Monitor your report for errors.`
  },
  {
    id: '50-30-20-rule',
    title: 'The 50-30-20 Rule Explained Simply',
    description: 'The golden rule of budgeting that works for everyone, from college students to CEOs.',
    tag: 'Budgeting',
    content: `The 50-30-20 rule is a simple thumb rule for budgeting:
- 50% for Needs: Rent, Groceries, Utilities, Insurance.
- 30% for Wants: Dining out, Subscriptions, Hobbies.
- 20% for Savings & Debt Repayment: SIPs, Emergency fund, extra loan payments.

If you can't hit 20% savings immediately, start with 5% and work your way up. Consistency is more important than the initial amount.`
  },
  {
    id: 'no-cost-emi-truth',
    title: 'The Truth About "No-Cost" EMIs',
    description: 'Is it really zero interest? Uncovering the hidden processing fees and lost cash discounts.',
    tag: 'Advanced',
    content: `No-Cost EMI is a popular marketing gimmick. While the bank might not charge you "interest" on paper, here's how it actually works:

1. **Lost Discounts:** Often, the "No-Cost" option is only available if you pay the full MRP. If you paid upfront, you might have gotten a 10% discount.
2. **Processing Fees:** Banks often charge a one-time processing fee (₹199 - ₹500) which effectively acts as interest.
3. **GST on Interest:** Even if the retailer gives you a discount equivalent to the interest, you still pay GST on that interest component to the bank.

Before choosing No-Cost EMI, calculate the actual cost and see if a credit card full payment discount is better.`
  }
];

export const COURSES = [
  {
    id: 'finance-101',
    title: 'Finance 101: From Zero to Budgeting',
    lessonsCount: 5,
    difficulty: 'Beginner',
    lessons: [
      { id: 'f1', title: 'Why Money Matters' },
      { id: 'f2', title: 'Tracking Expenses' },
      { id: 'f3', title: 'Creating Your First Budget' },
      { id: 'f4', title: 'Emergency Fund Basics' },
      { id: 'f5', title: 'Introduction to Inflation' }
    ]
  },
  {
    id: 'investing-beginners',
    title: 'Investing for Beginners in India',
    lessonsCount: 8,
    difficulty: 'Intermediate',
    lessons: [
      { id: 'i1', title: 'Inflation & Why FDs Aren\'t Enough' },
      { id: 'i2', title: 'The Power of Compounding' },
      { id: 'i3', title: 'Mutual Funds 101' },
      { id: 'i4', title: 'Stock Market Basics' },
      { id: 'i5', title: 'Understanding Risk & Reward' },
      { id: 'i6', title: 'Gold, Real Estate, and Crypto' },
      { id: 'i7', title: 'Tax Saving (80C, ELSS)' },
      { id: 'i8', title: 'Building a Portfolio' }
    ]
  },
  {
    id: 'loan-literacy',
    title: 'Loan Literacy: Don\'t Get Trapped',
    lessonsCount: 4,
    difficulty: 'Advanced',
    lessons: [
      { id: 'l1', title: 'Good Debt vs Bad Debt' },
      { id: 'l2', title: 'Interest Rates: Simple vs Compound' },
      { id: 'l3', title: 'Understanding loan T&Cs' },
      { id: 'l4', title: 'Debt Snowball vs Avalanche' }
    ]
  }
];
