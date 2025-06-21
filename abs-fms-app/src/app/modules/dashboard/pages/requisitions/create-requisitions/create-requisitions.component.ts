import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-create-requisitions',
  templateUrl: './create-requisitions.component.html',
  styleUrl: './create-requisitions.component.css'
})
export class CreateRequisitionsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

   isProposal: boolean = false;
  searchResults: any[] = [];
  displayedColumns: string[] = ['code', 'payeeName', 'amount','invoiceNumber','narrations','bankAcoount', 'payeeBank', "status", "actions",];
  
  dataSource = new MatTableDataSource([
    { code: 'REQ-001', payeeName: 'Zahra Musa', amount: 50000, 'payeeBank': "GTB", "status": "Pending", "invoiceNumber": "002"},
    { code: 'REQ-002', payeeName: 'Tari Obi', amount: 65000, 'payeeBank': "UBA", "status": "Pending",  "invoiceNumber": "002"},
    { code: 'REQ-003', payeeName: 'Kunle Adebayo', amount: 30000, 'payeeBank': "Access Bank","status": "Pending",  "invoiceNumber": "002"},
    { code: 'REQ-003', payeeName: 'Kunle Adebayo', amount: 30000, 'payeeBank': "Access Bank", "status": "Pending",  "invoiceNumber": "002"},
    { code: 'REQ-001', payeeName: 'Zahra Musa', amount: 50000, 'payeeBank': "GTB", "status": "Pending", "invoiceNumber": "002"},
    { code: 'REQ-002', payeeName: 'Tari Obi', amount: 65000, 'payeeBank': "UBA", "status": "Pending",  "invoiceNumber": "002"},
    { code: 'REQ-003', payeeName: 'Kunle Adebayo', amount: 30000, 'payeeBank': "Access Bank","status": "Pending",  "invoiceNumber": "002"},
    { code: 'REQ-003', payeeName: 'Kunle Adebayo', amount: 30000, 'payeeBank': "Access Bank", "status": "Pending",  "invoiceNumber": "002"},
    { code: 'REQ-001', payeeName: 'Zahra Musa', amount: 50000, 'payeeBank': "GTB", "status": "Pending", "invoiceNumber": "002"},
    { code: 'REQ-002', payeeName: 'Tari Obi', amount: 65000, 'payeeBank': "UBA", "status": "Pending",  "invoiceNumber": "002"},
    { code: 'REQ-003', payeeName: 'Kunle Adebayo', amount: 30000, 'payeeBank': "Access Bank","status": "Pending",  "invoiceNumber": "002"},
    { code: 'REQ-003', payeeName: 'Kunle Adebayo', amount: 30000, 'payeeBank': "Access Bank", "status": "Pending",  "invoiceNumber": "002"},
    { code: 'REQ-001', payeeName: 'Zahra Musa', amount: 50000, 'payeeBank': "GTB", "status": "Pending", "invoiceNumber": "002"},
    { code: 'REQ-002', payeeName: 'Tari Obi', amount: 65000, 'payeeBank': "UBA", "status": "Pending",  "invoiceNumber": "002"},
    { code: 'REQ-003', payeeName: 'Kunle Adebayo', amount: 30000, 'payeeBank': "Access Bank","status": "Pending",  "invoiceNumber": "002"},
    { code: 'REQ-003', payeeName: 'Kunle Adebayo', amount: 30000, 'payeeBank': "Access Bank", "status": "Pending",  "invoiceNumber": "002"},
  ]);



  // Modal visibility flags
  showCreateRequisitionModal = false;
  showCreatePayeeModal = false;

  // Form groups
  requisitionForm!: FormGroup;
  payeeForm!: FormGroup;

  // Dropdown data
  bankBranches = [
    // { id: 1, name: 'Main Branch - Lagos' },
    // { id: 2, name: 'Victoria Island Branch' },
    // { id: 3, name: 'Ikeja Branch' },
    // { id: 4, name: 'Abuja Branch' },
    // { id: 5, name: 'Port Harcourt Branch' }
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
    // { code: 'NGN', name: 'Nigerian Naira' },
    // { code: 'USD', name: 'US Dollar' },
    // { code: 'EUR', name: 'Euro' },
    // { code: 'GBP', name: 'British Pound' }
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
    // { id: 1, name: 'Operating Account', number: '1234567890' },
    // { id: 2, name: 'Savings Account', number: '0987654321' },
    // { id: 3, name: 'Current Account', number: '1122334455' }
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
    // { id: 1, name: 'Supplier' },
    // { id: 2, name: 'Employee' },
    // { id: 3, name: 'Contractor' },
    // { id: 4, name: 'Government Agency' },
    // { id: 5, name: 'Utility Company' }
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

  paymentOptions = [
    // { id: 1, name: 'Cheque' },
    // { id: 2, name: 'Bank Transfer' },
    // { id: 3, name: 'Electronic Transfer' },
    // { id: 4, name: 'Cash' }
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

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForms();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  authorize(element: any) {

  // this.dialog.open(CreateBeneficiaryComponent,{
  //         width:'70%',
  //         height:'70%',
  //         data:element   
  //       });
      }
  

  reject(element: any){

  }

  viewDetails(item: any) {
    // this.router.navigate(['/App/requisition-details'], {
    //   queryParams: { id: item.id },
    // });
    // this.modalService.dismissAll();
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

    // Initialize payee form
    this.payeeForm = this.formBuilder.group({
      payeeName: ['', Validators.required],
      payeeCode: ['', Validators.required],
      bankName: ['', Validators.required],
      bankBranch: ['', Validators.required],
      accountNumber: ['', Validators.required],
      contactInfo: [''],
      payeeType: ['', Validators.required]
    });
  }

  // Modal control methods
  openSearchModal(): void {
    // TODO: Implement search functionality
    console.log('Search modal opened');
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
    if (this.requisitionForm.valid) {
      const requisitionData = this.requisitionForm.value;
      console.log('Saving requisition:', requisitionData);

      // TODO: Implement actual save logic here
      // Example: this.requisitionService.createRequisition(requisitionData)

      // Close modal after successful save
      this.closeCreateRequisitionModal();
      // this.toastr.success('Requisition created successfully!');

      // Show success message
      alert('Requisition created successfully!');
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.requisitionForm);
      alert('Please fill in all required fields.');
    }
  }

  savePayee(): void {
    if (this.payeeForm.valid) {
      const payeeData = this.payeeForm.value;
      console.log('Saving payee:', payeeData);

      // TODO: Implement actual save logic here
      // Example: this.payeeService.createPayee(payeeData)

      // Close modal after successful save
      this.closeCreatePayeeModal();

      // Show success message
      alert('Payee created successfully!');
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.payeeForm);
      alert('Please fill in all required fields.');
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

  // Utility method to generate auto code based on payee name
  onPayeeNameChange(): void {
    const payeeName = this.requisitionForm.get('payee')?.value;
    const codeControl = this.requisitionForm.get('code');

    if (payeeName && payeeName.trim().length > 0) {
      // Generate a simple code from payee name if code field is empty
      if (!codeControl?.value) {
        const code = payeeName.substring(0, 3).toUpperCase() +
                     Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        codeControl?.setValue(code);
      }

      console.log('Payee name changed:', payeeName);
      console.log('Generated code:', codeControl?.value);
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

      console.log('Payee changed:', payeeName);
      console.log('Cheque payee set to:', chequePayeeControl?.value);
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
