import { Requisition } from '../../models/requisition.model';

export interface RequisitionState {
  requisitions: Requisition[];
  loading: boolean;
  error: string | null;
}

export const initialRequisitionState: RequisitionState = {
  requisitions: [],
  loading: false,
  error: null
};
