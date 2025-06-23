import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import * as RequisitionActions from '../action/requisitions.action';
import { RequisitionService } from '../../services/requisition.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class RequisitionEffects {
  constructor(
    private actions$: Actions, 
    private toastr: ToastrService,
    private requisitionService: RequisitionService) {}

    loadRequisitions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RequisitionActions.loadRequisitions),
      mergeMap(() =>
        this.requisitionService.getAllRequisitions().pipe(
          map(requisitions => RequisitionActions.loadRequisitionsSuccess({ requisitions })),
          tap(()=> this.toastr.success('Requisitions loaded successfully')),
          catchError(error => of(RequisitionActions.loadRequisitionsFailure({error: error.message})))
        )
      )
    )
  );
}