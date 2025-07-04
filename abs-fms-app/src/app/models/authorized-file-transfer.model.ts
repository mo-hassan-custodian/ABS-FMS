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
  type: 'CLAIMS' | 'COMMISSIONS' | 'POLICY_MATURITY' | 'SURRENDERS' | 'FINES';
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
  type: 'CLAIMS' | 'COMMISSIONS' | 'POLICY_MATURITY' | 'SURRENDERS' | 'FINES';
  document: string;
  payee: string;
}

export interface AuthorizedFileTransferStats {
  total: number;
  byType: {
    claims: number;
    commissions: number;
    policyMaturity: number;
  };
}

export interface AuthorizedFileTransferFilter {
  searchTerm?: string;
  type?: 'CLAIMS' | 'COMMISSIONS' | 'POLICY_MATURITY' | 'ALL';
  dateFrom?: Date;
  dateTo?: Date;
}
