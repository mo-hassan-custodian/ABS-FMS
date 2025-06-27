import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Requisition } from '../../../../../models/requisition.model';
import { RequisitionService } from '../../../../../services/requisition.service';
import { CURRENCIES, PAYEE_TYPES, PAYMENT_OPTIONS } from '../../../../../constants/requisition.constants';

@Component({
  selector: 'app-requisition-view',
  templateUrl: './requisition-view.component.html',
  styleUrls: ['./requisition-view.component.css']
})
export class RequisitionViewComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  requisition: Requisition | null = null;
  isLoading = true;
  
  // Dropdown data for display
  currencies = CURRENCIES;
  payeeTypes = PAYEE_TYPES;
  paymentOptions = PAYMENT_OPTIONS;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private requisitionService: RequisitionService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadRequisition();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadRequisition(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.requisitionService.getRequisitionById(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (requisition) => {
            this.requisition = requisition || null;
            this.isLoading = false;
            if (!requisition) {
              this.toastr.error('Requisition not found', 'Error');
            }
          },
          error: (error) => {
            console.error('Error loading requisition:', error);
            this.toastr.error('Error loading requisition', 'Error');
            this.isLoading = false;
          }
        });
    } else {
      this.isLoading = false;
      this.toastr.error('No requisition ID provided', 'Error');
    }
  }

  goBack(): void {
    this.router.navigate(['/App/manage-requisitions']);
  }

  formatCurrency(amount: number, currencyCode: string): string {
    const currency = this.currencies.find(c => c.value === currencyCode);
    return currency ? `${currency.symbol}${amount.toLocaleString()}` : amount.toString();
  }

  getTypeLabel(type: string): string {
    const typeOption = this.payeeTypes.find(option => option.value === type);
    return typeOption ? typeOption.name : type;
  }

  getPaymentOptionLabel(option: string): string {
    const paymentOption = this.paymentOptions.find(opt => opt.value === option);
    return paymentOption ? paymentOption.name : option;
  }
}
