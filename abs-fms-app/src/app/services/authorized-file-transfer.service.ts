import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
  AuthorizedFileTransfer,
  AuthorizedFileTransferStats,
  AuthorizedFileTransferFilter,
  AuthorizedPaymentRequest,
  PaginatedAuthorizationResponse,
} from '../models/authorized-file-transfer.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthorizedFileTransferService {
  private readonly API_BASE_URL = environment.apiBaseUrl;
  private transfersSubject = new BehaviorSubject<AuthorizedFileTransfer[]>([]);
  public transfers$ = this.transfersSubject.asObservable();

  constructor(private http: HttpClient) {
    // No longer using localStorage - all data comes from API
  }

  // All data now comes from API - no localStorage needed

  // All data now comes from API - no sample data needed

  /**
   * GET /api/Authorization with pagination and search parameters
   *
   * @param pageNumber Page number to retrieve (1-based)
   * @param pageSize Number of records per page
   * @param id Optional ID to filter by
   * @param startDate Optional start date to filter by
   * @param endDate Optional end date to filter by
   * @param payee Optional payee name to filter by
   * @param type Optional payment type to filter by (new parameter added to the API)
   * @returns Observable of paginated authorization response
   */
  getAllTransfers(
    pageNumber: number = 1,
    pageSize: number = 10,
    id?: string,
    startDate?: Date,
    endDate?: Date,
    payee?: string,
    type?: string
  ): Observable<PaginatedAuthorizationResponse> {
    let params = new HttpParams()
      .set('PageNumber', pageNumber.toString())
      .set('PageSize', pageSize.toString());

    if (id) params = params.set('Id', id);
    if (startDate) params = params.set('StartDate', startDate.toISOString());
    if (endDate) params = params.set('EndDate', endDate.toISOString());
    if (payee) params = params.set('Payee', payee);
    if (type) params = params.set('Type', type);

    const apiUrl = `${this.API_BASE_URL}/api/Authorization/GetAll`;
    console.log('Fetching paginated transfers from:', apiUrl, {
      params: params.toString(),
    });

    return this.http
      .get<PaginatedAuthorizationResponse>(apiUrl, { params })
      .pipe(
        map((response) => {
          console.log(
            'API call successful, received:',
            response.totalRecords,
            'total records'
          );
          // Update local subject with current page data
          this.transfersSubject.next(response.records);
          return response;
        }),
        catchError((error) => {
          console.error('API call failed:', {
            url: apiUrl,
            status: error.status,
            message: error.message,
            error: error,
          });

          // Return empty paginated response
          return of({
            pageNumber: pageNumber,
            pageSize: pageSize,
            totalRecords: 0,
            totalPages: 0,
            records: [],
          });
        })
      );
  }

  // GET /api/Authorization - search by type only (uses unified endpoint with Type parameter)
  // Note: This method now uses the main /api/Authorization endpoint instead of the deprecated /api/Authorization/GetAll
  getAllTransfersByType(type?: string): Observable<AuthorizedFileTransfer[]> {
    let params = new HttpParams()
      .set('PageNumber', '1')
      .set('PageSize', '1000'); // Large page size to get all records

    if (type) params = params.set('Type', type);

    const apiUrl = `${this.API_BASE_URL}/api/Authorization`;

    return this.http
      .get<PaginatedAuthorizationResponse>(apiUrl, { params })
      .pipe(
        map((response) => {
          // Update local subject with API data
          this.transfersSubject.next(response.records);
          return response.records;
        }),
        catchError((error) => {
          console.error('API call failed:', {
            url: apiUrl,
            status: error.status,
            message: error.message,
            error: error,
          });

          // Return empty array
          return of([]);
        })
      );
  }

  // GET /api/Authorization/{id}
  getTransferById(id: string): Observable<AuthorizedFileTransfer | undefined> {
    const apiUrl = `${this.API_BASE_URL}/api/Authorization/${id}`;

    return this.http.get<AuthorizedFileTransfer>(apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching transfer by ID from API:', error);
        return of(undefined);
      })
    );
  }

  // GET /api/Authorization/GetAuthorizedByid - get authorized payment by ID
  getAuthorizedById(
    id: string
  ): Observable<AuthorizedFileTransfer | undefined> {
    let params = new HttpParams().set('id', id);
    const apiUrl = `${this.API_BASE_URL}/api/Authorization/GetAuthorizedByid`;

    return this.http.get<AuthorizedFileTransfer>(apiUrl, { params }).pipe(
      catchError((error) => {
        console.error(
          'Error fetching authorized payment by ID from API:',
          error
        );
        return of(undefined);
      })
    );
  }

  // POST /api/Authorization/AuthorizedPayment - authorize payment from payment summary
  authorizePayment(request: AuthorizedPaymentRequest): Observable<any> {
    const apiUrl = `${this.API_BASE_URL}/api/Authorization/AuthorizedPayment`;

    return this.http.post<any>(apiUrl, request).pipe(
      catchError((error) => {
        console.error('Error authorizing payment:', error);
        throw error;
      })
    );
  }

  searchTransfers(
    filter: AuthorizedFileTransferFilter
  ): Observable<AuthorizedFileTransfer[]> {
    // Use the main endpoint with pagination and search parameters
    let params = new HttpParams()
      .set('PageNumber', '1')
      .set('PageSize', '1000'); // Large page size to get all matching records

    // Map search term to Payee parameter for searching
    if (filter.searchTerm && filter.searchTerm.trim()) {
      params = params.set('Payee', filter.searchTerm.trim());
    }

    // Map type to Type parameter
    if (filter.type && filter.type !== 'ALL') {
      params = params.set('Type', filter.type);
    }

    // Map date filters to StartDate and EndDate
    if (filter.dateFrom) {
      params = params.set('StartDate', filter.dateFrom.toISOString());
    }

    if (filter.dateTo) {
      params = params.set('EndDate', filter.dateTo.toISOString());
    }

    return this.http
      .get<PaginatedAuthorizationResponse>(
        `${this.API_BASE_URL}/api/Authorization`,
        { params }
      )
      .pipe(
        map((response) => response.records),
        catchError((error) => {
          console.error('Error searching transfers from API:', error);
          // Fallback to local filtering
          return this.transfers$.pipe(
            map((transfers) => {
              let filtered = [...transfers];

              // Apply search term filter
              if (filter.searchTerm && filter.searchTerm.trim()) {
                const searchTerm = filter.searchTerm.toLowerCase();
                filtered = filtered.filter(
                  (transfer) =>
                    transfer.remarks.toLowerCase().includes(searchTerm) ||
                    transfer.voucherNoRef.toLowerCase().includes(searchTerm) ||
                    transfer.narrative.toLowerCase().includes(searchTerm) ||
                    transfer.bankAccount.toLowerCase().includes(searchTerm) ||
                    transfer.authorisedBy.toLowerCase().includes(searchTerm) ||
                    transfer.preparedBy.toLowerCase().includes(searchTerm) ||
                    transfer.document.toLowerCase().includes(searchTerm) ||
                    transfer.payee.toLowerCase().includes(searchTerm)
                );
              }

              // Apply type filter
              if (filter.type && filter.type !== 'ALL') {
                filtered = filtered.filter(
                  (transfer) => transfer.type === filter.type
                );
              }

              // Apply date range filter
              if (filter.dateFrom) {
                filtered = filtered.filter(
                  (transfer) => transfer.date >= filter.dateFrom!
                );
              }
              if (filter.dateTo) {
                filtered = filtered.filter(
                  (transfer) => transfer.date <= filter.dateTo!
                );
              }

              return filtered;
            })
          );
        })
      );
  }

  getTransferStats(): Observable<AuthorizedFileTransferStats> {
    return this.transfers$.pipe(
      map((transfers) => ({
        total: transfers.length,
        byType: {
          policySurrender: transfers.filter(
            (t) => t.type === 'POLICY_SURRENDER'
          ).length,
          partialMaturities: transfers.filter(
            (t) => t.type === 'PARTIAL_MATURITIES'
          ).length,
          fullMaturities: transfers.filter((t) => t.type === 'FULL_MATURITIES')
            .length,
          investmentMaturities: transfers.filter(
            (t) => t.type === 'INVESTMENT_MATURITIES'
          ).length,
          policyLoan: transfers.filter((t) => t.type === 'POLICY_LOAN').length,
          policyTermination: transfers.filter(
            (t) => t.type === 'POLICY_TERMINATION'
          ).length,
          partialWithdrawal: transfers.filter(
            (t) => t.type === 'PARTIAL_WITHDRAWAL'
          ).length,
          annuityMaturities: transfers.filter(
            (t) => t.type === 'ANNUITY_MATURITIES'
          ).length,
          deathClaim: transfers.filter((t) => t.type === 'DEATH_CLAIM').length,
          commission: transfers.filter((t) => t.type === 'COMMISSION').length,
          policyCancellation: transfers.filter(
            (t) => t.type === 'POLICY_CANCELLATION'
          ).length,
        },
      }))
    );
  }

  // Get all authorized payments using the API
  getAuthorizedPayments(): Observable<AuthorizedFileTransfer[]> {
    // Use the main endpoint with a large page size to get all records
    return this.getAllTransfers(1, 1000).pipe(
      map((response) => response.records)
    );
  }

  // Convenience method to search transfers with all available parameters
  searchTransfersWithParams(
    pageNumber: number = 1,
    pageSize: number = 10,
    searchParams: {
      id?: string;
      startDate?: Date;
      endDate?: Date;
      payee?: string;
      type?: string;
    } = {}
  ): Observable<PaginatedAuthorizationResponse> {
    return this.getAllTransfers(
      pageNumber,
      pageSize,
      searchParams.id,
      searchParams.startDate,
      searchParams.endDate,
      searchParams.payee,
      searchParams.type
    );
  }

  updateTransfer(
    id: string,
    updates: Partial<AuthorizedFileTransfer>
  ): Observable<AuthorizedFileTransfer> {
    return this.http
      .put<AuthorizedFileTransfer>(
        `${this.API_BASE_URL}/api/Authorization/${id}`,
        updates
      )
      .pipe(
        map((updatedTransfer) => {
          // Update local data
          const currentTransfers = this.transfersSubject.value;
          const index = currentTransfers.findIndex((t) => t.id === id);
          if (index !== -1) {
            currentTransfers[index] = updatedTransfer;
            this.transfersSubject.next([...currentTransfers]);
          }
          return updatedTransfer;
        }),
        catchError((error) => {
          console.error('Error updating transfer via API:', error);
          // Fallback to local update
          const currentTransfers = this.transfersSubject.value;
          const index = currentTransfers.findIndex((t) => t.id === id);
          if (index !== -1) {
            const updatedTransfer = { ...currentTransfers[index], ...updates };
            currentTransfers[index] = updatedTransfer;
            this.transfersSubject.next([...currentTransfers]);
            // No longer using localStorage
            return of(updatedTransfer);
          }
          throw error;
        })
      );
  }

  // Delete transfer
  deleteTransfer(id: string): Observable<boolean> {
    return this.http
      .delete<boolean>(`${this.API_BASE_URL}/api/Authorization/${id}`)
      .pipe(
        map(() => {
          // Update local data
          const currentTransfers = this.transfersSubject.value;
          const filteredTransfers = currentTransfers.filter((t) => t.id !== id);
          this.transfersSubject.next(filteredTransfers);
          return true;
        }),
        catchError((error) => {
          console.error('Error deleting transfer via API:', error);
          // Fallback to local deletion
          const currentTransfers = this.transfersSubject.value;
          const filteredTransfers = currentTransfers.filter((t) => t.id !== id);
          this.transfersSubject.next(filteredTransfers);
          // No longer using localStorage
          return of(true);
        })
      );
  }
}
