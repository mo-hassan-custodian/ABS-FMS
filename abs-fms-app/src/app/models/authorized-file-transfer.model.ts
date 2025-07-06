export interface AuthorizedFileTransfer {
  id: string;
  remarks: string;
  voucherNoRef: string;
  date: Date;
  narrative: string;
  bankAccount: string;
  currencyCode: string;
  amountPayee: number;
  authorisedBy: string;
  authorizationDate: Date;
  preparedBy: string;
  requestDate: Date;
  type:
    | 'POLICY_SURRENDER'
    | 'PARTIAL_MATURITIES'
    | 'FULL_MATURITIES'
    | 'INVESTMENT_MATURITIES'
    | 'POLICY_LOAN'
    | 'POLICY_TERMINATION'
    | 'PARTIAL_WITHDRAWAL'
    | 'ANNUITY_MATURITIES'
    | 'DEATH_CLAIM'
    | 'COMMISSION'
    | 'POLICY_CANCELLATION';
  document: string;
  payee: string;
}

export interface AuthorizedFileTransferCreateRequest {
  remarks: string;
  voucherNoRef: string;
  date: Date;
  narrative: string;
  bankAccount: string;
  currencyCode: string;
  amountPayee: number;
  authorisedBy: string;
  authorizationDate: Date;
  preparedBy: string;
  requestDate: Date;
  type:
    | 'POLICY_SURRENDER'
    | 'PARTIAL_MATURITIES'
    | 'FULL_MATURITIES'
    | 'INVESTMENT_MATURITIES'
    | 'POLICY_LOAN'
    | 'POLICY_TERMINATION'
    | 'PARTIAL_WITHDRAWAL'
    | 'ANNUITY_MATURITIES'
    | 'DEATH_CLAIM'
    | 'COMMISSION'
    | 'POLICY_CANCELLATION';
  document: string;
  payee: string;
}

export interface AuthorizedFileTransferStats {
  total: number;
  byType: {
    policySurrender: number;
    partialMaturities: number;
    fullMaturities: number;
    investmentMaturities: number;
    policyLoan: number;
    policyTermination: number;
    partialWithdrawal: number;
    annuityMaturities: number;
    deathClaim: number;
    commission: number;
    policyCancellation: number;
  };
}

export interface AuthorizedFileTransferFilter {
  searchTerm?: string;
  type?:
    | 'POLICY_SURRENDER'
    | 'PARTIAL_MATURITIES'
    | 'FULL_MATURITIES'
    | 'INVESTMENT_MATURITIES'
    | 'POLICY_LOAN'
    | 'POLICY_TERMINATION'
    | 'PARTIAL_WITHDRAWAL'
    | 'ANNUITY_MATURITIES'
    | 'DEATH_CLAIM'
    | 'COMMISSION'
    | 'POLICY_CANCELLATION'
    | 'ALL';
  dateFrom?: Date;
  dateTo?: Date;
}
