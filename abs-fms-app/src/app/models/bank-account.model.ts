export interface BankAccount {
  id: string;
  name: string;
  accountNumber: string;
  accountType: 'Current' | 'Savings' | 'Investment' | 'Fixed Deposit';
  bankName: string;
  bankBranch: string;
  currency: string;
  balance?: number;
  status: 'Active' | 'Inactive' | 'Suspended' | 'Closed';
  description?: string;
  createdDate: Date;
  updatedDate?: Date;
}

export interface BankAccountCreateRequest {
  name: string;
  accountNumber: string;
  accountType: 'Current' | 'Savings' | 'Investment' | 'Fixed Deposit';
  bankName: string;
  bankBranch: string;
  currency: string;
  description?: string;
}

export interface BankAccountFilter {
  accountType?: string;
  bankName?: string;
  currency?: string;
  status?: string;
  searchTerm?: string;
}
