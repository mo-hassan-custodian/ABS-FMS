import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Requisition, RequisitionCreateRequest } from '../models/requisition.model';

@Injectable({
  providedIn: 'root'
})
export class RequisitionService {
  private requisitions: Requisition[] = [
    // Sample data for demonstration
    {
      id: 'REQ-001',
      code: 'REQ001',
      payee: 'ABC Insurance Ltd',
      chequePayee: 'ABC Insurance Ltd',
      payeeBankBranch: 'Main Branch - Lagos',
      payeeAccountNo: '1234567890',
      narrative: 'Premium payment for motor insurance policy',
      invoiceNo: 'INV-2024-001',
      invoiceDate: new Date('2024-01-15'),
      amount: 150000,
      currency: 'NGN',
      bankAccount: 'Operating Account',
      type: 'SUPPLIER',
      paymentOption: 'EFT',
      status: 'Approved',
      createdDate: new Date('2024-01-10'),
      createdBy: 'John Doe'
    },
    {
      id: 'REQ-002',
      code: 'REQ002',
      payee: 'XYZ Medical Center',
      chequePayee: 'XYZ Medical Center',
      payeeBankBranch: 'Victoria Island Branch',
      payeeAccountNo: '0987654321',
      narrative: 'Medical claim settlement for policy holder',
      invoiceNo: 'INV-2024-002',
      invoiceDate: new Date('2024-01-14'),
      amount: 75000,
      currency: 'NGN',
      bankAccount: 'Claims Account',
      type: 'MEDICAL_PROVIDER',
      paymentOption: 'BANK_DRAFT',
      status: 'Pending',
      createdDate: new Date('2024-01-12'),
      createdBy: 'Jane Smith'
    },
    {
      id: 'REQ-003',
      code: 'REQ003',
      payee: 'Tech Solutions Nigeria',
      chequePayee: 'Tech Solutions Nigeria',
      payeeBankBranch: 'Ikeja Branch',
      payeeAccountNo: '1122334455',
      narrative: 'IT equipment purchase for office upgrade',
      invoiceNo: 'INV-2024-003',
      invoiceDate: new Date('2024-01-16'),
      amount: 250000,
      currency: 'NGN',
      bankAccount: 'Operating Account',
      type: 'CONTRACTOR',
      paymentOption: 'EFT',
      status: 'Draft',
      createdDate: new Date('2024-01-15'),
      createdBy: 'Mike Johnson'
    },
    {
      id: 'REQ-004',
      code: 'REQ004',
      payee: 'Employee Salary - Sarah Wilson',
      chequePayee: 'Sarah Wilson',
      payeeBankBranch: 'Lekki Branch',
      payeeAccountNo: '5566778899',
      narrative: 'Monthly salary payment for January 2024',
      invoiceNo: 'SAL-2024-001',
      invoiceDate: new Date('2024-01-31'),
      amount: 180000,
      currency: 'NGN',
      bankAccount: 'Payroll Account',
      type: 'EMPLOYEE',
      paymentOption: 'EFT',
      status: 'Approved',
      createdDate: new Date('2024-01-28'),
      createdBy: 'HR Department'
    },
    {
      id: 'REQ-005',
      code: 'REQ005',
      payee: 'Lagos State Government',
      chequePayee: 'Lagos State Government',
      payeeBankBranch: 'Government House Branch',
      payeeAccountNo: '9988776655',
      narrative: 'Tax payment for Q4 2023',
      invoiceNo: 'TAX-2023-Q4',
      invoiceDate: new Date('2024-01-20'),
      amount: 500000,
      currency: 'NGN',
      bankAccount: 'Operating Account',
      type: 'SUPPLIER',
      paymentOption: 'BANK_DRAFT',
      status: 'Rejected',
      createdDate: new Date('2024-01-18'),
      createdBy: 'Finance Team'
    }
  ];

  private requisitionsSubject = new BehaviorSubject<Requisition[]>(this.requisitions);
  public requisitions$ = this.requisitionsSubject.asObservable();

  constructor() {
    // Load from localStorage if available
    this.loadFromStorage();
  }

  // Get all requisitions
  getAllRequisitions(): Observable<Requisition[]> {
    return this.requisitions$;
  }

  // Get requisition by ID
  getRequisitionById(id: string): Observable<Requisition | undefined> {
    return this.requisitions$.pipe(
      map(requisitions => requisitions.find(req => req.id === id))
    );
  }

  // Create new requisition
  createRequisition(request: RequisitionCreateRequest): Observable<Requisition> {
    const newRequisition: Requisition = {
      id: this.generateId(),
      ...request,
      status: 'Draft',
      createdDate: new Date(),
      createdBy: 'Current User' // This would come from auth service
    };

    this.requisitions.unshift(newRequisition); // Add to beginning of array
    this.saveToStorage();
    this.requisitionsSubject.next([...this.requisitions]);

    return new BehaviorSubject(newRequisition).asObservable();
  }

  // Update requisition
  updateRequisition(id: string, updates: Partial<Requisition>): Observable<Requisition | null> {
    const index = this.requisitions.findIndex(req => req.id === id);
    
    if (index !== -1) {
      this.requisitions[index] = { ...this.requisitions[index], ...updates };
      this.saveToStorage();
      this.requisitionsSubject.next([...this.requisitions]);
      return new BehaviorSubject(this.requisitions[index]).asObservable();
    }
    
    return new BehaviorSubject(null).asObservable();
  }

  // Delete requisition
  deleteRequisition(id: string): Observable<boolean> {
    const index = this.requisitions.findIndex(req => req.id === id);
    
    if (index !== -1) {
      this.requisitions.splice(index, 1);
      this.saveToStorage();
      this.requisitionsSubject.next([...this.requisitions]);
      return new BehaviorSubject(true).asObservable();
    }
    
    return new BehaviorSubject(false).asObservable();
  }

  // Update requisition status
  updateRequisitionStatus(id: string, status: Requisition['status']): Observable<boolean> {
    const requisition = this.requisitions.find(req => req.id === id);
    
    if (requisition) {
      requisition.status = status;
      this.saveToStorage();
      this.requisitionsSubject.next([...this.requisitions]);
      return new BehaviorSubject(true).asObservable();
    }
    
    return new BehaviorSubject(false).asObservable();
  }

  // Search requisitions
  searchRequisitions(searchTerm: string): Observable<Requisition[]> {
    const filtered = this.requisitions.filter(req => 
      req.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.payee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.narrative.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return new BehaviorSubject(filtered).asObservable();
  }

  // Get requisitions by status
  getRequisitionsByStatus(status: Requisition['status']): Observable<Requisition[]> {
    const filtered = this.requisitions.filter(req => req.status === status);
    return new BehaviorSubject(filtered).asObservable();
  }

  // Private helper methods
  private generateId(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 7);
    return `REQ-${timestamp.slice(-6)}-${random.toUpperCase()}`;
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('requisitions', JSON.stringify(this.requisitions));
    } catch (error) {
      console.error('Error saving requisitions to localStorage:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('requisitions');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        this.requisitions = parsed.map((req: any) => ({
          ...req,
          invoiceDate: req.invoiceDate ? new Date(req.invoiceDate) : null,
          createdDate: new Date(req.createdDate)
        }));
        this.requisitionsSubject.next([...this.requisitions]);
      }
    } catch (error) {
      console.error('Error loading requisitions from localStorage:', error);
    }
  }

  // Utility method to get statistics
  getRequisitionStats(): Observable<{
    total: number;
    draft: number;
    pending: number;
    approved: number;
    rejected: number;
    paid: number;
    totalAmount: number;
  }> {
    const stats = {
      total: this.requisitions.length,
      draft: this.requisitions.filter(r => r.status === 'Draft').length,
      pending: this.requisitions.filter(r => r.status === 'Pending').length,
      approved: this.requisitions.filter(r => r.status === 'Approved').length,
      rejected: this.requisitions.filter(r => r.status === 'Rejected').length,
      paid: this.requisitions.filter(r => r.status === 'Paid').length,
      totalAmount: this.requisitions.reduce((sum, req) => sum + req.amount, 0)
    };
    
    return new BehaviorSubject(stats).asObservable();
  }
}
