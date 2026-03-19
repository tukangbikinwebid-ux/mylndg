export interface Loan {
  id: number;
  nominal: number;
  tenor: number;
  interest_rate: number;
  monthly_payment: number;
  status: number;
  status_color: string;
  status_label: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface LoanPayment {
  id: number;
  loan_id: number;
  nominal: number;
  status: number;
  status_color: string;
  status_label: string;
  due_date: string;
  paid_at: string | null;
  ke: number;
}

export interface WalletTransaction {
  id: number;
  amount: number;
  status: number;
  status_color: string;
  status_label: string;
  description: string;
  created_at: string;
}
