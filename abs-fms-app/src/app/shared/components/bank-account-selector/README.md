# Bank Account Selector Component

A reusable Angular component for selecting bank accounts with search functionality, validation support, and customizable display options.

## Features

- **Search functionality** - Type to search accounts by name, account number, bank name, or description
- **Configurable display** - Show/hide account numbers, bank names, balances, descriptions
- **Form integration** - Implements ControlValueAccessor for seamless form integration
- **Validation support** - Built-in required field validation
- **Loading states** - Shows spinner while loading accounts
- **Accessibility** - Proper ARIA labels and keyboard navigation
- **Mobile responsive** - Optimized for mobile devices
- **Filtering options** - Filter by status, currency, account type

## Basic Usage

```html
<!-- Simple usage -->
<app-bank-account-selector 
  (accountSelected)="onAccountSelected($event)">
</app-bank-account-selector>
```

## Advanced Usage

```html
<!-- With all options -->
<app-bank-account-selector
  label="Select Bank Account"
  placeholder="Choose bank account for payment"
  [required]="true"
  [showBalance]="true"
  [showAccountNumber]="true"
  [showBankName]="true"
  [showDescription]="false"
  filterByStatus="Active"
  filterByCurrency="NGN"
  filterByAccountType="Current"
  appearance="outline"
  (accountSelected)="onAccountSelected($event)"
  (accountCleared)="onAccountCleared()"
  (searchChanged)="onSearchChanged($event)">
</app-bank-account-selector>
```

## Form Integration

```typescript
// In your component
export class MyComponent {
  myForm = this.fb.group({
    bankAccount: [null, Validators.required]
  });

  onAccountSelected(account: BankAccount): void {
    console.log('Selected account:', account);
  }
}
```

```html
<!-- In your template -->
<form [formGroup]="myForm">
  <app-bank-account-selector
    formControlName="bankAccount"
    [required]="true"
    label="Payment Account">
  </app-bank-account-selector>
</form>
```

## Input Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | string | 'Bank Account' | Label for the form field |
| `placeholder` | string | 'Select Bank Account' | Placeholder text |
| `required` | boolean | false | Whether the field is required |
| `disabled` | boolean | false | Whether the field is disabled |
| `multiple` | boolean | false | Allow multiple selection (future feature) |
| `appearance` | 'fill' \| 'outline' | 'outline' | Material form field appearance |
| `showBalance` | boolean | false | Show account balance in options |
| `showAccountNumber` | boolean | true | Show account number in options |
| `showBankName` | boolean | true | Show bank name in options |
| `showDescription` | boolean | false | Show account description |
| `filterByStatus` | string | 'Active' | Filter accounts by status |
| `filterByCurrency` | string | '' | Filter accounts by currency |
| `filterByAccountType` | string | '' | Filter accounts by type |

## Output Events

| Event | Type | Description |
|-------|------|-------------|
| `accountSelected` | BankAccount | Emitted when an account is selected |
| `accountCleared` | void | Emitted when selection is cleared |
| `searchChanged` | string | Emitted when search term changes |

## BankAccount Model

```typescript
interface BankAccount {
  id: string;
  name: string;
  accountNumber: string;
  accountType: 'Current' | 'Savings' | 'Investment' | 'Fixed Deposit';
  bankName: string;
  bankBranch: string;
  currency: string;
  balance?: number;
  status: 'Active' | 'Inactive' | 'Suspended' | 'Closed';
  description?: string;
  createdDate: Date;
  updatedDate?: Date;
}
```

## Styling

The component uses Angular Material theming and includes responsive design. You can customize the appearance using CSS classes:

```css
.bank-account-selector {
  /* Custom styles */
}

.bank-account-option {
  /* Custom option styles */
}
```

## Dependencies

- Angular Material (MatAutocomplete, MatFormField, MatInput, MatIcon, MatProgressSpinner)
- Reactive Forms
- RxJS

## Service Integration

The component uses `BankAccountService` to load and search bank accounts. Make sure the service is provided in your module or component.
