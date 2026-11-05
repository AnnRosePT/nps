/**
 * NPS Knowledge Base & Query Resolution Engine
 * Handles natural language matching, keyword intents, multilingual terms,
 * and structured answers for NPS Saathi Assistant.
 */

export interface KnowledgeItem {
  id: string;
  keywords: string[];
  title: string;
  response: string;
}

export const KNOWLEDGE_BASE: KnowledgeItem[] = [
  {
    id: 'overview',
    keywords: ['what is nps', 'nps kya', 'explain nps', 'about nps', 'national pension system', 'nps endral enna'],
    title: 'What is NPS?',
    response: `The **National Pension System (NPS)** is an initiative by the Government of India, regulated by the **PFRDA (Pension Fund Regulatory and Development Authority)**.

### Key Benefits:
- **Regulated & Secure**: Supervised by PFRDA with transparent fund management.
- **Low Cost**: Lowest fund management charges in the world (~0.09%).
- **Tax Exemptions**: Deductions up to **₹2 Lakhs** annually under Sections 80CCD(1) and 80CCD(1B).
- **Flexibility**: Choose your own fund managers and asset allocation (Equity, Corporate Debt, Govt Securities).
- **Eligibility**: Open to all Indian citizens aged **18 to 70 years** (residents and NRIs).`,
  },
  {
    id: 'tier1_vs_tier2',
    keywords: ['tier 1', 'tier 2', 'difference between tier', 'tier1', 'tier2', 'two accounts'],
    title: 'Tier 1 vs. Tier 2 Account',
    response: `NPS offers two distinct accounts:

| Feature | **Tier 1 (Retirement Account)** | **Tier 2 (Savings Account)** |
| :--- | :--- | :--- |
| **Status** | Mandatory primary account | Voluntary add-on account |
| **Withdrawal** | Restricted until age 60 (retirement) | Anytime withdrawal with zero exit load |
| **Tax Benefits** | Eligible under Sec 80CCD(1) & 80CCD(1B) | No tax benefit (except for Central Govt) |
| **Minimum Deposit** | ₹500 at opening (₹1,000/yr minimum) | ₹1,000 at opening (₹250 per transaction) |
| **Exit at 60** | 60% Lump Sum (Tax-Free) + 40% Annuity | 100% withdrawable anytime |`,
  },
  {
    id: 'tax_benefits',
    keywords: ['tax', '80ccd', 'tax saving', 'deduction', '80c', 'kar bachat', 'vari vilakku'],
    title: 'NPS Tax Deductions (Up to ₹2 Lakhs+)',
    response: `NPS offers unique triple tax benefits under the Indian Income Tax Act:

1. **Section 80CCD(1)**: 
   - Tax deduction up to 10% of basic salary + DA (or 20% of Gross Income for self-employed).
   - Covered under overall **₹1.5 Lakh** limit of Section 80CCE.
2. **Section 80CCD(1B) — Exclusive Bonus!**:
   - **Additional exclusive deduction up to ₹50,000** over and above the ₹1.5 Lakh 80C limit!
   - Saves up to ₹15,600 in taxes for individuals in the 30% slab.
3. **Section 80CCD(2) — Employer Contribution**:
   - Up to 10% (private sector) or 14% (central/state govt) of Basic + DA contributed by employer is tax-exempt with no upper ceiling!
4. **Maturity Exemption**:
   - The 60% lump-sum withdrawal at age 60 is **100% Tax-Free (Exempt-Exempt-Exempt status)**.`,
  },
  {
    id: 'withdrawal',
    keywords: ['withdraw', 'exit', 'nikalna', 'pension kab', 'premature', 'partial withdrawal'],
    title: 'NPS Withdrawal & Maturity Rules',
    response: `NPS has transparent exit guidelines based on circumstances:

### 1. Normal Superannuation (Age 60 or above)
- **Minimum 40%** must be used to purchase an Annuity for lifelong monthly pension.
- **Up to 60%** can be withdrawn as a tax-free lump sum.
- *Note:* If accumulated corpus is ≤ ₹5 Lakhs, 100% can be withdrawn as lump sum.

### 2. Premature Exit (Before Age 60)
- Permitted after completing at least 5 years.
- **Minimum 80%** must be utilized for Annuity; 20% lump sum.
- *Note:* If corpus is ≤ ₹2.5 Lakhs, 100% lump sum withdrawal is permitted.

### 3. Partial Withdrawal (For Emergencies)
- Allowed after **3 years** of subscription.
- Maximum 3 times during the entire tenure (up to 25% of own contributions).
- Allowed for higher education of children, marriage, house purchase, or critical medical treatments.`,
  },
  {
    id: 'auto_vs_active',
    keywords: ['auto choice', 'active choice', 'asset class', 'lc75', 'lc50', 'equity limit', 'fund manager'],
    title: 'Investment Choices: Active vs. Auto Choice',
    response: `You have two investment options for managing your money:

### 1. Active Choice (You Decide)
- **Asset Class E (Equity)**: Up to 75% in stocks for higher growth.
- **Asset Class C (Corporate Debt)**: Up to 100% in fixed-income corporate bonds.
- **Asset Class G (Govt Securities)**: Up to 100% in Central & State Government bonds.
- **Asset Class A (Alternative Assets)**: Up to 5% in REITs, InvITs, and AIFs.

### 2. Auto Choice (Lifecycle Funds)
Your money is automatically rebalanced into safer assets as you grow older:
- **LC75 (Aggressive)**: Starts with 75% equity until age 35, tapering gradually to 15% by age 55.
- **LC50 (Moderate - Default)**: Starts with 50% equity until age 35, tapering to 10% by age 55.
- **LC25 (Conservative)**: Starts with 25% equity until age 35, tapering to 5% by age 55.`,
  },
  {
    id: 'open_account',
    keywords: ['how to open', 'apply', 'registration', 'pran', 'cra', 'khata kaise khole'],
    title: 'How to Open an NPS Account Online',
    response: `You can open an NPS account online in under 10 minutes:

1. **Keep Documents Ready**: Aadhaar or PAN card, bank account details, and scanned signature.
2. **DigiLocker / e-KYC**: Use our integrated DigiLocker page for paperless instant identity verification.
3. **Choose PFM**: Select a Pension Fund Manager (e.g. SBI, LIC, HDFC, ICICI).
4. **Choose Scheme**: Pick Active Choice or Auto Choice (LC50 / LC75).
5. **Initial Contribution**: Make a minimum initial deposit of ₹500 via UPI, NetBanking, or Debit Card.
6. **PRAN Generation**: Your 12-digit **Permanent Retirement Account Number (PRAN)** will be generated instantly!`,
  },
];

export const PROMPT_SUGGESTIONS = [
  'What is NPS?',
  'Tier 1 vs. Tier 2 Account',
  'Tax benefits under Section 80CCD',
  'Withdrawal & Exit Rules',
  'Active vs. Auto Choice (LC75/LC50)',
  'How to open an account with DigiLocker',
];

/**
 * Matches user query against the NPS knowledge base.
 */
export function resolveAssistantQuery(query: string): string {
  const q = query.trim().toLowerCase();
  if (!q) return getDefaultWelcomeMessage();

  for (const item of KNOWLEDGE_BASE) {
    if (item.keywords.some((kw) => q.includes(kw))) {
      return item.response;
    }
  }

  // Fallback for general pension calculation questions
  if (q.includes('calculator') || q.includes('how much') || q.includes('corpus') || q.includes('estimate') || q.includes('calculate')) {
    return `To see your personalized retirement projections and monthly annuity returns, please try our interactive **Pension Simulator** in the sidebar. You can customize your age, monthly contribution, and risk preference!`;
  }

  return getDefaultWelcomeMessage();
}

export function getDefaultWelcomeMessage(): string {
  return `Namaste! 🙏 I am your **NPS Saathi AI Assistant**.

I can answer any questions about India's National Pension System:
- **Account Types**: Differences between Tier 1 and Tier 2
- **Tax Savings**: Section 80CCD(1B) extra ₹50,000 deduction
- **Withdrawal Rules**: Lump sum vs. monthly pension annuity
- **Investment Options**: Active Choice vs. Lifecycle Auto Choice
- **Opening PRAN**: Paperless onboarding via DigiLocker

Click any suggested question below or type your query in English, Hindi, Tamil, or Malayalam!`;
}
