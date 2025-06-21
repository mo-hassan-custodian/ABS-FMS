import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, Observable } from 'rxjs';
import { takeUntil, startWith, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { RequisitionService } from '../../../../../services/requisition.service';
import { PayeeService } from '../../../../../services/payee.service';
import { Requisition, RequisitionCreateRequest } from '../../../../../models/requisition.model';
import { Payee, PayeeCreateRequest } from '../../../../../models/payee.model';

@Component({
  selector: 'app-create-requisitions',
  templateUrl: './create-requisitions.component.html',
  styleUrl: './create-requisitions.component.css'
})
export class CreateRequisitionsComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private destroy$ = new Subject<void>();

  isProposal: boolean = false;
  searchResults: any[] = [];
  displayedColumns: string[] = ['code', 'payee', 'amount', 'invoiceNo', 'narrative', 'bankAccount', 'status', 'actions'];

  dataSource = new MatTableDataSource<Requisition>([]);
  requisitions: Requisition[] = [];



  // Modal visibility flags
  showCreateRequisitionModal = false;
  showCreatePayeeModal = false;
  showViewDetailsModal = false;
  selectedRequisition: Requisition | null = null;
  isEditMode = false;
  editForm!: FormGroup;

  // Payee autocomplete
  payees: Payee[] = [];
  filteredPayees: Observable<Payee[]> = new Observable();
  selectedPayee: Payee | null = null;

  // Form groups
  requisitionForm!: FormGroup;
  payeeForm!: FormGroup;

  // Dropdown data
  bankBranches = [
    { name: 'Head Office - Victoria Island', value: 'HO_VI', bankName: 'Custodian Bank' },
      { name: 'Lagos Branch - Ikeja', value: 'LAG_IKJ', bankName: 'Custodian Bank' },
      { name: 'Abuja Branch - Wuse II', value: 'ABJ_WUS', bankName: 'Custodian Bank' },
      { name: 'Port Harcourt Branch - GRA', value: 'PHC_GRA', bankName: 'Custodian Bank' },
      { name: 'Kano Branch - Sabon Gari', value: 'KAN_SGB', bankName: 'Custodian Bank' },
      { name: 'Ibadan Branch - Bodija', value: 'IBD_BOD', bankName: 'Custodian Bank' },
      { name: 'Kaduna Branch - Barnawa', value: 'KAD_BAR', bankName: 'Custodian Bank' },
      { name: 'Benin Branch - Ring Road', value: 'BEN_RNG', bankName: 'Custodian Bank' },
      { name: 'Enugu Branch - Independence Layout', value: 'ENU_IND', bankName: 'Custodian Bank' },
      { name: 'Calabar Branch - Marian Road', value: 'CAL_MAR', bankName: 'Custodian Bank' }
  ];

  currencies = [
    { name: 'Nigerian Naira', value: 'NGN', symbol: '₦' },
      { name: 'US Dollar', value: 'USD', symbol: '$' },
      { name: 'British Pound Sterling', value: 'GBP', symbol: '£' },
      { name: 'Euro', value: 'EUR', symbol: '€' },
      { name: 'South African Rand', value: 'ZAR', symbol: 'R' },
      { name: 'Ghanaian Cedi', value: 'GHS', symbol: '₵' },
      { name: 'Kenyan Shilling', value: 'KES', symbol: 'KSh' },
      { name: 'Canadian Dollar', value: 'CAD', symbol: 'C$' },
      { name: 'Australian Dollar', value: 'AUD', symbol: 'A$' },
      { name: 'Japanese Yen', value: 'JPY', symbol: '¥' },
      { name: 'Swiss Franc', value: 'CHF', symbol: 'CHF' },
      { name: 'Chinese Yuan', value: 'CNY', symbol: '¥' }
  ];

  bankAccounts = [
  { name: 'Main Operating Account - 0123456789 (Current)', value: '0123456789' },
      { name: 'Petty Cash Account - 0987654321 (Savings)', value: '0987654321' },
      { name: 'Investment Account - 1122334455 (Investment)', value: '1122334455' },
      { name: 'Claims Settlement Account - 2233445566 (Current)', value: '2233445566' },
      { name: 'Premium Collection Account - 3344556677 (Current)', value: '3344556677' },
      { name: 'Commission Account - 4455667788 (Current)', value: '4455667788' },
      { name: 'Reinsurance Account - 5566778899 (Current)', value: '5566778899' },
      { name: 'Staff Welfare Account - 6677889900 (Savings)', value: '6677889900' },
      { name: 'Training & Development Account - 7788990011 (Savings)', value: '7788990011' },
      { name: 'Emergency Fund Account - 8899001122 (Savings)', value: '8899001122' }
  ];

  payeeTypes = [
    { name: 'Individual Client', value: 'INDIVIDUAL_CLIENT' },
      { name: 'Corporate Client', value: 'CORPORATE_CLIENT' },
      { name: 'Insurance Broker', value: 'INSURANCE_BROKER' },
      { name: 'Reinsurance Company', value: 'REINSURANCE_COMPANY' },
      { name: 'Medical Provider', value: 'MEDICAL_PROVIDER' },
      { name: 'Legal Service Provider', value: 'LEGAL_SERVICE' },
      { name: 'Claims Adjuster', value: 'CLAIMS_ADJUSTER' },
      { name: 'Government Agency', value: 'GOVERNMENT_AGENCY' },
      { name: 'Vendor/Supplier', value: 'VENDOR_SUPPLIER' },
      { name: 'Contractor', value: 'CONTRACTOR' },
      { name: 'Consultant', value: 'CONSULTANT' },
      { name: 'Employee', value: 'EMPLOYEE' },
      { name: 'Agent/Representative', value: 'AGENT_REPRESENTATIVE' },
      { name: 'Financial Institution', value: 'FINANCIAL_INSTITUTION' },
      { name: 'Regulatory Body', value: 'REGULATORY_BODY' }
  ];

  createdFromOptions = [
    { name: 'Manual Entry', value: 'MANUAL' },
    { name: 'System Import', value: 'IMPORT' },
    { name: 'System Generated', value: 'SYSTEM' },
    { name: 'External API', value: 'API' },
    { name: 'Bulk Upload', value: 'BULK' }
  ];

  paymentOptions = [
    { name: 'Electronic Fund Transfer (EFT)', value: 'EFT' },
      { name: 'Real Time Gross Settlement (RTGS)', value: 'RTGS' },
      { name: 'Automated Clearing House (ACH)', value: 'ACH' },
      { name: 'Bank Draft', value: 'BANK_DRAFT' },
      { name: 'Certified Cheque', value: 'CERTIFIED_CHEQUE' },
      { name: 'Company Cheque', value: 'COMPANY_CHEQUE' },
      { name: 'Cash Payment', value: 'CASH' },
      { name: 'Mobile Money Transfer', value: 'MOBILE_MONEY' },
      { name: 'Online Banking Transfer', value: 'ONLINE_BANKING' },
      { name: 'Standing Order', value: 'STANDING_ORDER' },
      { name: 'Direct Debit', value: 'DIRECT_DEBIT' },
      { name: 'Wire Transfer', value: 'WIRE_TRANSFER' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private requisitionService: RequisitionService,
    private payeeService: PayeeService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.loadRequisitions();
    this.loadPayees();
    this.setupPayeeAutocomplete();
    this.subscribeToPayeeCreation();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadRequisitions(): void {
    this.requisitionService.getAllRequisitions()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (requisitions) => {
          this.requisitions = requisitions;
          this.dataSource.data = requisitions;
        },
        error: (error) => {
          console.error('Error loading requisitions:', error);
        }
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadPayees(): void {
    // Subscribe to the payees observable for real-time updates
    this.payeeService.payees$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (payees) => {
          this.payees = payees;
        },
        error: (error) => {
          console.error('Error loading payees:', error);
        }
      });
  }

  setupPayeeAutocomplete(): void {
    this.filteredPayees = this.requisitionForm.get('payee')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      map(value => {
        const filterValue = typeof value === 'string' ? value : value?.name || '';

        // If user is typing manually (string input), clear auto-populated information
        if (typeof value === 'string' && this.selectedPayee && value !== this.selectedPayee.name) {
          this.clearPayeeInformation();
        }

        return this._filterPayees(filterValue);
      })
    );
  }

  private _filterPayees(value: string): Payee[] {
    const filterValue = value.toLowerCase();
    return this.payees.filter(payee =>
      payee.name.toLowerCase().includes(filterValue) ||
      payee.pinNo.toLowerCase().includes(filterValue) ||
      payee.bankName.toLowerCase().includes(filterValue)
    );
  }

  subscribeToPayeeCreation(): void {
    this.payeeService.payeeCreated$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (newPayee) => {
          // The payees array is automatically updated through the service observable
          // Just select and auto-populate the newly created payee
          this.selectedPayee = newPayee;
          this.populatePayeeInformation(newPayee);
        }
      });
  }

  authorize(element: Requisition): void {
    this.requisitionService.updateRequisitionStatus(element.id, 'Approved')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (success) => {
          if (success) {
            this.toastr.success('Requisition approved successfully!', 'Success');
            this.loadRequisitions();
          }
        },
        error: (error) => {
          console.error('Error approving requisition:', error);
          this.toastr.error('Error approving requisition.', 'Error');
        }
      });
  }

  reject(element: Requisition): void {
    this.requisitionService.updateRequisitionStatus(element.id, 'Rejected')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (success) => {
          if (success) {
            this.toastr.warning('Requisition rejected successfully!', 'Rejected');
            this.loadRequisitions();
          }
        },
        error: (error) => {
          console.error('Error rejecting requisition:', error);
          this.toastr.error('Error rejecting requisition.', 'Error');
        }
      });
  }

  viewDetails(item: Requisition): void {
    this.selectedRequisition = item;
    this.isEditMode = false;
    this.showViewDetailsModal = true;
  }

  closeViewDetailsModal(): void {
    this.showViewDetailsModal = false;
    this.selectedRequisition = null;
    this.isEditMode = false;
    this.editForm.reset();
  }

  enableEditMode(): void {
    if (this.selectedRequisition) {
      this.isEditMode = true;
      // Populate edit form with current requisition data
      this.editForm.patchValue({
        payee: this.selectedRequisition.payee,
        code: this.selectedRequisition.code,
        chequePayee: this.selectedRequisition.chequePayee,
        payeeBankBranch: this.selectedRequisition.payeeBankBranch,
        payeeAccountNo: this.selectedRequisition.payeeAccountNo,
        narrative: this.selectedRequisition.narrative,
        invoiceNo: this.selectedRequisition.invoiceNo,
        invoiceDate: this.selectedRequisition.invoiceDate,
        amount: this.selectedRequisition.amount,
        currency: this.selectedRequisition.currency,
        bankAccount: this.selectedRequisition.bankAccount,
        type: this.selectedRequisition.type,
        paymentOption: this.selectedRequisition.paymentOption
      });
    }
  }

  cancelEdit(): void {
    this.isEditMode = false;
    this.editForm.reset();
  }

  updateRequisition(): void {
    if (this.editForm.valid && this.selectedRequisition) {
      const formData = this.editForm.value;

      const updates: Partial<Requisition> = {
        payee: formData.payee,
        code: formData.code,
        chequePayee: formData.chequePayee,
        payeeBankBranch: formData.payeeBankBranch,
        payeeAccountNo: formData.payeeAccountNo,
        narrative: formData.narrative,
        invoiceNo: formData.invoiceNo,
        invoiceDate: formData.invoiceDate,
        amount: formData.amount,
        currency: formData.currency,
        bankAccount: formData.bankAccount,
        type: formData.type,
        paymentOption: formData.paymentOption
      };

      this.requisitionService.updateRequisition(this.selectedRequisition.id, updates)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updatedRequisition) => {
            if (updatedRequisition) {
              this.toastr.success('Requisition updated successfully!', 'Updated');
              this.closeViewDetailsModal();
              this.loadRequisitions(); // Refresh the table
            }
          },
          error: (error) => {
            console.error('Error updating requisition:', error);
            this.toastr.error('Error updating requisition. Please try again.', 'Error');
          }
        });
    } else {
      this.markFormGroupTouched(this.editForm);
      this.toastr.warning('Please fill in all required fields.', 'Validation Error');
    }
  }

  deleteRequisition(element: Requisition): void {
    if (confirm('Are you sure you want to delete this requisition?')) {
      this.requisitionService.deleteRequisition(element.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (success) => {
            if (success) {
              this.toastr.success('Requisition deleted successfully!', 'Deleted');
              this.loadRequisitions();
            }
          },
          error: (error) => {
            console.error('Error deleting requisition:', error);
            this.toastr.error('Error deleting requisition.', 'Error');
          }
        });
    }
  }

  // Search functionality
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  initializeForms(): void {
    // Initialize requisition form
    this.requisitionForm = this.formBuilder.group({
            payee: ['', Validators.required],
      code: ['', [Validators.required, Validators.minLength(3)]],
      chequePayee: ['', Validators.required],
      payeeBankBranch: ['', Validators.required],
      payeeAccountNo: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      narrative: ['', [Validators.required, Validators.maxLength(500)]],
      invoiceNo: ['', Validators.required],
      invoiceDate: [null, Validators.required], // Changed to null for proper date picker handling
      amount: ['', [Validators.required, Validators.min(0.01)]],
      currency: ['NGN', Validators.required],
      bankAccount: ['', Validators.required],
      type: ['', Validators.required],
      paymentOption: ['', Validators.required]
    });

    // Initialize edit form (same structure as requisition form)
    this.editForm = this.formBuilder.group({
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

    // Initialize payee form
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

  // Modal control methods
  openSearchModal(): void {
    // TODO: Implement search functionality
  }

  // TrackBy function for better performance in ngFor
  trackByValue(_index: number, item: any): any {
    return item.value;
  }


  openCreateRequisitionModal(): void {
    this.showCreateRequisitionModal = true;
    this.requisitionForm.reset();
    this.requisitionForm.patchValue({ currency: 'NGN' }); // Set default currency
  }

  closeCreateRequisitionModal(): void {
    this.showCreateRequisitionModal = false;
    this.requisitionForm.reset();
  }

  openCreatePayeeModal(): void {
    this.showCreatePayeeModal = true;
    this.payeeForm.reset();
  }

  closeCreatePayeeModal(): void {
    this.showCreatePayeeModal = false;
    this.payeeForm.reset();
  }

  // Save methods
  saveRequisition(): void {
    // Get form data including disabled fields
    const formData = this.getFormDataIncludingDisabled();

    if (this.isFormValidIncludingDisabled()) {

      // Create the requisition request object
      const requisitionRequest: RequisitionCreateRequest = {
        code: formData.code,
        payee: formData.payee,
        chequePayee: formData.chequePayee,
        payeeBankBranch: formData.payeeBankBranch,
        payeeAccountNo: formData.payeeAccountNo,
        narrative: formData.narrative,
        invoiceNo: formData.invoiceNo,
        invoiceDate: formData.invoiceDate,
        amount: formData.amount,
        currency: formData.currency,
        bankAccount: formData.bankAccount,
        type: formData.type,
        paymentOption: formData.paymentOption
      };


      // Save using the service
      this.requisitionService.createRequisition(requisitionRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (newRequisition) => {

            // Close modal after successful save
            this.closeCreateRequisitionModal();

            // Show success message
            this.toastr.success('Requisition created successfully!', 'Success');

            this.loadRequisitions();
          },
          error: (error) => {
            console.error('Error creating requisition:', error);
            this.toastr.error('Error creating requisition. Please try again.', 'Error');
          }
        });
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.requisitionForm);
      this.toastr.warning('Please fill in all required fields.', 'Validation Error');
    }
  }

  savePayee(): void {
    if (this.payeeForm.valid) {
      const payeeData: PayeeCreateRequest = this.payeeForm.value;

      // Auto-fill short description if not provided
      if (!payeeData.shortDescription || payeeData.shortDescription.trim() === '') {
        payeeData.shortDescription = payeeData.name;
      }

      this.payeeService.createPayee(payeeData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (newPayee) => {
            this.closeCreatePayeeModal();
            this.toastr.success('Payee created and selected successfully!', 'Success');
          },
          error: (error) => {
            console.error('Error creating payee:', error);
            this.toastr.error('Error creating payee. Please try again.', 'Error');
          }
        });
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.payeeForm);
      this.toastr.warning('Please fill in all required fields.', 'Validation Error');
    }
  }

  onPayeeSelected(payee: Payee | string): void {
    if (payee === 'CREATE_NEW') {
      this.openCreatePayeeFromRequisition();
      return;
    }

    const selectedPayee = payee as Payee;
    this.selectedPayee = selectedPayee;

    // Auto-populate payee information
    this.populatePayeeInformation(selectedPayee);
  }

  populatePayeeInformation(payee: Payee): void {
    // Auto-populate form fields with payee information
    this.requisitionForm.patchValue({
      payee: payee.name,
      chequePayee: payee.name, // Default to payee name
      payeeBankBranch: payee.bankBranch || '',
      payeeAccountNo: payee.accountNumber || ''
    });

    // Find and set the bank name if it exists in our bank list
    const bankName = payee.bankName;
    if (bankName) {
      this.requisitionForm.patchValue({
      });
    }

    // Disable fields that have been auto-populated (unless they're empty)
    this.updateFieldDisabledState(payee);
  }

  updateFieldDisabledState(payee: Payee): void {
    const chequePayeeControl = this.requisitionForm.get('chequePayee');
    const bankBranchControl = this.requisitionForm.get('payeeBankBranch');
    const accountNoControl = this.requisitionForm.get('payeeAccountNo');

    // Disable cheque payee field if payee name is available
    if (payee.name && chequePayeeControl) {
      chequePayeeControl.disable();
    }

    // Disable bank branch field if bank branch is available
    if (payee.bankBranch && bankBranchControl) {
      bankBranchControl.disable();
    }

    // Disable account number field if account number is available
    if (payee.accountNumber && accountNoControl) {
      accountNoControl.disable();
    }
  }

  clearPayeeInformation(): void {
    // Re-enable all payee-related fields
    const chequePayeeControl = this.requisitionForm.get('chequePayee');
    const bankBranchControl = this.requisitionForm.get('payeeBankBranch');
    const accountNoControl = this.requisitionForm.get('payeeAccountNo');

    if (chequePayeeControl) chequePayeeControl.enable();
    if (bankBranchControl) bankBranchControl.enable();
    if (accountNoControl) accountNoControl.enable();

    // Clear the fields
    this.requisitionForm.patchValue({
      chequePayee: '',
      payeeBankBranch: '',
      payeeAccountNo: ''
    });

    this.selectedPayee = null;
  }

  displayPayeeName(payee: Payee | string): string {
    if (typeof payee === 'string') {
      return payee === 'CREATE_NEW' ? '' : payee;
    }
    return payee ? payee.name : '';
  }

  openCreatePayeeFromRequisition(): void {
    this.showCreatePayeeModal = true;
    this.payeeForm.reset();
    // Clear the payee field to avoid showing "CREATE_NEW"
    this.requisitionForm.patchValue({
      payee: ''
    });
  }

  getFormDataIncludingDisabled(): any {
    // Get raw value includes disabled fields
    return this.requisitionForm.getRawValue();
  }

  isFormValidIncludingDisabled(): boolean {
    // Check if required fields have values (including disabled ones)
    const formData = this.getFormDataIncludingDisabled();

    // Check required fields
    const requiredFields = ['payee', 'code', 'chequePayee', 'payeeBankBranch',
                           'payeeAccountNo', 'narrative', 'invoiceNo', 'invoiceDate',
                           'amount', 'currency', 'bankAccount', 'type', 'paymentOption'];

    return requiredFields.every(field => {
      const value = formData[field];
      return value !== null && value !== undefined && value !== '';
    });
  }

  // Auto-fill short description when name changes
  onPayeeNameChange(): void {
    const nameValue = this.payeeForm.get('name')?.value;
    const shortDescControl = this.payeeForm.get('shortDescription');

    if (nameValue && (!shortDescControl?.value || shortDescControl?.value.trim() === '')) {
      shortDescControl?.setValue(nameValue);
    }
  }

  // Utility method to mark all form fields as touched
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  // Helper method to check if a field has errors and is touched
  hasError(fieldName: string, errorType?: string): boolean {
    // Check in requisition form first, then payee form
    let field = this.requisitionForm.get(fieldName);
    if (!field) {
      field = this.payeeForm.get(fieldName);
    }

    if (!field) return false;

    if (errorType) {
      return field.hasError(errorType) && field.touched;
    }
    return field.invalid && field.touched;
  }

  // Helper method to get error message for a field
  getErrorMessage(fieldName: string): string {
    // Check in requisition form first, then payee form
    let field = this.requisitionForm.get(fieldName);
    if (!field) {
      field = this.payeeForm.get(fieldName);
    }

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

  // Utility method to generate auto code based on payee name (for requisition form)
  onRequisitionPayeeNameChange(): void {
    const payeeName = this.requisitionForm.get('payee')?.value;
    const codeControl = this.requisitionForm.get('code');

    if (payeeName && payeeName.trim().length > 0) {
      // Generate a simple code from payee name if code field is empty
      if (!codeControl?.value) {
        const code = payeeName.substring(0, 3).toUpperCase() +
                     Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        codeControl?.setValue(code);
      }
    }
  }

  // Utility method to auto-fill cheque payee from payee name
  onPayeeChange(): void {
    const payeeName = this.requisitionForm.get('payee')?.value;
    const chequePayeeControl = this.requisitionForm.get('chequePayee');

    if (payeeName && payeeName.trim().length > 0) {
      // Auto-fill cheque payee if it's empty
      if (!chequePayeeControl?.value) {
        chequePayeeControl?.setValue(payeeName);
      }
    }
  }

  // Method to get today's date for date picker
  getTodayDate(): Date {
    return new Date();
  }

  // Method to get max date (e.g., 30 days from today)
  getMaxDate(): Date {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate;
  }

  // Method to format currency display
  formatCurrency(amount: number, currencyCode: string): string {
    const currency = this.currencies.find(c => c.value === currencyCode);
    return currency ? `${currency.symbol}${amount.toLocaleString()}` : amount.toString();
  }

}
