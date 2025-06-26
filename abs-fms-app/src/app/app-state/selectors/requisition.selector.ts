import { createFeatureSelector, createSelector } from "@ngrx/store";
import { RequisitionState } from "../state/requisition.state";

export const requisitionSelectors = createFeatureSelector<RequisitionState>('requisitionsState')


export const selectRequisitions = createSelector(
    requisitionSelectors,
    (state) => state.requisitions
);

export const selectRequisitionsLoading = createSelector(
    requisitionSelectors,
    (state) => state.loading
);

export const selectRequisitionsError = createSelector(
    requisitionSelectors,
    (state) => state.error
);















// Uncomment the following selectors if needed for specific use cases


// export const selectRequisitionById = (id: string) => createSelector(
//     requisitionSelectors,
//     (state) => state.requisitions.find(requisition => requisition.id === id)
// );
// export const selectRequisitionsByStatus = (status: string) => createSelector(
//     requisitionSelectors,
//     (state) => state.requisitions.filter(requisition => requisition.status === status)
// );
// export const selectRequisitionsByUserId = (userId: string) => createSelector(
//     requisitionSelectors,
//     (state) => state.requisitions.filter(requisition => requisition.userId === userId)
// );
// export const selectRequisitionsByDateRange = (startDate: Date, endDate: Date) => createSelector(
//     requisitionSelectors,
//     (state) => state.requisitions.filter(requisition => {
//         const date = new Date(requisition.date);
//         return date >= startDate && date <= endDate;
//     })
// );
// export const selectRequisitionsBySearchTerm = (searchTerm: string) => createSelector(
//     requisitionSelectors,
//     (state) => state.requisitions.filter(requisition =>
//         requisition.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         requisition.description.toLowerCase().includes(searchTerm.toLowerCase())
//     )
// );