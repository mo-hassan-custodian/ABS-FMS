import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
  BankAccount,
  BankAccountFilter,
  BankAccountsResponse,
} from '../models/bank-account.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BankAccountService {
  private readonly API_BASE_URL = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  // GET /api/Memo/bank-accounts - get all bank accounts from API
  getAllBankAccounts(): Observable<BankAccount[]> {
    return this.getBankAccounts();
  }

  // GET /api/Memo/bank-accounts - get all bank accounts from API
  getBankAccounts(): Observable<BankAccount[]> {
    const apiUrl = `${this.API_BASE_URL}/api/Memo/bank-accounts`;
    console.log('Fetching bank accounts from:', apiUrl);

    return this.http.get<BankAccountsResponse>(apiUrl).pipe(
      map((response) => {
        if (response.isSuccess) {
          console.log(
            'Bank accounts fetched successfully:',
            response.data.length,
            'accounts'
          );
          // Transform the API data to include missing fields
          return response.data.map((account) =>
            this.transformBankAccount(account)
          );
        } else {
          console.error('API returned error:', response.message);
          throw new Error(response.message || 'Failed to fetch bank accounts');
        }
      }),
      catchError((error) => {
        console.error('Error fetching bank accounts:', error);
        // Return empty array as fallback
        return of([]);
      })
    );
  }

  // Get active bank accounts only
  getActiveBankAccounts(): Observable<BankAccount[]> {
    return this.getBankAccounts().pipe(
      map((accounts) =>
        accounts.filter((account) => account.status === 'Active')
      )
    );
  }

  // Get bank account by ID
  getBankAccountById(id: string): Observable<BankAccount | undefined> {
    return this.getBankAccounts().pipe(
      map((accounts) => accounts.find((account) => account.id === id))
    );
  }

  // Search bank accounts with filters
  searchBankAccounts(filter: BankAccountFilter): Observable<BankAccount[]> {
    return this.getBankAccounts().pipe(
      map((accounts) => {
        let filtered = accounts;

        // Filter by search term
        if (filter.searchTerm && filter.searchTerm.trim()) {
          const searchTerm = filter.searchTerm.toLowerCase();
          filtered = filtered.filter(
            (account) =>
              account.name.toLowerCase().includes(searchTerm) ||
              account.accountNumber.includes(searchTerm) ||
              account.bankName.toLowerCase().includes(searchTerm) ||
              (account.bankBranch &&
                account.bankBranch.toLowerCase().includes(searchTerm)) ||
              (account.description &&
                account.description.toLowerCase().includes(searchTerm))
          );
        }

        // Filter by account type
        if (filter.accountType && filter.accountType !== 'ALL') {
          filtered = filtered.filter(
            (account) => account.accountType === filter.accountType
          );
        }

        // Filter by bank name
        if (filter.bankName && filter.bankName !== 'ALL') {
          filtered = filtered.filter(
            (account) => account.bankName === filter.bankName
          );
        }

        // Filter by currency
        if (filter.currency && filter.currency !== 'ALL') {
          filtered = filtered.filter(
            (account) => account.currency === filter.currency
          );
        }

        // Filter by status
        if (filter.status && filter.status !== 'ALL') {
          filtered = filtered.filter(
            (account) => account.status === filter.status
          );
        }

        return filtered;
      })
    );
  }

  /**
   * Transform API bank account data to include missing fields
   * Extracts account type from the name field and adds default values
   */
  private transformBankAccount(account: BankAccount): BankAccount {
    // Extract account type from the name field (e.g., "Account Name - 123456 (Current)")
    const accountTypeMatch = account.name.match(/\(([^)]+)\)$/);
    const accountType = accountTypeMatch ? accountTypeMatch[1] : 'Current';

    return {
      ...account,
      id: account.accountNumber, // Use account number as ID
      accountType: this.mapAccountType(accountType),
      status: 'Active', // Default to Active since API doesn't provide status
      currency: 'NGN', // Default currency
      bankBranch: 'Main Branch', // Default branch
      createdDate: new Date(),
    };
  }

  /**
   * Map account type string to the expected enum values
   */
  private mapAccountType(
    type: string
  ): 'Current' | 'Savings' | 'Investment' | 'Fixed Deposit' {
    const normalizedType = type.toLowerCase();

    if (normalizedType.includes('current')) return 'Current';
    if (normalizedType.includes('savings')) return 'Savings';
    if (normalizedType.includes('investment')) return 'Investment';
    if (normalizedType.includes('fixed')) return 'Fixed Deposit';

    return 'Current'; // Default fallback
  }
}
