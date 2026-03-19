export interface User {
  id: number;
  email: string;
  image: string;
  email_verified_at: string | null;
  anggota: Anggota | null;
}

export interface Anggota {
  status: number;
  balance: number;
  can_withdraw: number;
  credit_score: number;
  second_loan: number;
  anggota_detail: AnggotaDetail | null;
  anggota_bank: AnggotaBank | null;
}

export interface AnggotaDetail {
  ktp_number: string;
  full_name: string;
  gender: string;
  birth_place: string;
  birth_date: string;
  work: string;
  monthly_income: number;
  loan_purpose: string;
  address: string;
  contact_1: string;
  contact_1_name: string;
}

export interface AnggotaBank {
  bank_name: string;
  account_number: string;
  account_name: string;
}
