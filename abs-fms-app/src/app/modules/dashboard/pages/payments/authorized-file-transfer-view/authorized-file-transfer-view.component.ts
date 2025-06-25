import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { AuthorizedFileTransfer } from '../../../../../models/authorized-file-transfer.model';
import { AuthorizedFileTransferService } from '../../../../../services/authorized-file-transfer.service';

@Component({
  selector: 'app-authorized-file-transfer-view',
  templateUrl: './authorized-file-transfer-view.component.html',
  styleUrl: './authorized-file-transfer-view.component.css'
})
export class AuthorizedFileTransferViewComponent implements OnInit, OnDestroy {
  transfer: AuthorizedFileTransfer | null = null;
  isLoading = false;
  transferId: string | null = null;

  // Bank account selection
  selectedBankAccount: string = '';
  bankAccounts = [
    { value: 'operating-001', label: 'Operating Account - 1234567890' },
    { value: 'claims-002', label: 'Claims Settlement Account - 1234567890' },
    { value: 'commission-003', label: 'Commission Payment Account - 9876543210' },
    { value: 'benefits-004', label: 'Policy Benefits Account - 5555666677' },
    { value: 'reserve-005', label: 'Reserve Account - 1111222233' },
    { value: 'investment-006', label: 'Investment Account - 4444555566' }
  ];

  // Destroy subject for cleanup
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private transferService: AuthorizedFileTransferService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.transferId = params['id'];
        if (this.transferId) {
          this.loadTransferDetails();
        } else {
          this.toastr.error('No transfer ID provided', 'Error');
          this.goBack();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTransferDetails(): void {
    if (!this.transferId) return;

    this.isLoading = true;
    this.transferService.getTransferById(this.transferId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (transfer) => {
          if (transfer) {
            this.transfer = transfer;
          } else {
            this.toastr.error('Transfer not found', 'Error');
            this.goBack();
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading transfer details:', error);
          this.toastr.error('Error loading transfer details', 'Error');
          this.isLoading = false;
          this.goBack();
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/App/authorized-file-transfer']);
  }

  // Bank account change handler
  onBankAccountChange(event: any): void {
    this.selectedBankAccount = event.value;
    console.log('Bank account changed to:', event.value);
  }

  // Change bank account action
  changeBankAccount(): void {
    if (!this.selectedBankAccount) {
      this.toastr.warning('Please select a bank account first', 'Warning');
      return;
    }

    const selectedAccount = this.bankAccounts.find(account => account.value === this.selectedBankAccount);
    if (selectedAccount) {
      this.toastr.success(`Bank account changed to: ${selectedAccount.label}`, 'Success');
      console.log('Bank account changed to:', selectedAccount);
      // TODO: Implement actual bank account change logic
    }
  }

  // Authorize payment action
  authorizePayment(): void {
    if (!this.selectedBankAccount) {
      this.toastr.warning('Please select a bank account first', 'Warning');
      return;
    }

    if (!this.transfer) {
      this.toastr.error('No transfer data available', 'Error');
      return;
    }

    const selectedAccount = this.bankAccounts.find(account => account.value === this.selectedBankAccount);
    if (selectedAccount) {
      // Show confirmation dialog or implement authorization logic
      const confirmMessage = `Are you sure you want to authorize payment of ${this.formatCurrency(this.transfer.amountPayee, this.transfer.currencyCode)} from ${selectedAccount.label}?`;

      if (confirm(confirmMessage)) {
        this.toastr.success('Payment authorized successfully!', 'Authorized');
        console.log('Payment authorized for:', this.transfer, 'from account:', selectedAccount);
        // TODO: Implement actual authorization logic
      }
    }
  }

  // Go to Update EFTs action
  goToUpdateEFTs(): void {
    this.toastr.info('Navigating to Update EFTs...', 'Info');
    console.log('Navigate to Update EFTs for transfer:', this.transfer);
    // TODO: Implement navigation to Update EFTs component
    // this.router.navigate(['/App/update-efts'], { queryParams: { transferId: this.transferId } });
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
