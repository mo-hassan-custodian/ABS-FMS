import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { AuthorizedFileTransfer, AuthorizedFileTransferFilter } from '../../../../../models/authorized-file-transfer.model';
import { AuthorizedFileTransferService } from '../../../../../services/authorized-file-transfer.service';

@Component({
  selector: 'app-authorized-file-transfer',
  templateUrl: './authorized-file-transfer.component.html',
  styleUrl: './authorized-file-transfer.component.css'
})
export class AuthorizedFileTransferComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Form and data
  searchForm!: FormGroup;
  allTransfers: AuthorizedFileTransfer[] = [];
  searchResults = new MatTableDataSource<AuthorizedFileTransfer>([]);
  searchPerformed = false;

  // Table configuration
  displayedColumns: string[] = ['voucherNoRef', 'type', 'payee', 'narrative', 'amount', 'date', 'actions'];

  // Filter options
  typeOptions = [
    { value: 'ALL', label: 'All Types' },
    { value: 'CLAIMS', label: 'Claims' },
    { value: 'COMMISSIONS', label: 'Commissions' },
    { value: 'POLICY_MATURITY', label: 'Policy Maturity' }
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

    // Temporary: Clear and regenerate data to fix any issues
    // Remove this after testing
    this.transferService.clearAndRegenerate();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    this.searchResults.paginator = this.paginator;
  }

  initializeSearchForm(): void {
    this.searchForm = this.formBuilder.group({
      searchTerm: [''],
      type: ['ALL'],
      dateFrom: [''],
      dateTo: ['']
    });
  }

  performSearch(): void {
    this.isLoading = true;
    this.searchPerformed = true;

    const formValue = this.searchForm.value;
    const searchTerm = formValue.searchTerm?.trim().toLowerCase() || '';

    // Filter transfers based on search criteria
    let filtered = [...this.allTransfers];

    // Apply payee name filter
    if (searchTerm) {
      filtered = filtered.filter(transfer =>
        transfer.payee && transfer.payee.toLowerCase().includes(searchTerm) || transfer.narrative && transfer.narrative.toLowerCase().includes(searchTerm)
      );
    }

    // Apply type filter
    if (formValue.type && formValue.type !== 'ALL') {
      filtered = filtered.filter(transfer => transfer.type === formValue.type);
    }

    // Apply date range filter
    if (formValue.dateFrom) {
      const dateFrom = new Date(formValue.dateFrom);
      filtered = filtered.filter(transfer => transfer.date >= dateFrom);
    }
    if (formValue.dateTo) {
      const dateTo = new Date(formValue.dateTo);
      filtered = filtered.filter(transfer => transfer.date <= dateTo);
    }

    // Simulate API call delay
    setTimeout(() => {
      this.searchResults.data = filtered;
      this.isLoading = false;

      if (filtered.length === 0 && searchTerm) {
        this.toastr.info(`No transfers found for payee "${formValue.searchTerm}"`, 'Search Results');
      } else if (filtered.length > 0) {
        this.toastr.success(`Found ${filtered.length} payment(s)`, 'Search Results');
      }
    }, 500);
  }

  loadTransfers(): void {
    this.isLoading = true;
    this.transferService.getAllTransfers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (transfers) => {
          this.allTransfers = transfers;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading transfers:', error);
          this.toastr.error('Error loading payments', 'Error');
          this.isLoading = false;
        }
      });
  }

  filterTransfers(searchValue: string): AuthorizedFileTransfer[] {
    if (!searchValue.trim()) {
      return [];
    }

    const formValue = this.searchForm.value;
    let filtered = [...this.allTransfers];

    // Apply search term filter
    const searchTerm = searchValue.toLowerCase();
    console.log('Search term:', searchTerm, 'Total transfers:', this.allTransfers.length);

    filtered = filtered.filter(transfer =>
      transfer.remarks.toLowerCase().includes(searchTerm) ||
      transfer.voucherNoRef.toLowerCase().includes(searchTerm) ||
      transfer.narrative.toLowerCase().includes(searchTerm) ||
      transfer.bankAccount.toLowerCase().includes(searchTerm) ||
      transfer.authorisedBy.toLowerCase().includes(searchTerm) ||
      transfer.preparedBy.toLowerCase().includes(searchTerm) ||
      transfer.document.toLowerCase().includes(searchTerm) ||
      (transfer.payee && transfer.payee.toLowerCase().includes(searchTerm))
    );

    console.log('Filtered results:', filtered.length);

    // Apply type filter
    if (formValue.type && formValue.type !== 'ALL') {
      filtered = filtered.filter(transfer => transfer.type === formValue.type);
    }

    // Apply date range filter
    if (formValue.dateFrom) {
      const dateFrom = new Date(formValue.dateFrom);
      filtered = filtered.filter(transfer => transfer.date >= dateFrom);
    }
    if (formValue.dateTo) {
      const dateTo = new Date(formValue.dateTo);
      filtered = filtered.filter(transfer => transfer.date <= dateTo);
    }

    return filtered;
  }

  clearFilters(): void {
    this.searchForm.reset({
      searchTerm: '',
      type: 'ALL',
      dateFrom: '',
      dateTo: ''
    });
    this.searchResults.data = [];
    this.searchPerformed = false;
  }

  viewTransfer(transfer: AuthorizedFileTransfer): void {
    // Navigate to the view component with the transfer ID
    this.router.navigate(['/App/authorized-file-transfer-view'], {
      queryParams: { id: transfer.id }
    });
  }



  getTypeLabel(type: string): string {
    switch (type) {
      case 'CLAIMS':
        return 'Claims';
      case 'COMMISSIONS':
        return 'Commissions';
      case 'POLICY_MATURITY':
        return 'Policy Maturity';
      default:
        return type;
    }
  }

  formatCurrency(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  }
}
