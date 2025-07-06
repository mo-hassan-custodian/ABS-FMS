import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BankAccount, BankAccountCreateRequest, BankAccountFilter } from '../models/bank-account.model';

@Injectable({
  providedIn: 'root'
})
export class BankAccountService {
  private bankAccountsSubject = new BehaviorSubject<BankAccount[]>([]);
  public bankAccounts$ = this.bankAccountsSubject.asObservable();

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData(): void {
    const sampleAccounts: BankAccount[] = [
      {
        id: '1',
        name: 'Main Operating Account',
        accountNumber: '0123456789',
        accountType: 'Current',
        bankName: 'Custodian Bank',
        bankBranch: 'Head Office - Victoria Island',
        currency: 'NGN',
        balance: 15000000,
        status: 'Active',
        description: 'Primary operating account for daily transactions',
        createdDate: new Date('2023-01-01')
      },
      {
        id: '2',
        name: 'Petty Cash Account',
        accountNumber: '0987654321',
        accountType: 'Savings',
        bankName: 'Custodian Bank',
        bankBranch: 'Lagos Branch - Ikeja',
        currency: 'NGN',
        balance: 500000,
        status: 'Active',
        description: 'Account for small cash transactions and expenses',
        createdDate: new Date('2023-01-15')
      },
      {
        id: '3',
        name: 'Investment Account',
        accountNumber: '1122334455',
        accountType: 'Investment',
        bankName: 'Custodian Bank',
        bankBranch: 'Abuja Branch - Wuse II',
        currency: 'NGN',
        balance: 25000000,
        status: 'Active',
        description: 'Long-term investment and fixed deposits',
        createdDate: new Date('2023-02-01')
      },
      {
        id: '4',
        name: 'Claims Settlement Account',
        accountNumber: '2233445566',
        accountType: 'Current',
        bankName: 'Custodian Bank',
        bankBranch: 'Port Harcourt Branch - GRA',
        currency: 'NGN',
        balance: 8000000,
        status: 'Active',
        description: 'Dedicated account for insurance claims payments',
        createdDate: new Date('2023-02-15')
      },
      {
        id: '5',
        name: 'Premium Collection Account',
        accountNumber: '3344556677',
        accountType: 'Current',
        bankName: 'Custodian Bank',
        bankBranch: 'Kano Branch - Sabon Gari',
        currency: 'NGN',
        balance: 12000000,
        status: 'Active',
        description: 'Account for collecting insurance premiums',
        createdDate: new Date('2023-03-01')
      },
      {
        id: '6',
        name: 'Commission Account',
        accountNumber: '4455667788',
        accountType: 'Current',
        bankName: 'Custodian Bank',
        bankBranch: 'Ibadan Branch - Bodija',
        currency: 'NGN',
        balance: 3500000,
        status: 'Active',
        description: 'Account for agent and broker commission payments',
        createdDate: new Date('2023-03-15')
      },
      {
        id: '7',
        name: 'USD Operating Account',
        accountNumber: '5566778899',
        accountType: 'Current',
        bankName: 'Custodian Bank',
        bankBranch: 'Head Office - Victoria Island',
        currency: 'USD',
        balance: 150000,
        status: 'Active',
        description: 'Foreign currency account for international transactions',
        createdDate: new Date('2023-04-01')
      },
      {
        id: '8',
        name: 'Staff Welfare Account',
        accountNumber: '6677889900',
        accountType: 'Savings',
        bankName: 'Custodian Bank',
        bankBranch: 'Kaduna Branch - Barnawa',
        currency: 'NGN',
        balance: 2000000,
        status: 'Active',
        description: 'Account for staff benefits and welfare programs',
        createdDate: new Date('2023-04-15')
      },
      {
        id: '9',
        name: 'Training & Development Account',
        accountNumber: '7788990011',
        accountType: 'Savings',
        bankName: 'Custodian Bank',
        bankBranch: 'Benin Branch - Ring Road',
        currency: 'NGN',
        balance: 1500000,
        status: 'Active',
        description: 'Account for staff training and development expenses',
        createdDate: new Date('2023-05-01')
      },
      {
        id: '10',
        name: 'Emergency Fund Account',
        accountNumber: '8899001122',
        accountType: 'Savings',
        bankName: 'Custodian Bank',
        bankBranch: 'Enugu Branch - Independence Layout',
        currency: 'NGN',
        balance: 5000000,
        status: 'Active',
        description: 'Emergency reserve fund for unexpected expenses',
        createdDate: new Date('2023-05-15')
      }
    ];

    this.bankAccountsSubject.next(sampleAccounts);
  }

  getAllBankAccounts(): Observable<BankAccount[]> {
    return this.bankAccounts$;
  }

  getActiveBankAccounts(): Observable<BankAccount[]> {
    return this.bankAccounts$.pipe(
      map(accounts => accounts.filter(account => account.status === 'Active'))
    );
  }

  getBankAccountById(id: string): Observable<BankAccount | undefined> {
    return this.bankAccounts$.pipe(
      map(accounts => accounts.find(account => account.id === id))
    );
  }

  searchBankAccounts(filter: BankAccountFilter): Observable<BankAccount[]> {
    return this.bankAccounts$.pipe(
      map(accounts => {
        let filtered = accounts;

        // Filter by search term
        if (filter.searchTerm && filter.searchTerm.trim()) {
          const searchTerm = filter.searchTerm.toLowerCase();
          filtered = filtered.filter(account =>
            account.name.toLowerCase().includes(searchTerm) ||
            account.accountNumber.includes(searchTerm) ||
            account.bankName.toLowerCase().includes(searchTerm) ||
            account.bankBranch.toLowerCase().includes(searchTerm) ||
            (account.description && account.description.toLowerCase().includes(searchTerm))
          );
        }

        // Filter by account type
        if (filter.accountType && filter.accountType !== 'ALL') {
          filtered = filtered.filter(account => account.accountType === filter.accountType);
        }

        // Filter by bank name
        if (filter.bankName && filter.bankName !== 'ALL') {
          filtered = filtered.filter(account => account.bankName === filter.bankName);
        }

        // Filter by currency
        if (filter.currency && filter.currency !== 'ALL') {
          filtered = filtered.filter(account => account.currency === filter.currency);
        }

        // Filter by status
        if (filter.status && filter.status !== 'ALL') {
          filtered = filtered.filter(account => account.status === filter.status);
        }

        return filtered;
      })
    );
  }

  createBankAccount(request: BankAccountCreateRequest): Observable<BankAccount> {
    const newAccount: BankAccount = {
      id: this.generateId(),
      name: request.name,
      accountNumber: request.accountNumber,
      accountType: request.accountType,
      bankName: request.bankName,
      bankBranch: request.bankBranch,
      currency: request.currency,
      status: 'Active',
      description: request.description,
      createdDate: new Date()
    };

    const currentAccounts = this.bankAccountsSubject.value;
    this.bankAccountsSubject.next([...currentAccounts, newAccount]);

    return new Observable(observer => {
      observer.next(newAccount);
      observer.complete();
    });
  }

  private generateId(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 7);
    return `BA-${timestamp.slice(-6)}-${random.toUpperCase()}`;
  }
}
