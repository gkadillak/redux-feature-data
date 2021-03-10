import { createSlice, PayloadAction } from '@reduxjs/toolkit';

enum ResourceStatus {
    IS_FETCHING = "IS_FETCHING",
    HAS_FETCHED_SUCCESS = "HAS_FETCHED_SUCCESS",
    HAS_FETCHED_ERROR = "HAS_FETCHED_ERROR",
}

interface FeaturePayload {
    name: string;
}

interface FeatureSlice {
    [key: string]: { status: ResourceStatus }
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
        onFetchDataSuccess(state, action: PayloadAction<FeaturePayload>) {
            state[action.payload.name].status = ResourceStatus.HAS_FETCHED_SUCCESS;
        },
        onFetchDataError(state, action: PayloadAction<FeaturePayload>) {
            state[action.payload.name].status = ResourceStatus.HAS_FETCHED_ERROR;
        }
    }
})

export default reducer;