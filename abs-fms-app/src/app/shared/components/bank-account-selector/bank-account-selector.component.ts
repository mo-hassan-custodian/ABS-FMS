import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import {
  startWith,
  debounceTime,
  distinctUntilChanged,
  map,
  takeUntil,
} from 'rxjs/operators';
import { FormControl } from '@angular/forms';

import {
  BankAccount,
  BankAccountFilter,
} from '../../../models/bank-account.model';
import { BankAccountService } from '../../../services/bank-account.service';

@Component({
    selector: 'app-bank-account-selector',
    templateUrl: './bank-account-selector.component.html',
    styleUrls: ['./bank-account-selector.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => BankAccountSelectorComponent),
            multi: true,
        },
    ],
    standalone: false
})
export class BankAccountSelectorComponent
  implements OnInit, OnDestroy, ControlValueAccessor
{
  @Input() placeholder: string = 'Select Bank Account';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() multiple: boolean = false;
  @Input() appearance: 'fill' | 'outline' = 'outline';
  @Input() label: string = 'Bank Account';
  @Input() showBalance: boolean = false;
  @Input() filterByStatus: string = 'Active';
  @Input() filterByCurrency: string = '';
  @Input() filterByAccountType: string = '';
  @Input() showAccountNumber: boolean = true;
  @Input() showBankName: boolean = true;
  @Input() showDescription: boolean = false;

  @Output() accountSelected = new EventEmitter<BankAccount>();
  @Output() accountCleared = new EventEmitter<void>();
  @Output() searchChanged = new EventEmitter<string>();
  @Output() validationStateChanged = new EventEmitter<boolean>();

  // Form control for the autocomplete
  searchControl = new FormControl<string | BankAccount | null>('');

  // Data properties
  allBankAccounts: BankAccount[] = [];
  filteredBankAccounts: Observable<BankAccount[]>;
  selectedAccount: BankAccount | null = null;
  isLoading = false;

  // Validation properties
  isValidAccount = true;
  validationErrorMessage = '';

  // ControlValueAccessor properties
  private onChange = (_value: any) => {};
  private onTouched = () => {};

  // Destroy subject for cleanup
  private destroy$ = new Subject<void>();

  constructor(private bankAccountService: BankAccountService) {
    this.filteredBankAccounts = new Observable<BankAccount[]>();
  }

  ngOnInit(): void {
    this.loadBankAccounts();
    this.setupAutocomplete();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadBankAccounts(): void {
    this.isLoading = true;

    // Apply initial filters
    const filter: BankAccountFilter = {
      status: this.filterByStatus || undefined,
      currency: this.filterByCurrency || undefined,
      accountType: this.filterByAccountType || undefined,
    };

    this.bankAccountService
      .searchBankAccounts(filter)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (accounts) => {
          this.allBankAccounts = accounts;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading bank accounts:', error);
          this.isLoading = false;
        },
      });
  }

  private setupAutocomplete(): void {
    this.filteredBankAccounts = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      map((value: string | BankAccount | null) => {
        // If value is a BankAccount object, don't filter (user selected from dropdown)
        if (value && typeof value === 'object' && 'id' in value) {
          return this.allBankAccounts;
        }

        const filterValue = typeof value === 'string' ? value : '';

        // Emit search change event
        this.searchChanged.emit(filterValue);

        // Validate the typed text for account number format
        this.validateTypedText(filterValue);

        // If user is typing and it doesn't match selected account, clear selection
        if (
          typeof value === 'string' &&
          this.selectedAccount &&
          value.trim().length > 0
        ) {
          const displayText = this.displayAccountName(this.selectedAccount);
          if (value !== displayText) {
            // User has modified the text, clear the selected account but keep the text
            this.selectedAccount = null;
            this.onChange(null);
            this.accountCleared.emit();
          }
        }

        return this.filterAccounts(filterValue);
      })
    );
  }

  private filterAccounts(filterValue: string): BankAccount[] {
    if (!filterValue.trim()) {
      return this.allBankAccounts;
    }

    const searchTerm = filterValue.toLowerCase();
    return this.allBankAccounts.filter(
      (account) =>
        account.name.toLowerCase().includes(searchTerm) ||
        account.accountNumber.includes(searchTerm) ||
        account.bankName.toLowerCase().includes(searchTerm) ||
        account.accountName?.toLowerCase().includes(searchTerm) ||
        account.bankBranch?.toLowerCase().includes(searchTerm) ||
        (account.description &&
          account.description.toLowerCase().includes(searchTerm))
    );
  }

  onAccountSelected(account: BankAccount): void {
    this.selectedAccount = account;
    this.searchControl.setValue(account, { emitEvent: false });

    // Validate the selected account
    this.validateAccount(account);

    this.onChange(account);
    this.onTouched();
    this.accountSelected.emit(account);
  }

  clearSelection(): void {
    this.selectedAccount = null;
    this.searchControl.setValue('', { emitEvent: false });

    // Reset validation state
    this.resetValidation();

    this.onChange(null);
    this.onTouched();
    this.accountCleared.emit();
  }

  displayAccountName(account: BankAccount | null): string {
    if (!account || !account.bankName || !account.accountNumber) return '';
    return `${account.bankName} - ${account.accountNumber}`;
  }

  getAccountDisplayText(account: BankAccount): string {
    let displayText = account.name;

    if (this.showAccountNumber) {
      displayText += ` - ${account.accountNumber}`;
    }

    if (this.showBankName) {
      displayText += ` (${account.bankName})`;
    }

    return displayText;
  }

  getAccountSubText(account: BankAccount): string {
    let subText = '';

    if (this.showDescription && account.description) {
      subText = account.description;
    } else {
      // Build subtext from available fields
      const parts = [];
      if (account.accountType) parts.push(account.accountType);
      if (account.bankBranch) parts.push(account.bankBranch);
      subText = parts.join(' • ') || account.accountName || '';
    }

    if (this.showBalance && account.balance !== undefined && account.currency) {
      const formattedBalance = this.formatCurrency(
        account.balance,
        account.currency
      );
      subText += ` • Balance: ${formattedBalance}`;
    }

    return subText;
  }

  formatCurrency(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  }

  trackByAccountId(_index: number, account: BankAccount): string {
    return account.id || account.accountNumber;
  }

  shouldShowNoResults(): boolean {
    const value = this.searchControl.value;
    return typeof value === 'string' && value.length > 0;
  }

  // ControlValueAccessor implementation
  writeValue(value: BankAccount | null): void {
    if (value) {
      this.selectedAccount = value;
      this.searchControl.setValue(value, { emitEvent: false });
    } else {
      this.clearSelection();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (isDisabled) {
      this.searchControl.disable();
    } else {
      this.searchControl.enable();
    }
  }

  // Validation methods
  private validateAccount(account: BankAccount): void {
    if (!account || !account.accountNumber) {
      this.setValidationState(false, 'Invalid account selected');
      return;
    }

    // Check if account number has exactly 10 digits
    const accountNumber = account.accountNumber.replace(/\D/g, ''); // Remove non-digits
    if (accountNumber.length !== 10) {
      this.setValidationState(
        false,
        `Account number must be exactly 10 digits. Current: ${accountNumber.length} digits`
      );
      return;
    }

    this.setValidationState(true, '');
  }

  private validateTypedText(text: string): void {
    if (!text || text.trim().length === 0) {
      // If field is empty, reset validation to neutral state
      this.resetValidation();
      return;
    }

    // Check if the text matches the expected format: "Bank Name - AccountNumber"
    const accountNumberMatch = text.match(/.*-\s*(\d+)$/);

    if (accountNumberMatch) {
      const accountNumber = accountNumberMatch[1];

      if (accountNumber.length !== 10) {
        this.setValidationState(
          false,
          `Account number must be exactly 10 digits. Current: ${accountNumber.length} digits`
        );
        return;
      }

      // If we have exactly 10 digits, check if it matches a valid account
      const matchingAccount = this.allBankAccounts.find(
        (account) => account.accountNumber === accountNumber
      );

      if (matchingAccount) {
        this.setValidationState(true, '');
      } else {
        this.setValidationState(false, 'Account number not found in system');
      }
    } else {
      // If text doesn't match expected format, show validation error
      if (text.includes('-')) {
        this.setValidationState(
          false,
          'Invalid account format. Expected: Bank Name - Account Number'
        );
      } else {
        // User is still typing, don't show error yet
        this.resetValidation();
      }
    }
  }

  private resetValidation(): void {
    this.setValidationState(true, '');
  }

  private setValidationState(isValid: boolean, errorMessage: string): void {
    this.isValidAccount = isValid;
    this.validationErrorMessage = errorMessage;
    this.validationStateChanged.emit(isValid);
  }

  // Public getter for validation state
  get isAccountValid(): boolean {
    return this.isValidAccount && this.selectedAccount !== null;
  }
}
