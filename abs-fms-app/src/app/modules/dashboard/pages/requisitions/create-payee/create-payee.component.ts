import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { PayeeService } from '../../../../../services/payee.service';
import { Payee, PayeeCreateRequest } from '../../../../../models/payee.model';

@Component({
  selector: 'app-create-payee',
  templateUrl: './create-payee.component.html',
  styleUrls: ['./create-payee.component.css']
})
export class CreatePayeeComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Form and data
  payeeForm!: FormGroup;
  dataSource = new MatTableDataSource<Payee>();
  displayedColumns: string[] = ['name', 'pinNo', 'bankName', 'bankBranch', 'accountNumber', 'status', 'actions'];

  // Modal visibility
  showCreatePayeeModal = false;
  showViewDetailsModal = false;
  selectedPayee: Payee | null = null;
  isEditMode = false;
  editForm!: FormGroup;

  // Dropdown options
  createdFromOptions = [
    { name: 'Manual Entry', value: 'MANUAL' },
    { name: 'System Import', value: 'IMPORT' },
    { name: 'System Generated', value: 'SYSTEM' },
    { name: 'External API', value: 'API' },
    { name: 'Bulk Upload', value: 'BULK' }
  ];

  bankBranches = [
    { name: 'Victoria Island', value: 'VICTORIA_ISLAND' },
    { name: 'Ikeja', value: 'IKEJA' },
    { name: 'Surulere', value: 'SURULERE' },
    { name: 'Yaba', value: 'YABA' },
    { name: 'Ikoyi', value: 'IKOYI' },
    { name: 'Lekki', value: 'LEKKI' },
    { name: 'Apapa', value: 'APAPA' },
    { name: 'Festac', value: 'FESTAC' }
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private payeeService: PayeeService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.loadPayees();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initializeForms(): void {
    // Initialize create payee form
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

    // Initialize edit form (same structure)
    this.editForm = this.formBuilder.group({
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

  loadPayees(): void {
    this.payeeService.getAllPayees()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (payees) => {
          this.dataSource.data = payees;
          if (this.paginator) {
            this.dataSource.paginator = this.paginator;
          }
          if (this.sort) {
            this.dataSource.sort = this.sort;
          }
        },
        error: (error) => {
          console.error('Error loading payees:', error);
          this.toastr.error('Error loading payees', 'Error');
        }
      });
  }

  // Modal controls
  openCreatePayeeModal(): void {
    this.showCreatePayeeModal = true;
    this.payeeForm.reset();
  }

  closeCreatePayeeModal(): void {
    this.showCreatePayeeModal = false;
    this.payeeForm.reset();
  }

  // Auto-fill short description when name changes
  onPayeeNameChange(): void {
    const nameValue = this.payeeForm.get('name')?.value;
    const shortDescControl = this.payeeForm.get('shortDescription');
    
    if (nameValue && (!shortDescControl?.value || shortDescControl?.value.trim() === '')) {
      shortDescControl?.setValue(nameValue);
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
            console.log('Payee created successfully:', newPayee);
            this.closeCreatePayeeModal();
            this.toastr.success('Payee created successfully!', 'Success');
            this.loadPayees(); // Refresh the table
          },
          error: (error) => {
            console.error('Error creating payee:', error);
            this.toastr.error('Error creating payee. Please try again.', 'Error');
          }
        });
    } else {
      this.markFormGroupTouched(this.payeeForm);
      this.toastr.warning('Please fill in all required fields.', 'Validation Error');
    }
  }

  // Table actions
  viewDetails(payee: Payee): void {
    this.selectedPayee = payee;
    this.isEditMode = false;
    this.showViewDetailsModal = true;
  }

  closeViewDetailsModal(): void {
    this.showViewDetailsModal = false;
    this.selectedPayee = null;
    this.isEditMode = false;
    this.editForm.reset();
  }

  enableEditMode(): void {
    if (this.selectedPayee) {
      this.isEditMode = true;
      this.editForm.patchValue({
        name: this.selectedPayee.name,
        createdFrom: this.selectedPayee.createdFrom,
        shortDescription: this.selectedPayee.shortDescription,
        pinNo: this.selectedPayee.pinNo,
        bankName: this.selectedPayee.bankName,
        bankBranch: this.selectedPayee.bankBranch,
        accountNumber: this.selectedPayee.accountNumber,
        physicalAddress: this.selectedPayee.physicalAddress,
        postalAddress: this.selectedPayee.postalAddress
      });
    }
  }

  cancelEdit(): void {
    this.isEditMode = false;
    this.editForm.reset();
  }

  updatePayee(): void {
    if (this.editForm.valid && this.selectedPayee) {
      const formData = this.editForm.value;
      
      const updates: Partial<Payee> = {
        name: formData.name,
        createdFrom: formData.createdFrom,
        shortDescription: formData.shortDescription || formData.name,
        pinNo: formData.pinNo,
        bankName: formData.bankName,
        bankBranch: formData.bankBranch,
        accountNumber: formData.accountNumber,
        physicalAddress: formData.physicalAddress,
        postalAddress: formData.postalAddress
      };

      this.payeeService.updatePayee(this.selectedPayee.id, updates)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updatedPayee) => {
            if (updatedPayee) {
              console.log('Payee updated successfully:', updatedPayee);
              this.toastr.success('Payee updated successfully!', 'Updated');
              this.closeViewDetailsModal();
              this.loadPayees();
            }
          },
          error: (error) => {
            console.error('Error updating payee:', error);
            this.toastr.error('Error updating payee. Please try again.', 'Error');
          }
        });
    } else {
      this.markFormGroupTouched(this.editForm);
      this.toastr.warning('Please fill in all required fields.', 'Validation Error');
    }
  }

  activatePayee(payee: Payee): void {
    this.payeeService.updatePayeeStatus(payee.id, 'Active')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (success) => {
          if (success) {
            this.toastr.success('Payee activated successfully!', 'Success');
            this.loadPayees();
          }
        },
        error: (error) => {
          console.error('Error activating payee:', error);
          this.toastr.error('Error activating payee.', 'Error');
        }
      });
  }

  suspendPayee(payee: Payee): void {
    this.payeeService.updatePayeeStatus(payee.id, 'Suspended')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (success) => {
          if (success) {
            this.toastr.warning('Payee suspended successfully!', 'Suspended');
            this.loadPayees();
          }
        },
        error: (error) => {
          console.error('Error suspending payee:', error);
          this.toastr.error('Error suspending payee.', 'Error');
        }
      });
  }

  deletePayee(payee: Payee): void {
    if (confirm('Are you sure you want to delete this payee?')) {
      this.payeeService.deletePayee(payee.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (success) => {
            if (success) {
              this.toastr.success('Payee deleted successfully!', 'Deleted');
              this.loadPayees();
            }
          },
          error: (error) => {
            console.error('Error deleting payee:', error);
            this.toastr.error('Error deleting payee.', 'Error');
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

  // Utility methods
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  trackByValue(index: number, item: any): any {
    return item.value;
  }

  // Auto-fill edit form short description when name changes
  onEditPayeeNameChange(): void {
    const nameValue = this.editForm.get('name')?.value;
    const shortDescControl = this.editForm.get('shortDescription');

    if (nameValue && (!shortDescControl?.value || shortDescControl?.value.trim() === '')) {
      shortDescControl?.setValue(nameValue);
    }
  }
}
