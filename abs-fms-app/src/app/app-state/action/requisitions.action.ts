import { createAction, props } from '@ngrx/store';
import { Requisition } from '../../models/requisition.model';

export const loadRequisitions = createAction('[Requisition] Load Requisitions');
export const loadRequisitionsSuccess = createAction('[Requisition] Load Success', props<{ requisitions: Requisition[] }>());
export const loadRequisitionsFailure = createAction('[Requisition] Load Failure', props<{ error: string }>());

export const createRequisition = createAction('[Requisition] Create', props<{ requisition: Requisition }>());
export const createRequisitionSuccess = createAction('[Requisition] Create Success', props<{ requisition: Requisition }>());
export const createRequisitionFailure = createAction('[Requisition] Create Failure', props<{ error: any }>());

export const updateRequisition = createAction('[Requisition] Update', props<{ requisition: Requisition }>());
export const updateRequisitionSuccess = createAction('[Requisition] Update Success', props<{ requisition: Requisition }>());
export const updateRequisitionFailure = createAction('[Requisition] Update Failure', props<{ error: any }>());

export const deleteRequisition = createAction('[Requisition] Delete', props<{ id: string }>());
export const deleteRequisitionSuccess = createAction('[Requisition] Delete Success', props<{ id: string }>());
export const deleteRequisitionFailure = createAction('[Requisition] Delete Failure', props<{ error: any }>());

export const authorizeRequisition = createAction('[Requisition] Authorize', props<{ id: string }>());
export const authorizeRequisitionSuccess = createAction('[Requisition] Authorize Success', props<{ id: string }>());
export const authorizeRequisitionFailure = createAction('[Requisition] Authorize Failure', props<{ error: any }>());

export const rejectRequisition = createAction('[Requisition] Reject', props<{ id: string }>());
export const rejectRequisitionSuccess = createAction('[Requisition] Reject Success', props<{ id: string }>());
export const rejectRequisitionFailure = createAction('[Requisition] Reject Failure', props<{ error: any }>());

