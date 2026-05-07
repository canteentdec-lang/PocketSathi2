export enum LoanRisk {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export interface User {
  name: string;
  email: string;
  password?: string;
  onboarded: boolean;
}

export interface Transaction {
  id: string;
  date: string;
  category: string;
  amount: number;
  note?: string;
  type: 'expense' | 'income';
}

export interface DebtAnalysis {
  id: string;
  date: string;
  label: string;
  loanAmount: number;
  interestRate: number;
  tenure: number;
  processingFee: number;
  processingFeeType: 'amount' | 'percent';
  prepaymentPenalty: boolean;
  autoDebit: boolean;
  rawText?: string;
  riskScore: number;
  emi: number;
  totalRepayment: number;
  totalInterest: number;
  apr: number;
}

export interface SavedCalculation {
  id: string;
  title: string;
  type: 'sip' | 'sip-stepup' | 'lumpsum' | 'fd' | 'emi';
  inputs: Record<string, any>;
  result: Record<string, any>;
  date: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'coach';
  text: string;
  timestamp: string;
}

export interface AiBlog {
  id: string;
  title: string;
  content: string;
  date: string;
  topic: string;
}

export interface OnboardingData {
  salary: number;
  categories: string[];
  savingsGoal: number;
  budgetSplit: {
    needs: number;
    wants: number;
    savings: number;
  };
}

export interface UserData {
  transactions: Transaction[];
  debtAnalyses: DebtAnalysis[];
  savedCalculations: SavedCalculation[];
  chatHistory: ChatMessage[];
  onboarding: OnboardingData | null;
  courseProgress: Record<string, string[]>; // courseId -> list of completed lessonIds
  savedAiBlogs: AiBlog[];
}
