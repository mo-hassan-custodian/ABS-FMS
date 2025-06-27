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
    private requisitionService: RequisitionService
  ) {}

  loadRequisitions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RequisitionActions.loadRequisitions),
      mergeMap(() =>
        this.requisitionService.getAllRequisitions().pipe(
          map(requisitions => RequisitionActions.loadRequisitionsSuccess({ requisitions })),
          tap(() => this.toastr.success('Requisitions loaded successfully')),
          catchError(error => of(RequisitionActions.loadRequisitionsFailure({ error: error.message })))
        )
      )
    )
  );

  createRequisition$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RequisitionActions.createRequisition),
      mergeMap(({ requisition }) =>
        this.requisitionService.createRequisition(requisition).pipe(
          map(res => RequisitionActions.createRequisitionSuccess({ requisition: res })),
          catchError(error => of(RequisitionActions.createRequisitionFailure({ error })))
        )
      )
    )
  );

  // updateRequisition$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(RequisitionActions.updateRequisition),
  //     mergeMap(({ requisition }) =>
  //       this.requisitionService.updateRequisition(requisition).pipe(
  //         map(res => RequisitionActions.updateRequisitionSuccess({ requisition: res })),
  //         catchError(error => of(RequisitionActions.updateRequisitionFailure({ error })))
  //       )
  //     )
  //   )
  // );

  // deleteRequisition$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(RequisitionActions.deleteRequisition),
  //     mergeMap(({ id }) =>
  //       this.requisitionService.deleteRequisition().pipe(
  //         map(() => RequisitionActions.deleteRequisitionSuccess({ id })),
  //         catchError(error => of(RequisitionActions.deleteRequisitionFailure({ error })))
  //       )
  //     )
  //   )
  // );

  // authorizeRequisition$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(RequisitionActions.authorizeRequisition),
  //     mergeMap(({ id }) =>
  //       this.requisitionService.updateRequisitionStatus(id, 'Approved').pipe(
  //         map(() => RequisitionActions.authorizeRequisitionSuccess({ id })),
  //         catchError(error => of(RequisitionActions.authorizeRequisitionFailure({ error })))
  //       )
  //     )
  //   )
  // );

  // rejectRequisition$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(RequisitionActions.rejectRequisition),
  //     mergeMap(({ id }) =>
  //       this.requisitionService.updateRequisitionStatus(id, 'Rejected').pipe(
  //         map(() => RequisitionActions.rejectRequisitionSuccess({ id })),
  //         catchError(error => of(RequisitionActions.rejectRequisitionFailure({ error })))
  //       )
  //     )
  //   )
  // );

  rejectRequisitionSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RequisitionActions.rejectRequisitionSuccess),
      tap(() => this.toastr.success('Requisition rejected successfully'))
    ),
    { dispatch: false }
  );

}