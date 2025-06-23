import { createAction, props } from '@ngrx/store';
import { Requisition } from '../../models/requisition.model';

export const loadRequisitions = createAction('[Requisition] Load Requisitions');
export const loadRequisitionsSuccess = createAction('[Requisition] Load Success', props<{ requisitions: Requisition[] }>());
export const loadRequisitionsFailure = createAction('[Requisition] Load Failure', props<{ error: string }>());
