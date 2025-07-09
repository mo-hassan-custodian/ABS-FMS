export interface BankAccount {
  accountNumber: string;
  accountName: string;
  bankName: string;
  name: string; // Display name from API

  // Optional legacy fields for backward compatibility
  id?: string;
  accountType?: 'Current' | 'Savings' | 'Investment' | 'Fixed Deposit';
  bankBranch?: string;
  currency?: string;
  balance?: number;
  status?: 'Active' | 'Inactive' | 'Suspended' | 'Closed';
  description?: string;
  createdDate?: Date;
  updatedDate?: Date;
}

export interface BankAccountFilter {
  accountType?: string;
  bankName?: string;
  currency?: string;
  status?: string;
  searchTerm?: string;
}

// API Response interface for GET /api/Memo/bank-accounts
export interface BankAccountsResponse {
  isSuccess: boolean;
  message: string;
  httpStatus: number;
  data: BankAccount[];
  errors: any;
}
