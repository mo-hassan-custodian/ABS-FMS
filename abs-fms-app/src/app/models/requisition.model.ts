export interface Requisition {
  id: string;
  code: string;
  payee: string;
  chequePayee: string;
  payeeBankBranch: string;
  payeeAccountNo: string;
  narrative: string;
  invoiceNo: string;
  invoiceDate: Date | null;
  amount: number;
  currency: string;
  bankAccount: string;
  type: string;
  paymentOption: string;
  status: 'Draft' | 'Pending' | 'Approved' | 'Rejected' | 'Paid';
  createdDate: Date;
  createdBy: string;
}

export interface RequisitionCreateRequest {
  code: string;
  payee: string;
  chequePayee: string;
  payeeBankBranch: string;
  payeeAccountNo: string;
  narrative: string;
  invoiceNo: string;
  invoiceDate: Date | null;
  amount: number;
  currency: string;
  bankAccount: string;
  type: string;
  paymentOption: string;
}
