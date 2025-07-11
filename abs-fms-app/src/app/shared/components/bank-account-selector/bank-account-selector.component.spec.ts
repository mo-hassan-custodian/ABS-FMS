import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { BankAccountSelectorComponent } from './bank-account-selector.component';
import { BankAccountService } from '../../../services/bank-account.service';
import { BankAccount } from '../../../models/bank-account.model';

describe('BankAccountSelectorComponent', () => {
  let component: BankAccountSelectorComponent;
  let fixture: ComponentFixture<BankAccountSelectorComponent>;
  let mockBankAccountService: jasmine.SpyObj<BankAccountService>;

  const mockBankAccounts: BankAccount[] = [
    {
      id: '1',
      name: 'Main Operating Account',
      accountNumber: '0123456789',
      accountName: 'Custodian Main Operating Account',
      accountType: 'Current',
      bankName: 'Custodian Bank',
      bankBranch: 'Head Office - Victoria Island',
      currency: 'NGN',
      balance: 15000000,
      status: 'Active',
      description: 'Primary operating account for daily transactions',
      createdDate: new Date('2023-01-01'),
    },
    {
      id: '2',
      name: 'Petty Cash Account',
      accountNumber: '0987654321',
      accountName: 'Custodian Petty Cash',
      accountType: 'Savings',
      bankName: 'Custodian Bank',
      bankBranch: 'Lagos Branch - Ikeja',
      currency: 'NGN',
      balance: 500000,
      status: 'Active',
      description: 'Account for small cash transactions and expenses',
      createdDate: new Date('2023-01-15'),
    },
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('BankAccountService', [
      'searchBankAccounts',
    ]);

    await TestBed.configureTestingModule({
      declarations: [BankAccountSelectorComponent],
      imports: [
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatProgressSpinnerModule,
        NoopAnimationsModule,
      ],
      providers: [{ provide: BankAccountService, useValue: spy }],
    }).compileComponents();

    fixture = TestBed.createComponent(BankAccountSelectorComponent);
    component = fixture.componentInstance;
    mockBankAccountService = TestBed.inject(
      BankAccountService
    ) as jasmine.SpyObj<BankAccountService>;

    mockBankAccountService.searchBankAccounts.and.returnValue(
      of(mockBankAccounts)
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load bank accounts on init', () => {
    component.ngOnInit();
    expect(mockBankAccountService.searchBankAccounts).toHaveBeenCalled();
    expect(component.allBankAccounts).toEqual(mockBankAccounts);
  });

  it('should emit accountSelected when account is selected', () => {
    spyOn(component.accountSelected, 'emit');
    const account = mockBankAccounts[0];

    component.onAccountSelected(account);

    expect(component.selectedAccount).toEqual(account);
    expect(component.accountSelected.emit).toHaveBeenCalledWith(account);
  });

  it('should clear selection when clearSelection is called', () => {
    spyOn(component.accountCleared, 'emit');
    component.selectedAccount = mockBankAccounts[0];

    component.clearSelection();

    expect(component.selectedAccount).toBeNull();
    expect(component.accountCleared.emit).toHaveBeenCalled();
  });

  it('should format currency correctly', () => {
    const formatted = component.formatCurrency(1000000, 'NGN');
    expect(formatted).toContain('1,000,000');
  });

  it('should display account name correctly', () => {
    const account = mockBankAccounts[0];
    const displayName = component.displayAccountName(account);
    expect(displayName).toBe(`${account.bankName} - ${account.accountNumber}`);
  });

  it('should return empty string for null account display', () => {
    const displayName = component.displayAccountName(null);
    expect(displayName).toBe('');
  });

  it('should track accounts by id', () => {
    const account = mockBankAccounts[0];
    const trackId = component.trackByAccountId(0, account);
    expect(trackId).toBe(account.id || account.accountNumber);
  });

  // Validation tests
  describe('Account Number Validation', () => {
    it('should validate account with exactly 10 digits', () => {
      const validAccount: BankAccount = {
        accountNumber: '0123456789',
        accountName: 'Test Account',
        bankName: 'Test Bank',
        name: 'Test Account - 0123456789 (Current)',
        id: '1',
        accountType: 'Current',
        status: 'Active',
      };

      spyOn(component.validationStateChanged, 'emit');
      component.onAccountSelected(validAccount);

      expect(component.isValidAccount).toBe(true);
      expect(component.validationErrorMessage).toBe('');
      expect(component.validationStateChanged.emit).toHaveBeenCalledWith(true);
    });

    it('should invalidate account with less than 10 digits', () => {
      const invalidAccount: BankAccount = {
        accountNumber: '012345678', // 9 digits
        accountName: 'Test Account',
        bankName: 'Test Bank',
        name: 'Test Account - 012345678 (Current)',
        id: '1',
        accountType: 'Current',
        status: 'Active',
      };

      spyOn(component.validationStateChanged, 'emit');
      component.onAccountSelected(invalidAccount);

      expect(component.isValidAccount).toBe(false);
      expect(component.validationErrorMessage).toContain(
        'Account number must be exactly 10 digits'
      );
      expect(component.validationStateChanged.emit).toHaveBeenCalledWith(false);
    });

    it('should invalidate account with more than 10 digits', () => {
      const invalidAccount: BankAccount = {
        accountNumber: '01234567890', // 11 digits
        accountName: 'Test Account',
        bankName: 'Test Bank',
        name: 'Test Account - 01234567890 (Current)',
        id: '1',
        accountType: 'Current',
        status: 'Active',
      };

      spyOn(component.validationStateChanged, 'emit');
      component.onAccountSelected(invalidAccount);

      expect(component.isValidAccount).toBe(false);
      expect(component.validationErrorMessage).toContain(
        'Account number must be exactly 10 digits'
      );
      expect(component.validationStateChanged.emit).toHaveBeenCalledWith(false);
    });

    it('should reset validation when account is cleared', () => {
      spyOn(component.validationStateChanged, 'emit');
      component.clearSelection();

      expect(component.isValidAccount).toBe(true);
      expect(component.validationErrorMessage).toBe('');
      expect(component.validationStateChanged.emit).toHaveBeenCalledWith(true);
    });

    it('should validate typed text with correct format and 10 digits', fakeAsync(() => {
      spyOn(component.validationStateChanged, 'emit');

      // Simulate typing a valid account format
      component.searchControl.setValue('Custodian Bank - 0123456789');
      tick(300); // Wait for debounce

      expect(component.isValidAccount).toBe(true);
      expect(component.validationErrorMessage).toBe('');
      expect(component.validationStateChanged.emit).toHaveBeenCalledWith(true);
    }));

    it('should invalidate typed text with less than 10 digits', fakeAsync(() => {
      spyOn(component.validationStateChanged, 'emit');

      // Simulate typing an invalid account format (less than 10 digits)
      component.searchControl.setValue('Custodian Bank - 0123456');
      tick(300); // Wait for debounce

      expect(component.isValidAccount).toBe(false);
      expect(component.validationErrorMessage).toContain(
        'Account number must be exactly 10 digits'
      );
      expect(component.validationStateChanged.emit).toHaveBeenCalledWith(false);
    }));

    it('should invalidate typed text with more than 10 digits', fakeAsync(() => {
      spyOn(component.validationStateChanged, 'emit');

      // Simulate typing an invalid account format (more than 10 digits)
      component.searchControl.setValue('Custodian Bank - 01234567890');
      tick(300); // Wait for debounce

      expect(component.isValidAccount).toBe(false);
      expect(component.validationErrorMessage).toContain(
        'Account number must be exactly 10 digits'
      );
      expect(component.validationStateChanged.emit).toHaveBeenCalledWith(false);
    }));

    it('should not show error when user is still typing bank name', fakeAsync(() => {
      spyOn(component.validationStateChanged, 'emit');

      // Simulate typing just the bank name (no dash yet)
      component.searchControl.setValue('Custodian');
      tick(300); // Wait for debounce

      expect(component.isValidAccount).toBe(true);
      expect(component.validationErrorMessage).toBe('');
      expect(component.validationStateChanged.emit).toHaveBeenCalledWith(true);
    }));
  });
});
