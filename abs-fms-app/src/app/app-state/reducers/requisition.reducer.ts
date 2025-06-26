import { createReducer, on } from "@ngrx/store";
import { initialRequisitionState } from "../state/requisition.state";
import { authorizeRequisitionSuccess, createRequisitionSuccess, deleteRequisitionSuccess, loadRequisitions, loadRequisitionsFailure, loadRequisitionsSuccess, rejectRequisitionSuccess, updateRequisitionSuccess } from "../action/requisitions.action";

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
    })),

    on(createRequisitionSuccess, (state, { requisition }) => ({
        ...state,
        requisitions: [...state.requisitions, requisition],
    })),

    on(updateRequisitionSuccess, (state, { requisition }) => ({
        ...state,
        requisitions: state.requisitions.map(r => r.id === requisition.id ? requisition : r),
    })),

    // on(deleteRequisitionSuccess, (state, { id }) => ({
    //     ...state,
    //     requisitions: state.requisitions.filter(r => r.id !== id),
    // })),

    // on(authorizeRequisitionSuccess, (state, { id }) => ({
    //     ...state,
    //     requisitions: state.requisitions.map(r => r.id === id ? { ...r, status: 'Approved' } : r),
    // })),

    // on(rejectRequisitionSuccess, (state, { id }) => ({
    //     ...state,
    //     requisitions: state.requisitions.map(r => r.id === id ? { ...r, status: 'Rejected' } : r),
    // }))
);


