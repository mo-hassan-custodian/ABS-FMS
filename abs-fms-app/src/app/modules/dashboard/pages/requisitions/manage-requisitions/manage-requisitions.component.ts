import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged, startWith, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Requisition, RequisitionFilter } from '../../../../../models/requisition.model';
import { RequisitionService } from '../../../../../services/requisition.service';
import { CURRENCIES, PAYEE_TYPES, PAYMENT_OPTIONS } from '../../../../../constants/requisition.constants';

@Component({
  selector: 'app-manage-requisitions',
  templateUrl: './manage-requisitions.component.html',
  styleUrls: ['./manage-requisitions.component.css']
})
export class ManageRequisitionsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Search and filter
  searchForm!: FormGroup;
  allRequisitions: Requisition[] = [];
  filteredRequisitions!: Observable<Requisition[]>;
  selectedRequisition: Requisition | null = null;

  // Dropdown data
  currencies = CURRENCIES;
  payeeTypes = PAYEE_TYPES;
  paymentOptions = PAYMENT_OPTIONS;

  statusOptions = [
    { value: 'ALL', label: 'All Status' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Approved', label: 'Approved' },
    { value: 'Rejected', label: 'Rejected' }
  ];

  typeOptions = [
    { value: 'ALL', label: 'All Types' },
    { value: 'SUPPLIER', label: 'Supplier' },
    { value: 'MEDICAL_PROVIDER', label: 'Medical Provider' },
    { value: 'CONTRACTOR', label: 'Contractor' },
    { value: 'EMPLOYEE', label: 'Employee' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private requisitionService: RequisitionService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.initializeSearchForm();
    this.loadRequisitions();
    this.setupAutocomplete();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeSearchForm(): void {
    this.searchForm = this.formBuilder.group({
      searchTerm: [''],
      type: ['ALL'],
      status: ['ALL'],
      dateFrom: [''],
      dateTo: ['']
    });
  }

  private loadRequisitions(): void {
    this.requisitionService.getAllRequisitions()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (requisitions) => {
          this.allRequisitions = requisitions;
          console.log('Loaded requisitions:', requisitions.length);
        },
        error: (error) => {
          console.error('Error loading requisitions:', error);
          this.toastr.error('Error loading requisitions', 'Error');
        }
      });
  }

  private setupAutocomplete(): void {
    this.filteredRequisitions = this.searchForm.get('searchTerm')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      map(searchValue => this.filterRequisitions(searchValue || ''))
    );
  }

  filterRequisitions(searchValue: string): Requisition[] {
    if (!searchValue.trim()) {
      return [];
    }

    const formValue = this.searchForm.value;
    let filtered = [...this.allRequisitions];

    console.log('Search term:', searchValue, 'Total requisitions:', this.allRequisitions.length);

    // Apply search term filter
    const searchTerm = searchValue.toLowerCase();
    filtered = filtered.filter(requisition =>
      requisition.code.toLowerCase().includes(searchTerm) ||
      requisition.payee.toLowerCase().includes(searchTerm) ||
      requisition.narrative.toLowerCase().includes(searchTerm) ||
      requisition.invoiceNo.toLowerCase().includes(searchTerm) ||
      requisition.chequePayee.toLowerCase().includes(searchTerm) ||
      requisition.type.toLowerCase().includes(searchTerm) ||
      requisition.status.toLowerCase().includes(searchTerm)
    );

    console.log('Filtered results:', filtered.length);

    // Apply type filter
    if (formValue.type && formValue.type !== 'ALL') {
      filtered = filtered.filter(requisition => requisition.type === formValue.type);
    }

    // Apply status filter
    if (formValue.status && formValue.status !== 'ALL') {
      filtered = filtered.filter(requisition => requisition.status === formValue.status);
    }

    // Apply date range filter
    if (formValue.dateFrom) {
      const dateFrom = new Date(formValue.dateFrom);
      filtered = filtered.filter(requisition => requisition.createdDate >= dateFrom);
    }
    if (formValue.dateTo) {
      const dateTo = new Date(formValue.dateTo);
      filtered = filtered.filter(requisition => requisition.createdDate <= dateTo);
    }

    return filtered;
  }

  onRequisitionSelected(requisition: Requisition): void {
    this.selectedRequisition = requisition;
    this.toastr.info(`Opening requisition ${requisition.code}`, 'Loading...');
    this.router.navigate(['/App/requisition-view', requisition.id]);
  }

  displayRequisitionInfo(requisition: Requisition | null | undefined): string {
    if (!requisition) {
      return '';
    }
    return `${requisition.code} - ${requisition.payee}`;
  }

  formatCurrency(amount: number, currencyCode: string): string {
    const currency = this.currencies.find(c => c.value === currencyCode);
    return currency ? `${currency.symbol}${amount.toLocaleString()}` : amount.toString();
  }

  getTypeLabel(type: string): string {
    const typeOption = this.typeOptions.find(option => option.value === type);
    return typeOption ? typeOption.label : type;
  }

  getStatusLabel(status: string): string {
    const statusOption = this.statusOptions.find(option => option.value === status);
    return statusOption ? statusOption.label : status;
  }

  clearSearch(): void {
    this.searchForm.patchValue({
      searchTerm: '',
      type: 'ALL',
      status: 'ALL',
      dateFrom: '',
      dateTo: ''
    });
  }

  trackByRequisitionId(index: number, requisition: Requisition): string {
    return requisition.id;
  }
}
//     this.loadPayees();
//     this.setupPayeeAutocomplete();
//     this.subscribeToPayeeCreation();
//   }

//   ngOnDestroy(): void {
//     this.destroy$.next();
//     this.destroy$.complete();
//   }

//   loadRequisitions(): void {

//     this.requisitionService.getAllRequisitions()
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: (requisitions) => {
//           this.requisitions = requisitions;
//           this.dataSource.data = requisitions;
//         },
//         error: (error) => {
//           console.error('Error loading requisitions:', error);
//         }
//       });
//   }

//   ngAfterViewInit(): void {
//     this.dataSource.paginator = this.paginator;
//     this.dataSource.sort = this.sort;
//   }

//   loadPayees(): void {
//     // Subscribe to the payees observable for real-time updates
//     this.payeeService.payees$
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: (payees) => {
//           this.payees = payees;
//         },
//         error: (error) => {
//           console.error('Error loading payees:', error);
//         }
//       });
//   }

//   setupPayeeAutocomplete(): void {
//     this.filteredPayees = this.requisitionForm.get('payee')!.valueChanges.pipe(
//       startWith(''),
//       debounceTime(300),
//       distinctUntilChanged(),
//       map(value => {
//         const filterValue = typeof value === 'string' ? value : value?.name || '';

//         // If user is typing manually (string input), clear auto-populated information
//         if (typeof value === 'string' && this.selectedPayee && value !== this.selectedPayee.name) {
//           this.clearPayeeInformation();
//         }

//         return this._filterPayees(filterValue);
//       })
//     );
//   }

//   private _filterPayees(value: string): Payee[] {
//     const filterValue = value.toLowerCase();
//     return this.payees.filter(payee =>
//       payee.name.toLowerCase().includes(filterValue) ||
//       payee.pinNo.toLowerCase().includes(filterValue) ||
//       payee.bankName.toLowerCase().includes(filterValue)
//     );
//   }

//   subscribeToPayeeCreation(): void {
//     this.payeeService.payeeCreated$
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: (newPayee) => {
//           // The payees array is automatically updated through the service observable
//           // Just select and auto-populate the newly created payee
//           this.selectedPayee = newPayee;
//           this.populatePayeeInformation(newPayee);
//         }
//       });
//   }


//   authorize(element: Requisition): void {
//     const dialogRef = this._dialog.open(ConfirmationComponent, {
//       width: '400px',
//       data: {
//         title: 'Authorize Requisition',
//         message: `Are you sure you want to authorize the requisition with code ${element.code}?`,
//         confirmButtonText: 'Authorize',
//         cancelButtonText: 'Cancel'
//       }
//     });
//     dialogRef.afterClosed()
//       .pipe(takeUntil(this.destroy$))
//       .subscribe(result => {
//         if (result) {

//           this.requisitionService.updateRequisitionStatus(element.id, 'Approved')
//             .pipe(takeUntil(this.destroy$))
//             .subscribe({
//               next: (success) => {
//                 if (success) {
//                   this.toastr.success('Requisition approved successfully!', 'Success');
//                   this.loadRequisitions();
//                 }
//               },
//               error: (error) => {
//                 console.error('Error approving requisition:', error);
//                 this.toastr.error('Error approving requisition.', 'Error');
//               }
//             });
//         }
//       });
//   }


//   reject(element: Requisition): void {
//     this._dialog.open(ConfirmationComponent, {
//       width: '400px',
//       data: {
//         title: 'Reject Requisition',
//         message: `Are you sure you want to reject the requisition with code ${element.code}?`,
//         confirmButtonText: 'Reject',
//         cancelButtonText: 'Cancel'
//       }
//     })
//       .afterClosed()
//       .pipe(takeUntil(this.destroy$))
//       .subscribe(result => {
//         if (result) {
//           this.requisitionService.updateRequisitionStatus(element.id, 'Rejected')
//             .pipe(takeUntil(this.destroy$))
//             .subscribe({
//               next: (success) => {
//                 if (success) {
//                   this.toastr.warning('Requisition rejected successfully!', 'Rejected');
//                   this.loadRequisitions();
//                 }
//               },
//               error: (error) => {
//                 console.error('Error rejecting requisition:', error);
//                 this.toastr.error('Error rejecting requisition.', 'Error');
//               }
//             });
//         }
//       });

//   }

//   viewDetails(item: Requisition): void {
//     this.selectedRequisition = item;

//     this.showViewDetailsModal = true;
//   }

//   editRequisition(element: Requisition): void {
//     this.selectedRequisition = element;
//     this.showEditModal = true;
//     this.editForm.patchValue(element);
//   }

//   closeViewDetailsModal(): void {
//     this.showViewDetailsModal = false;
//     this.selectedRequisition = null;

//     this.editForm.reset();
//   }
//   closeEditModal(): void {
//     this.showEditModal = false;
//     this.editForm.reset();
//   }

//   // enableEditMode(): void {
//   //   if (this.selectedRequisition) {
//   //     // Populate edit form with current requisition data
//   //     this.editForm.patchValue({
//   //       payee: this.selectedRequisition.payee,
//   //       code: this.selectedRequisition.code,
//   //       chequePayee: this.selectedRequisition.chequePayee,
//   //       payeeBankBranch: this.selectedRequisition.payeeBankBranch,
//   //       payeeAccountNo: this.selectedRequisition.payeeAccountNo,
//   //       narrative: this.selectedRequisition.narrative,
//   //       invoiceNo: this.selectedRequisition.invoiceNo,
//   //       invoiceDate: this.selectedRequisition.invoiceDate,
//   //       amount: this.selectedRequisition.amount,
//   //       currency: this.selectedRequisition.currency,
//   //       bankAccount: this.selectedRequisition.bankAccount,
//   //       type: this.selectedRequisition.type,
//   //       paymentOption: this.selectedRequisition.paymentOption
//   //     });
//   //   }
//   // }

//   cancelEdit(): void {

//     this.editForm.reset();
//   }

//   updateRequisition(): void {
//     if (this.editForm.valid && this.selectedRequisition) {
//       const formData = this.editForm.value;

//       const updates: Partial<Requisition> = {
//         payee: formData.payee,
//         code: formData.code,
//         chequePayee: formData.chequePayee,
//         payeeBankBranch: formData.payeeBankBranch,
//         payeeAccountNo: formData.payeeAccountNo,
//         narrative: formData.narrative,
//         invoiceNo: formData.invoiceNo,
//         invoiceDate: formData.invoiceDate,
//         amount: formData.amount,
//         currency: formData.currency,
//         bankAccount: formData.bankAccount,
//         type: formData.type,
//         paymentOption: formData.paymentOption
//       };

//       this.requisitionService.updateRequisition(this.selectedRequisition.id, updates)
//         .pipe(takeUntil(this.destroy$))
//         .subscribe({
//           next: (updatedRequisition) => {
//             if (updatedRequisition) {
//               this.toastr.success('Requisition updated successfully!', 'Updated');
//               this.closeViewDetailsModal();
//               this.loadRequisitions(); // Refresh the table
//             }
//           },
//           error: (error) => {
//             console.error('Error updating requisition:', error);
//             this.toastr.error('Error updating requisition. Please try again.', 'Error');
//           }
//         });
//     } else {
//       this.markFormGroupTouched(this.editForm);
//       this.toastr.warning('Please fill in all required fields.', 'Validation Error');
//     }
//   }

//   deleteRequisition(element: Requisition): void {
//     this._dialog.open(ConfirmationComponent, {
//       width: '400px',
//       data: {
//         title: 'Delete Requisition',
//         message: `Are you sure you want to delete the requisition with code ${element.code}? This action cannot be undone.`,
//         confirmButtonText: 'Delete',
//         cancelButtonText: 'Cancel'
//       }
//     })
//       .afterClosed()
//       .pipe(takeUntil(this.destroy$))
//       .subscribe(result => {
//         if (result) {
//           this.requisitionService.deleteRequisition(element.id)
//             .pipe(takeUntil(this.destroy$))
//             .subscribe({
//               next: () => {
//                 this.toastr.success('Requisition deleted successfully!', 'Deleted');
//                 this.loadRequisitions();
//               },
//               error: (error) => {
//                 console.error('Error deleting requisition:', error);
//                 this.toastr.error('Error deleting requisition. Please try again.', 'Error');
//               }
//             });
//         }
//       }
//       );
//   }

//   // Search functionality
//   applyFilter(event: Event): void {
//     const filterValue = (event.target as HTMLInputElement).value;
//     this.dataSource.filter = filterValue.trim().toLowerCase();

//     if (this.dataSource.paginator) {
//       this.dataSource.paginator.firstPage();
//     }
//   }

//   initializeForms(): void {
//     // Initialize requisition form
//     this.requisitionForm = this.formBuilder.group({
//       payee: ['', Validators.required],
//       code: ['', [Validators.required, Validators.minLength(3)]],
//       chequePayee: ['', Validators.required],
//       payeeBankBranch: ['', Validators.required],
//       payeeAccountNo: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
//       narrative: ['', [Validators.required, Validators.maxLength(500)]],
//       invoiceNo: ['', Validators.required],
//       invoiceDate: [null, Validators.required], // Changed to null for proper date picker handling
//       amount: ['', [Validators.required, Validators.min(0.01)]],
//       currency: ['NGN', Validators.required],
//       bankAccount: ['', Validators.required],
//       type: ['', Validators.required],
//       paymentOption: ['', Validators.required]
//     });

//     // Initialize edit form (same structure as requisition form)
//     this.editForm = this.formBuilder.group({
//       payee: ['', Validators.required],
//       code: ['', [Validators.required, Validators.minLength(3)]],
//       chequePayee: ['', Validators.required],
//       payeeBankBranch: ['', Validators.required],
//       payeeAccountNo: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
//       narrative: ['', [Validators.required, Validators.maxLength(500)]],
//       invoiceNo: ['', Validators.required],
//       invoiceDate: [null, Validators.required],
//       amount: ['', [Validators.required, Validators.min(0.01)]],
//       currency: ['NGN', Validators.required],
//       bankAccount: ['', Validators.required],
//       type: ['', Validators.required],
//       paymentOption: ['', Validators.required]
//     });

//     // Initialize payee form
//     this.payeeForm = this.formBuilder.group({
//       name: ['', Validators.required],
//       createdFrom: ['', Validators.required],
//       shortDescription: [''],
//       pinNo: ['', Validators.required],
//       bankName: ['', Validators.required],
//       bankBranch: ['', Validators.required],
//       accountNumber: ['', Validators.required],
//       physicalAddress: ['', Validators.required],
//       postalAddress: ['', Validators.required]
//     });
//   }

//   // Modal control methods
//   openSearchModal(): void {
//     // TODO: Implement search functionality
//   }

//   // TrackBy function for better performance in ngFor
//   trackByValue(_index: number, item: any): any {
//     return item.value;
//   }


//   openCreateRequisitionModal(): void {
//     this.showCreateRequisitionModal = true;
//     this.requisitionForm.reset();
//     this.requisitionForm.patchValue({ currency: 'NGN' }); // Set default currency
//   }

//   closeCreateRequisitionModal(): void {
//     this.showCreateRequisitionModal = false;
//     this.requisitionForm.reset();
//   }

//   openCreatePayeeModal(): void {
//     this.showCreatePayeeModal = true;
//     this.payeeForm.reset();
//   }

//   closeCreatePayeeModal(): void {
//     this.showCreatePayeeModal = false;
//     this.payeeForm.reset();
//   }

//   // Save methods
//   saveRequisition(): void {
//     // Get form data including disabled fields
//     const formData = this.getFormDataIncludingDisabled();

//     if (this.isFormValidIncludingDisabled()) {

//       // Create the requisition request object
//       const requisitionRequest: RequisitionCreateRequest = {
//         code: formData.code,
//         payee: formData.payee,
//         chequePayee: formData.chequePayee,
//         payeeBankBranch: formData.payeeBankBranch,
//         payeeAccountNo: formData.payeeAccountNo,
//         narrative: formData.narrative,
//         invoiceNo: formData.invoiceNo,
//         invoiceDate: formData.invoiceDate,
//         amount: formData.amount,
//         currency: formData.currency,
//         bankAccount: formData.bankAccount,
//         type: formData.type,
//         paymentOption: formData.paymentOption
//       };


//       // Save using the service
//       this.requisitionService.createRequisition(requisitionRequest)
//         .pipe(takeUntil(this.destroy$))
//         .subscribe({
//           next: (newRequisition) => {

//             // Close modal after successful save
//             this.closeCreateRequisitionModal();

//             // Show success message
//             this.toastr.success('Requisition created successfully!', 'Success');

//             this.loadRequisitions();
//           },
//           error: (error) => {
//             console.error('Error creating requisition:', error);
//             this.toastr.error('Error creating requisition. Please try again.', 'Error');
//           }
//         });
//     } else {
//       // Mark all fields as touched to show validation errors
//       this.markFormGroupTouched(this.requisitionForm);
//       this.toastr.warning('Please fill in all required fields.', 'Validation Error');
//     }
//   }

//   savePayee(): void {
//     if (this.payeeForm.valid) {
//       const payeeData: PayeeCreateRequest = this.payeeForm.value;

//       // Auto-fill short description if not provided
//       if (!payeeData.shortDescription || payeeData.shortDescription.trim() === '') {
//         payeeData.shortDescription = payeeData.name;
//       }

//       this.payeeService.createPayee(payeeData)
//         .pipe(takeUntil(this.destroy$))
//         .subscribe({
//           next: (newPayee) => {
//             this.closeCreatePayeeModal();
//             this.toastr.success('Payee created and selected successfully!', 'Success');
//           },
//           error: (error) => {
//             console.error('Error creating payee:', error);
//             this.toastr.error('Error creating payee. Please try again.', 'Error');
//           }
//         });
//     } else {
//       // Mark all fields as touched to show validation errors
//       this.markFormGroupTouched(this.payeeForm);
//       this.toastr.warning('Please fill in all required fields.', 'Validation Error');
//     }
//   }

//   onPayeeSelected(payee: Payee | string): void {
//     if (payee === 'CREATE_NEW') {
//       this.openCreatePayeeFromRequisition();
//       return;
//     }

//     const selectedPayee = payee as Payee;
//     this.selectedPayee = selectedPayee;

//     // Auto-populate payee information
//     this.populatePayeeInformation(selectedPayee);
//   }

//   populatePayeeInformation(payee: Payee): void {
//     // Auto-populate form fields with payee information
//     this.requisitionForm.patchValue({
//       payee: payee.name,
//       chequePayee: payee.name, // Default to payee name
//       payeeBankBranch: payee.bankBranch || '',
//       payeeAccountNo: payee.accountNumber || ''
//     });

//     // Find and set the bank name if it exists in our bank list
//     const bankName = payee.bankName;
//     if (bankName) {
//       this.requisitionForm.patchValue({
//       });
//     }

//     // Disable fields that have been auto-populated (unless they're empty)
//     this.updateFieldDisabledState(payee);
//   }

//   updateFieldDisabledState(payee: Payee): void {
//     const chequePayeeControl = this.requisitionForm.get('chequePayee');
//     const bankBranchControl = this.requisitionForm.get('payeeBankBranch');
//     const accountNoControl = this.requisitionForm.get('payeeAccountNo');

//     // Disable cheque payee field if payee name is available
//     if (payee.name && chequePayeeControl) {
//       chequePayeeControl.disable();
//     }

//     // Disable bank branch field if bank branch is available
//     if (payee.bankBranch && bankBranchControl) {
//       bankBranchControl.disable();
//     }

//     // Disable account number field if account number is available
//     if (payee.accountNumber && accountNoControl) {
//       accountNoControl.disable();
//     }
//   }

//   clearPayeeInformation(): void {
//     // Re-enable all payee-related fields
//     const chequePayeeControl = this.requisitionForm.get('chequePayee');
//     const bankBranchControl = this.requisitionForm.get('payeeBankBranch');
//     const accountNoControl = this.requisitionForm.get('payeeAccountNo');

//     if (chequePayeeControl) chequePayeeControl.enable();
//     if (bankBranchControl) bankBranchControl.enable();
//     if (accountNoControl) accountNoControl.enable();

//     // Clear the fields
//     this.requisitionForm.patchValue({
//       chequePayee: '',
//       payeeBankBranch: '',
//       payeeAccountNo: ''
//     });

//     this.selectedPayee = null;
//   }

//   displayPayeeName(payee: Payee | string): string {
//     if (typeof payee === 'string') {
//       return payee === 'CREATE_NEW' ? '' : payee;
//     }
//     return payee ? payee.name : '';
//   }

//   openCreatePayeeFromRequisition(): void {
//     this.showCreatePayeeModal = true;
//     this.payeeForm.reset();
//     // Clear the payee field to avoid showing "CREATE_NEW"
//     this.requisitionForm.patchValue({
//       payee: ''
//     });
//   }

//   getFormDataIncludingDisabled(): any {
//     // Get raw value includes disabled fields
//     return this.requisitionForm.getRawValue();
//   }

//   isFormValidIncludingDisabled(): boolean {
//     // Check if required fields have values (including disabled ones)
//     const formData = this.getFormDataIncludingDisabled();

//     // Check required fields
//     const requiredFields = ['payee', 'code', 'chequePayee', 'payeeBankBranch',
//       'payeeAccountNo', 'narrative', 'invoiceNo', 'invoiceDate',
//       'amount', 'currency', 'bankAccount', 'type', 'paymentOption'];

//     return requiredFields.every(field => {
//       const value = formData[field];
//       return value !== null && value !== undefined && value !== '';
//     });
//   }

//   // Auto-fill short description when name changes
//   onPayeeNameChange(): void {
//     const nameValue = this.payeeForm.get('name')?.value;
//     const shortDescControl = this.payeeForm.get('shortDescription');

//     if (nameValue && (!shortDescControl?.value || shortDescControl?.value.trim() === '')) {
//       shortDescControl?.setValue(nameValue);
//     }
//   }

//   // Utility method to mark all form fields as touched
//   private markFormGroupTouched(formGroup: FormGroup): void {
//     Object.keys(formGroup.controls).forEach(key => {
//       const control = formGroup.get(key);
//       control?.markAsTouched();
//     });
//   }

//   // Helper method to check if a field has errors and is touched
//   hasError(fieldName: string, errorType?: string): boolean {
//     // Check in requisition form first, then payee form
//     let field = this.requisitionForm.get(fieldName);
//     if (!field) {
//       field = this.payeeForm.get(fieldName);
//     }

//     if (!field) return false;

//     if (errorType) {
//       return field.hasError(errorType) && field.touched;
//     }
//     return field.invalid && field.touched;
//   }

//   // Helper method to get error message for a field
//   getErrorMessage(fieldName: string): string {
//     // Check in requisition form first, then payee form
//     let field = this.requisitionForm.get(fieldName);
//     if (!field) {
//       field = this.payeeForm.get(fieldName);
//     }

//     if (!field || !field.errors) return '';

//     const errors = field.errors;

//     if (errors['required']) return `${this.getFieldDisplayName(fieldName)} is required`;
//     if (errors['minlength']) return `${this.getFieldDisplayName(fieldName)} must be at least ${errors['minlength'].requiredLength} characters`;
//     if (errors['maxlength']) return `${this.getFieldDisplayName(fieldName)} cannot exceed ${errors['maxlength'].requiredLength} characters`;
//     if (errors['pattern']) return `${this.getFieldDisplayName(fieldName)} format is invalid`;
//     if (errors['min']) return `${this.getFieldDisplayName(fieldName)} must be greater than ${errors['min'].min}`;

//     return 'Invalid input';
//   }

//   private getFieldDisplayName(fieldName: string): string {
//     const displayNames: { [key: string]: string } = {
//       code: 'Code',
//       chequePayee: 'Input Cheque Payee',
//       payee: 'Payee',
//       payeeBankBranch: 'Payee Bank Branch',
//       payeeAccountNo: 'Payee Account Number',
//       narrative: 'Narrative',
//       invoiceNo: 'Invoice Number',
//       invoiceDate: 'Invoice Date',
//       amount: 'Amount',
//       currency: 'Currency',
//       bankAccount: 'Bank Account',
//       type: 'Type',
//       paymentOption: 'Payment Option'
//     };

//     return displayNames[fieldName] || fieldName;
//   }

//   // Utility method to generate auto code based on payee name (for requisition form)
//   onRequisitionPayeeNameChange(): void {
//     const payeeName = this.requisitionForm.get('payee')?.value;
//     const codeControl = this.requisitionForm.get('code');

//     if (payeeName && payeeName.trim().length > 0) {
//       // Generate a simple code from payee name if code field is empty
//       if (!codeControl?.value) {
//         const code = payeeName.substring(0, 3).toUpperCase() +
//           Math.floor(Math.random() * 1000).toString().padStart(3, '0');
//         codeControl?.setValue(code);
//       }
//     }
//   }

//   // Utility method to auto-fill cheque payee from payee name
//   onPayeeChange(): void {
//     const payeeName = this.requisitionForm.get('payee')?.value;
//     const chequePayeeControl = this.requisitionForm.get('chequePayee');

//     if (payeeName && payeeName.trim().length > 0) {
//       // Auto-fill cheque payee if it's empty
//       if (!chequePayeeControl?.value) {
//         chequePayeeControl?.setValue(payeeName);
//       }
//     }
//   }

//   // Method to get today's date for date picker
//   getTodayDate(): Date {
//     return new Date();
//   }

//   // Method to get max date (e.g., 30 days from today)
//   getMaxDate(): Date {
//     const maxDate = new Date();
//     maxDate.setDate(maxDate.getDate() + 30);
//     return maxDate;
//   }

//   // Method to format currency display
//   formatCurrency(amount: number, currencyCode: string): string {
//     const currency = this.currencies.find(c => c.value === currencyCode);
//     return currency ? `${currency.symbol}${amount.toLocaleString()}` : amount.toString();
//   }

// }
