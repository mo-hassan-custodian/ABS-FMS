import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { AuthorizedFileTransfer } from '../../../../../models/authorized-file-transfer.model';
import { AuthorizedFileTransferService } from '../../../../../services/authorized-file-transfer.service';
import { BankAccount } from '../../../../../models/bank-account.model';

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
  selectedBankAccount: BankAccount | null = null;

  // Modal states
  showAuthorizationModal = false;
  authorizationData: any = null;

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

  // Bank account selection handlers
  onBankAccountSelected(account: BankAccount): void {
    this.selectedBankAccount = account;
    console.log('Bank account selected:', account);
  }

  onBankAccountCleared(): void {
    this.selectedBankAccount = null;
    console.log('Bank account selection cleared');
  }

  // Change bank account action
  changeBankAccount(): void {
    if (!this.selectedBankAccount) {
      this.toastr.warning('Please select a bank account first', 'Warning');
      return;
    }

    this.toastr.success(`Bank account changed to: ${this.selectedBankAccount.name}`, 'Success');
    console.log('Bank account changed to:', this.selectedBankAccount);
    // TODO: Implement actual bank account change logic
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

    // Prepare authorization data and show modal
    this.authorizationData = {
      transfer: this.transfer,
      selectedAccount: this.selectedBankAccount,
      amount: this.formatCurrency(this.transfer.amountPayee, this.transfer.currencyCode)
    };
    this.showAuthorizationModal = true;
  }

  // Confirm authorization
  confirmAuthorization(): void {
    if (this.authorizationData) {
      this.toastr.success('Payment authorized successfully!', 'Authorized');
      console.log('Payment authorized for:', this.authorizationData.transfer, 'from account:', this.authorizationData.selectedAccount);
      // TODO: Implement actual authorization logic
      this.closeAuthorizationModal();
    }
  }

  // Close authorization modal
  closeAuthorizationModal(): void {
    this.showAuthorizationModal = false;
    this.authorizationData = null;
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
