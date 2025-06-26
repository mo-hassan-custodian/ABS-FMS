import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, Observable } from 'rxjs';
import { takeUntil, startWith, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { RequisitionService } from '../../../../../services/requisition.service';
import { PayeeService } from '../../../../../services/payee.service';
import { RequisitionCreateRequest } from '../../../../../models/requisition.model';
import { Payee, PayeeCreateRequest } from '../../../../../models/payee.model';
import { Router } from '@angular/router';
import { BANK_ACCOUNTS, BANK_BRANCHES, CREATED_FROM_OPTIONS, CURRENCIES, PAYEE_TYPES, PAYMENT_OPTIONS } from '../../../../../constants/requisition.constants';

@Component({
  selector: 'app-create-requisitions',
  templateUrl: './create-requisitions.component.html',
  styleUrl: './create-requisitions.component.css'
})
export class CreateRequisitionsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  requisitionForm!: FormGroup;
  payeeForm!: FormGroup;
  payees: Payee[] = [];
  filteredPayees!: Observable<Payee[]>;
  selectedPayee: Payee | null = null;

  showCreatePayeeModal = false;

  // Dropdown data
  bankBranches = BANK_BRANCHES;
  currencies = CURRENCIES;
  bankAccounts = BANK_ACCOUNTS;
  payeeTypes = PAYEE_TYPES;
  createdFromOptions = CREATED_FROM_OPTIONS;
  paymentOptions = PAYMENT_OPTIONS;

  constructor(
    private formBuilder: FormBuilder,
    private requisitionService: RequisitionService,
    private payeeService: PayeeService,
    private toastr: ToastrService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.initForms();
    this.loadPayees();
    this.setupPayeeAutocomplete();
    this.subscribeToPayeeCreation();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForms(): void {
    this.requisitionForm = this.formBuilder.group({
      payee: ['', Validators.required],
      code: ['', [Validators.required, Validators.minLength(3)]],
      chequePayee: ['', Validators.required],
      payeeBankBranch: ['', Validators.required],
      payeeAccountNo: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      narrative: ['', [Validators.required, Validators.maxLength(500)]],
      invoiceNo: ['', Validators.required],
      invoiceDate: [null, Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      currency: ['NGN', Validators.required],
      bankAccount: ['', Validators.required],
      type: ['', Validators.required],
      paymentOption: ['', Validators.required]
    });

    this.payeeForm = this.formBuilder.group({
      name: ['', Validators.required],
      createdFrom: ['', Validators.required],
      shortDescription: [''],
      pinNo: ['', Validators.required],
      bankName: ['', Validators.required],
      bankBranch: ['', Validators.required],
      accountNumber: ['', Validators.required],
      physicalAddress: ['', Validators.required],
      postalAddress: ['', Validators.required]
    });
  }

  private loadPayees(): void {
    this.payeeService.payees$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (payees) => this.payees = payees,
        error: (error) => console.error('Error loading payees:', error)
      });
  }

  private setupPayeeAutocomplete(): void {
    this.filteredPayees = this.requisitionForm.get('payee')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      map(value => {
        const filterValue = typeof value === 'string' ? value : value?.name || '';
        if (typeof value === 'string' && this.selectedPayee && value !== this.selectedPayee.name) {
          this.clearPayeeInformation();
        }
        return this.payees.filter(payee =>
          payee.name.toLowerCase().includes(filterValue.toLowerCase()) ||
          payee.pinNo.toLowerCase().includes(filterValue.toLowerCase()) ||
          payee.bankName.toLowerCase().includes(filterValue.toLowerCase())
        );
      })
    );
  }

  private subscribeToPayeeCreation(): void {
    this.payeeService.payeeCreated$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (newPayee) => {
          this.selectedPayee = newPayee;
          this.populatePayeeInformation(newPayee);
        }
      });
  }

  // --- Payee selection and auto-population ---
  onPayeeSelected(payee: Payee | string): void {
    if (payee === 'CREATE_NEW') {
      this.openCreatePayeeFromRequisition();
      return;
    }
    this.selectedPayee = payee as Payee;
    this.populatePayeeInformation(this.selectedPayee);
  }

  displayPayeeName(payee: Payee | string): string {
    if (typeof payee === 'string') return payee === 'CREATE_NEW' ? '' : payee;
    return payee ? payee.name : '';
  }

  private populatePayeeInformation(payee: Payee): void {
    this.requisitionForm.patchValue({
      payee: payee.name,
      chequePayee: payee.name,
      payeeBankBranch: payee.bankBranch || '',
      payeeAccountNo: payee.accountNumber || ''
    });
    this.updateFieldDisabledState(payee);
  }

  private updateFieldDisabledState(payee: Payee): void {
    const chequePayeeControl = this.requisitionForm.get('chequePayee');
    const bankBranchControl = this.requisitionForm.get('payeeBankBranch');
    const accountNoControl = this.requisitionForm.get('payeeAccountNo');
    if (payee.name && chequePayeeControl) chequePayeeControl.disable();
    if (payee.bankBranch && bankBranchControl) bankBranchControl.disable();
    if (payee.accountNumber && accountNoControl) accountNoControl.disable();
  }

  clearPayeeInformation(): void {
    ['chequePayee', 'payeeBankBranch', 'payeeAccountNo'].forEach(field => {
      const control = this.requisitionForm.get(field);
      if (control) {
        control.enable();
        control.setValue('');
      }
    });
    this.selectedPayee = null;
  }

  openCreatePayeeFromRequisition(): void {
    this.showCreatePayeeModal = true;
    this.payeeForm.reset();
    this.requisitionForm.patchValue({ payee: '' });
  }

  openCreatePayeeModal(): void {
    this.showCreatePayeeModal = true;
    this.payeeForm.reset();
  }

  closeCreatePayeeModal(): void {
    this.showCreatePayeeModal = false;
    this.payeeForm.reset();
  }

  // --- Save methods ---
  saveRequisition(): void {
    const formData = this.requisitionForm.getRawValue();
    if (this.isFormValidIncludingDisabled()) {
      const requisitionRequest: RequisitionCreateRequest = { ...formData };
      this.requisitionService.createRequisition(requisitionRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.toastr.success('Requisition created successfully!', 'Success');
            this.router.navigate(['/App/manage-requisitions']);
          },
          error: () => this.toastr.error('Error creating requisition. Please try again.', 'Error')
        });
    } else {
      this.markFormGroupTouched(this.requisitionForm);
      this.toastr.warning('Please fill in all required fields.', 'Validation Error');
    }
  }

  savePayee(): void {
    if (this.payeeForm.valid) {
      const payeeData: PayeeCreateRequest = this.payeeForm.value;
      if (!payeeData.shortDescription || payeeData.shortDescription.trim() === '') {
        payeeData.shortDescription = payeeData.name;
      }
      this.payeeService.createPayee(payeeData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.closeCreatePayeeModal();
            this.toastr.success('Payee created and selected successfully!', 'Success');
          },
          error: () => this.toastr.error('Error creating payee. Please try again.', 'Error')
        });
    } else {
      this.markFormGroupTouched(this.payeeForm);
      this.toastr.warning('Please fill in all required fields.', 'Validation Error');
    }
  }

  // --- Form helpers ---
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => control.markAsTouched());
  }

  private isFormValidIncludingDisabled(): boolean {
    const formData = this.requisitionForm.getRawValue();
    const requiredFields = [
      'payee', 'code', 'chequePayee', 'payeeBankBranch', 'payeeAccountNo',
      'narrative', 'invoiceNo', 'invoiceDate', 'amount', 'currency',
      'bankAccount', 'type', 'paymentOption'
    ];
    return requiredFields.every(field => formData[field]);
  }

  // --- Error helpers ---
  hasError(fieldName: string, errorType?: string): boolean {
    let field = this.requisitionForm.get(fieldName) || this.payeeForm.get(fieldName);
    if (!field) return false;
    return errorType ? field.hasError(errorType) && field.touched : field.invalid && field.touched;
  }

  getErrorMessage(fieldName: string): string {
    let field = this.requisitionForm.get(fieldName) || this.payeeForm.get(fieldName);
    if (!field || !field.errors) return '';
    const errors = field.errors;
    if (errors['required']) return `${this.getFieldDisplayName(fieldName)} is required`;
    if (errors['minlength']) return `${this.getFieldDisplayName(fieldName)} must be at least ${errors['minlength'].requiredLength} characters`;
    if (errors['maxlength']) return `${this.getFieldDisplayName(fieldName)} cannot exceed ${errors['maxlength'].requiredLength} characters`;
    if (errors['pattern']) return `${this.getFieldDisplayName(fieldName)} format is invalid`;
    if (errors['min']) return `${this.getFieldDisplayName(fieldName)} must be greater than ${errors['min'].min}`;
    return 'Invalid input';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      code: 'Code',
      chequePayee: 'Input Cheque Payee',
      payee: 'Payee',
      payeeBankBranch: 'Payee Bank Branch',
      payeeAccountNo: 'Payee Account Number',
      narrative: 'Narrative',
      invoiceNo: 'Invoice Number',
      invoiceDate: 'Invoice Date',
      amount: 'Amount',
      currency: 'Currency',
      bankAccount: 'Bank Account',
      type: 'Type',
      paymentOption: 'Payment Option'
    };
    return displayNames[fieldName] || fieldName;
  }

  // --- Field auto-fill helpers ---
  onPayeeChange(): void {
    const payeeName = this.requisitionForm.get('payee')?.value;
    const chequePayeeControl = this.requisitionForm.get('chequePayee');
    if (payeeName && !chequePayeeControl?.value) {
      chequePayeeControl?.setValue(payeeName);
    }
  }

  onRequisitionPayeeNameChange(): void {
    const payeeName = this.requisitionForm.get('payee')?.value;
    const codeControl = this.requisitionForm.get('code');
    if (payeeName && !codeControl?.value) {
      const code = payeeName.substring(0, 3).toUpperCase() +
        Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      codeControl?.setValue(code);
    }
  }

  // --- Date and currency helpers ---
  getTodayDate(): Date {
    return new Date();
  }

  formatCurrency(amount: number, currencyCode: string): string {
    const currency = this.currencies.find(c => c.value === currencyCode);
    return currency ? `${currency.symbol}${amount.toLocaleString()}` : amount.toString();
  }
}