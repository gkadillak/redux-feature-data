import { createSlice, PayloadAction } from '@reduxjs/toolkit';

enum ResourceStatus {
    IS_FETCHING = "IS_FETCHING",
    HAS_FETCHED_SUCCESS = "HAS_FETCHED_SUCCESS",
    HAS_FETCHED_ERROR = "HAS_FETCHED_ERROR",
}

interface FeaturePayload {
    name: string;
}

interface FetchFeatureSuccessPayload extends FeaturePayload {
    data: any[];
}

interface FetchFeatureErrorPayload extends FeaturePayload {
    error: any;
}

interface FeatureSlice {
    [key: string]: { status: ResourceStatus, data?: any[], error?: any }
}

const initialState: FeatureSlice = {};

export const { reducer, actions } = createSlice({
    name: 'featureData',
    initialState: initialState,
    reducers: {
        onFetchData(state, action: PayloadAction<FeaturePayload>) {
            let featureSlice = state[action.payload.name];
            if (!featureSlice) {
                featureSlice = { status: ResourceStatus.IS_FETCHING }
            } else {
                featureSlice.status = ResourceStatus.IS_FETCHING;
            }
            state[action.payload.name] = featureSlice;
        },
        onFetchDataSuccess(state, action: PayloadAction<FetchFeatureSuccessPayload>) {
            state[action.payload.name].status = ResourceStatus.HAS_FETCHED_SUCCESS;
            state[action.payload.name].data = action.payload.data;
        },
        onFetchDataError(state, action: PayloadAction<FetchFeatureErrorPayload>) {
            state[action.payload.name].status = ResourceStatus.HAS_FETCHED_ERROR;
            state[action.payload.name].error = action.payload.error;
        }
    }
})

export default reducer;