import { ComponentFixture, TestBed } from '@angular/core/testing';
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
    }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('BankAccountService', ['searchBankAccounts']);

    await TestBed.configureTestingModule({
      declarations: [BankAccountSelectorComponent],
      imports: [
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatProgressSpinnerModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: BankAccountService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BankAccountSelectorComponent);
    component = fixture.componentInstance;
    mockBankAccountService = TestBed.inject(BankAccountService) as jasmine.SpyObj<BankAccountService>;
    
    mockBankAccountService.searchBankAccounts.and.returnValue(of(mockBankAccounts));
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
    expect(displayName).toBe(account.name);
  });

  it('should return empty string for null account display', () => {
    const displayName = component.displayAccountName(null);
    expect(displayName).toBe('');
  });

  it('should track accounts by id', () => {
    const account = mockBankAccounts[0];
    const trackId = component.trackByAccountId(0, account);
    expect(trackId).toBe(account.id);
  });
});
