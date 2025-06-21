export interface Payee {
  id: string;
  name: string;
  createdFrom: string;
  shortDescription: string;
  pinNo: string;
  bankName: string;
  bankBranch: string;
  accountNumber: string;
  physicalAddress: string;
  postalAddress: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  createdDate: Date;
  createdBy: string;
  updatedDate?: Date;
  updatedBy?: string;
}

export interface PayeeCreateRequest {
  name: string;
  createdFrom: string;
  shortDescription?: string;
  pinNo: string;
  bankName: string;
  bankBranch: string;
  accountNumber: string;
  physicalAddress: string;
  postalAddress: string;
}

export interface PayeeStats {
  total: number;
  active: number;
  inactive: number;
  suspended: number;
}
