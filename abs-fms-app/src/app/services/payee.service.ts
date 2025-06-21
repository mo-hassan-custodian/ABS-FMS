import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { Payee, PayeeCreateRequest, PayeeStats } from '../models/payee.model';

@Injectable({
  providedIn: 'root'
})
export class PayeeService {
  private readonly STORAGE_KEY = 'abs_fms_payees';
  private payeesSubject = new BehaviorSubject<Payee[]>([]);
  public payees$ = this.payeesSubject.asObservable();

  // Event emitter for payee creation
  private payeeCreatedSubject = new Subject<Payee>();
  public payeeCreated$ = this.payeeCreatedSubject.asObservable();

  constructor() {
    this.loadPayeesFromStorage();
  }

  private loadPayeesFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const payees = JSON.parse(stored).map((p: any) => ({
          ...p,
          createdDate: new Date(p.createdDate),
          updatedDate: p.updatedDate ? new Date(p.updatedDate) : undefined
        }));
        this.payeesSubject.next(payees);
      } else {
        // Initialize with sample data
        this.initializeSampleData();
      }
    } catch (error) {
      console.error('Error loading payees from storage:', error);
      this.initializeSampleData();
    }
  }

  private savePayeesToStorage(payees: Payee[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(payees));
    } catch (error) {
      console.error('Error saving payees to storage:', error);
    }
  }

  private initializeSampleData(): void {
    const samplePayees: Payee[] = [
      {
        id: '1',
        name: 'ABC Construction Ltd',
        createdFrom: 'MANUAL',
        shortDescription: 'ABC Construction Ltd',
        pinNo: 'P051234567A',
        bankName: 'First Bank Nigeria',
        bankBranch: 'Victoria Island',
        accountNumber: '2034567890',
        physicalAddress: '123 Construction Avenue, Victoria Island, Lagos',
        postalAddress: 'P.O. Box 12345, Victoria Island, Lagos',
        status: 'Active',
        createdDate: new Date('2024-01-15'),
        createdBy: 'System Admin'
      },
      {
        id: '2',
        name: 'Medical Supplies Nigeria',
        createdFrom: 'IMPORT',
        shortDescription: 'Medical Supplies Nigeria',
        pinNo: 'P051234568B',
        bankName: 'Zenith Bank',
        bankBranch: 'Ikeja',
        accountNumber: '1023456789',
        physicalAddress: '45 Medical Drive, Ikeja, Lagos',
        postalAddress: 'P.O. Box 67890, Ikeja, Lagos',
        status: 'Active',
        createdDate: new Date('2024-02-01'),
        createdBy: 'Import System'
      }
    ];

    this.payeesSubject.next(samplePayees);
    this.savePayeesToStorage(samplePayees);
  }

  getAllPayees(): Observable<Payee[]> {
    return this.payees$;
  }

  getPayeeById(id: string): Observable<Payee | undefined> {
    return this.payees$.pipe(
      map(payees => payees.find(p => p.id === id))
    );
  }

  createPayee(request: PayeeCreateRequest): Observable<Payee> {
    const newPayee: Payee = {
      id: this.generateId(),
      name: request.name,
      createdFrom: request.createdFrom,
      shortDescription: request.shortDescription || request.name,
      pinNo: request.pinNo,
      bankName: request.bankName,
      bankBranch: request.bankBranch,
      accountNumber: request.accountNumber,
      physicalAddress: request.physicalAddress,
      postalAddress: request.postalAddress,
      status: 'Active',
      createdDate: new Date(),
      createdBy: 'Current User' // TODO: Get from auth service
    };

    const currentPayees = this.payeesSubject.value;
    const updatedPayees = [...currentPayees, newPayee];
    
    this.payeesSubject.next(updatedPayees);
    this.savePayeesToStorage(updatedPayees);

    // Emit the created payee event
    this.payeeCreatedSubject.next(newPayee);

    return of(newPayee).pipe(delay(500)); // Simulate API delay
  }

  updatePayee(id: string, updates: Partial<Payee>): Observable<Payee | null> {
    const currentPayees = this.payeesSubject.value;
    const index = currentPayees.findIndex(p => p.id === id);
    
    if (index === -1) {
      return of(null);
    }

    const updatedPayee: Payee = {
      ...currentPayees[index],
      ...updates,
      updatedDate: new Date(),
      updatedBy: 'Current User' // TODO: Get from auth service
    };

    const updatedPayees = [...currentPayees];
    updatedPayees[index] = updatedPayee;
    
    this.payeesSubject.next(updatedPayees);
    this.savePayeesToStorage(updatedPayees);

    return of(updatedPayee).pipe(delay(300));
  }

  updatePayeeStatus(id: string, status: 'Active' | 'Inactive' | 'Suspended'): Observable<boolean> {
    return this.updatePayee(id, { status }).pipe(
      map(result => result !== null)
    );
  }

  deletePayee(id: string): Observable<boolean> {
    const currentPayees = this.payeesSubject.value;
    const filteredPayees = currentPayees.filter(p => p.id !== id);
    
    if (filteredPayees.length === currentPayees.length) {
      return of(false); // Payee not found
    }

    this.payeesSubject.next(filteredPayees);
    this.savePayeesToStorage(filteredPayees);

    return of(true).pipe(delay(300));
  }

  searchPayees(query: string): Observable<Payee[]> {
    if (!query.trim()) {
      return this.payees$;
    }

    return this.payees$.pipe(
      map(payees => payees.filter(payee =>
        payee.name.toLowerCase().includes(query.toLowerCase()) ||
        payee.pinNo.toLowerCase().includes(query.toLowerCase()) ||
        payee.bankName.toLowerCase().includes(query.toLowerCase()) ||
        payee.accountNumber.includes(query) ||
        payee.shortDescription.toLowerCase().includes(query.toLowerCase())
      ))
    );
  }

  getPayeeStats(): Observable<PayeeStats> {
    return this.payees$.pipe(
      map(payees => ({
        total: payees.length,
        active: payees.filter(p => p.status === 'Active').length,
        inactive: payees.filter(p => p.status === 'Inactive').length,
        suspended: payees.filter(p => p.status === 'Suspended').length
      }))
    );
  }

  private generateId(): string {
    return 'payee_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
  }
}
