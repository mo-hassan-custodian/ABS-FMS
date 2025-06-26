import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged, startWith, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { AuthorizedFileTransfer, AuthorizedFileTransferFilter } from '../../../../../models/authorized-file-transfer.model';
import { AuthorizedFileTransferService } from '../../../../../services/authorized-file-transfer.service';

@Component({
  selector: 'app-authorized-file-transfer',
  templateUrl: './authorized-file-transfer.component.html',
  styleUrl: './authorized-file-transfer.component.css'
})
export class AuthorizedFileTransferComponent implements OnInit, OnDestroy {
  // Form and data
  searchForm!: FormGroup;
  allTransfers: AuthorizedFileTransfer[] = [];
  filteredTransfers: Observable<AuthorizedFileTransfer[]>;

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
  ) {
    this.filteredTransfers = new Observable<AuthorizedFileTransfer[]>();
  }

  ngOnInit(): void {
    this.initializeSearchForm();
    this.loadTransfers();
    this.setupAutocomplete();

    // Temporary: Clear and regenerate data to fix any issues
    // Remove this after testing
    this.transferService.clearAndRegenerate();
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
      dateTo: ['']
    });
  }

  setupAutocomplete(): void {
    // Set up autocomplete filtering
    this.filteredTransfers = this.searchForm.get('searchTerm')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      map(value => this.filterTransfers(value || ''))
    );
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
          this.toastr.error('Error loading authorized file transfers', 'Error');
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
  }

  onTransferSelected(transfer: AuthorizedFileTransfer): void {
    // Navigate to the view component with the transfer ID
    this.router.navigate(['/App/authorized-file-transfer-view'], {
      queryParams: { id: transfer.id }
    });
  }

  displayTransfer(transfer: AuthorizedFileTransfer): string {
    if (!transfer) return '';
    return `${transfer.voucherNoRef} - ${transfer.narrative} (${this.getTypeLabel(transfer.type)})`;
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
