import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';

import {
  AuthorizedFileTransfer,
  PaginatedAuthorizationResponse,
} from '../../../../../models/authorized-file-transfer.model';
import { AuthorizedFileTransferService } from '../../../../../services/authorized-file-transfer.service';

@Component({
    selector: 'app-authorized-file-transfer',
    templateUrl: './authorized-file-transfer.component.html',
    styleUrl: './authorized-file-transfer.component.css',
    standalone: false
})
export class AuthorizedFileTransferComponent implements OnInit, OnDestroy {
  // Form and data
  searchForm!: FormGroup;
  allTransfers: AuthorizedFileTransfer[] = [];
  searchResults = new MatTableDataSource<AuthorizedFileTransfer>([]);
  searchPerformed = false;

  // Pagination properties
  currentPage = 1;
  pageSize = 10;
  totalRecords = 0;
  totalPages = 0;

  // Table configuration
  displayedColumns: string[] = [
    'voucherNoRef',
    'type',
    'payee',
    'narrative',
    'amount',
    'date',
    'actions',
  ];

  // Filter options
  typeOptions = [
    { value: 'ALL', label: 'All Types' },
    { value: 'POLICY_SURRENDER', label: 'Policy surrender' },
    { value: 'PARTIAL_MATURITIES', label: 'Partial Maturities' },
    { value: 'FULL_MATURITIES', label: 'Full Maturities' },
    { value: 'INVESTMENT_MATURITIES', label: 'Investment Maturities' },
    { value: 'POLICY_LOAN', label: 'Policy Loan' },
    { value: 'POLICY_TERMINATION', label: 'Policy termination' },
    { value: 'PARTIAL_WITHDRAWAL', label: 'Partial Withdrawal' },
    { value: 'ANNUITY_MATURITIES', label: 'Annuity Maturities' },
    { value: 'DEATH_CLAIM', label: 'Death Claim' },
    { value: 'COMMISSION', label: 'Commission' },
    { value: 'POLICY_CANCELLATION', label: 'Policy cancellation' },
  ];

  // Loading states
  isLoading = false;

  // Destroy subject for cleanup
  private destroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private transferService: AuthorizedFileTransferService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeSearchForm();
    this.loadTransfers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initializeSearchForm(): void {
    this.searchForm = this.formBuilder.group({
      searchTerm: [''],
      type: ['ALL'],
      dateFrom: [''],
      dateTo: [''],
    });
  }

  performSearch(): void {
    this.isLoading = true;
    this.searchPerformed = true;

    const formValue = this.searchForm.value;
    const searchTerm = formValue.searchTerm?.trim() || '';
    const type =
      formValue.type && formValue.type !== 'ALL' ? formValue.type : undefined;
    const dateFrom = formValue.dateFrom
      ? new Date(formValue.dateFrom)
      : undefined;
    const dateTo = formValue.dateTo ? new Date(formValue.dateTo) : undefined;

    // Use the unified getAllTransfers method with all search parameters including Type
    this.searchWithAllParameters(searchTerm, type, dateFrom, dateTo);
  }

  private searchWithAllParameters(
    payee?: string,
    type?: string,
    dateFrom?: Date,
    dateTo?: Date
  ): void {
    this.transferService
      .getAllTransfers(1, 100, undefined, dateFrom, dateTo, payee, type) // Now includes type parameter
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: PaginatedAuthorizationResponse) => {
          // No need to filter by type anymore since the API now handles it
          const filtered = response.records;

          this.searchResults.data = filtered;
          this.isLoading = false;

          if (filtered.length === 0) {
            this.toastr.info(
              'No transfers found matching your criteria',
              'Search Results'
            );
          } else {
            this.toastr.success(
              `Found ${filtered.length} payment(s)`,
              'Search Results'
            );
          }
        },
        error: (error) => {
          console.error('Error searching transfers:', error);
          this.toastr.error('Error searching payments', 'Error');
          this.isLoading = false;
        },
      });
  }

  loadTransfers(page: number = 1): void {
    this.isLoading = true;
    this.currentPage = page;

    this.transferService
      .getAllTransfers(this.currentPage, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: PaginatedAuthorizationResponse) => {
          this.allTransfers = response.records;
          this.totalRecords = response.totalRecords;
          this.totalPages = response.totalPages;
          this.currentPage = response.pageNumber;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading transfers:', error);
          this.toastr.error('Error loading payments', 'Error');
          this.isLoading = false;
        },
      });
  }

  // Pagination methods
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.loadTransfers(page);
    }
  }

  goToFirstPage(): void {
    this.goToPage(1);
  }

  goToLastPage(): void {
    this.goToPage(this.totalPages);
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  clearFilters(): void {
    this.searchForm.reset({
      searchTerm: '',
      type: 'ALL',
      dateFrom: '',
      dateTo: '',
    });
    this.searchResults.data = [];
    this.searchPerformed = false;
    // Reload the first page of data
    this.loadTransfers(1);
  }

  viewTransfer(transfer: AuthorizedFileTransfer): void {
    // Navigate to the view component with the transfer ID
    this.router.navigate(['/App/authorized-file-transfer-view'], {
      queryParams: { id: transfer.id },
    });
  }

  getTypeLabel(type: string): string {
    switch (type) {
      case 'POLICY_SURRENDER':
        return 'Policy surrender';
      case 'PARTIAL_MATURITIES':
        return 'Partial Maturities';
      case 'FULL_MATURITIES':
        return 'Full Maturities';
      case 'INVESTMENT_MATURITIES':
        return 'Investment Maturities';
      case 'POLICY_LOAN':
        return 'Policy Loan';
      case 'POLICY_TERMINATION':
        return 'Policy termination';
      case 'PARTIAL_WITHDRAWAL':
        return 'Partial Withdrawal';
      case 'ANNUITY_MATURITIES':
        return 'Annuity Maturities';
      case 'DEATH_CLAIM':
        return 'Death Claim';
      case 'COMMISSION':
        return 'Commission';
      case 'POLICY_CANCELLATION':
        return 'Policy cancellation';
      default:
        return type;
    }
  }

  formatCurrency(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  }
}
