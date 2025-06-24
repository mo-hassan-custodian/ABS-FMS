import { createReducer, on } from "@ngrx/store";
import { initialRequisitionState } from "../state/requisition.state";
import { loadRequisitions, loadRequisitionsFailure, loadRequisitionsSuccess } from "../action/requisitions.action";

export const requisitionReducer = createReducer(
    initialRequisitionState,
    on(loadRequisitions, (state) => ({ ...state, loading: true })),
    on(loadRequisitionsSuccess, (state, { requisitions }) => ({
        ...state,
        loading: false,
        requisitions: requisitions
    })),
    on(loadRequisitionsFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error: error
    })
    )
);