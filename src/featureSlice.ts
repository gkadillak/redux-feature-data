import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { mergeAndConcat as deepmerge } from "merge-anything";
import { schema } from "normalizr";

/** @internal */
export let SCHEMA_MAP: { [key: string]: schema.Entity } = {};

export enum ResourceStatus {
  IS_FETCHING = "IS_FETCHING",
  HAS_FETCHED_SUCCESS = "HAS_FETCHED_SUCCESS",
  HAS_FETCHED_ERROR = "HAS_FETCHED_ERROR",
  IS_CREATING = "IS_CREATING",
  HAS_CREATED_SUCCESS = "HAS_CREATED_SUCCESS",
  HAS_CREATED_ERROR = "HAS_CREATED_ERROR",
}

export interface GenericPayload {
  name: string;
  callback<T>(): Promise<T>;
  entity: string;
  format?(data: any): { [key: string]: any[] };
  meta?(data: any): any;
}

export interface FeaturePayload {
  name: string;
}

export interface FeatureActionPayload extends GenericPayload, FeaturePayload {}
type Result = {
  [key: string]: Number[];
};

export type Entities = {
  [key: string]: {
    [key: string]: any;
  };
};

interface MetaDataPayload extends FeaturePayload {
  metaData: any;
}

export interface FeatureSuccessPayload extends FeaturePayload {
  data: Result;
  entities: Entities | {};
}

export interface FeatureErrorPayload extends FeaturePayload {
  error: Error;
}

export interface FeatureSlice {
  status: ResourceStatus;
  data?: Result;
  error?: any;
  meta?: any;
}

export interface FeatureSlices<T> {
  // @ts-expect-error
  entities?: Entities;
  [key: string]: T;
}

const initialState: FeatureSlices<FeatureSlice> = {};

export const { reducer, actions } = createSlice({
  name: "featureData",
  initialState: initialState,
  reducers: {
    onUpdateMetaData(state, action: PayloadAction<MetaDataPayload>) {
      let featureSlice = state[action.payload.name];
      featureSlice.meta = deepmerge(
        featureSlice?.meta || {},
        action.payload.metaData
      );
    },
    onFetchData(state, action: PayloadAction<FeatureActionPayload>) {
      let featureSlice = state[action.payload.name];
      if (!featureSlice) {
        featureSlice = { status: ResourceStatus.IS_FETCHING };
      } else {
        featureSlice.status = ResourceStatus.IS_FETCHING;
      }
      state[action.payload.name] = featureSlice;
    },
    onFetchDataSuccess(state, action: PayloadAction<FeatureSuccessPayload>) {
      state.entities = deepmerge(
        state?.entities || {},
        action.payload.entities
      );
      state[action.payload.name].status = ResourceStatus.HAS_FETCHED_SUCCESS;
      state[action.payload.name].data = action.payload.data;
    },
    onFetchDataError(state, action: PayloadAction<FeatureErrorPayload>) {
      state[action.payload.name].status = ResourceStatus.HAS_FETCHED_ERROR;
      state[action.payload.name].error = action.payload.error.toString();
    },
    onCreateEntity(state, action: PayloadAction<FeatureActionPayload>) {
      let featureSlice = state[action.payload.name];
      if (!featureSlice) {
        featureSlice = { status: ResourceStatus.IS_CREATING };
      } else {
        featureSlice.status = ResourceStatus.IS_CREATING;
      }
      state[action.payload.name] = featureSlice;
    },
    onCreateEntitySuccess(state, action: PayloadAction<FeatureSuccessPayload>) {
      state.entities = deepmerge(
        state?.entities || {},
        action.payload.entities
      );
      state[action.payload.name].status = ResourceStatus.HAS_CREATED_SUCCESS;
      state[action.payload.name].data = deepmerge(
        state[action.payload.name].data || {},
        action.payload.data
      );
    },
    onCreateEntityError(state, action: PayloadAction<FeatureErrorPayload>) {
      state[action.payload.name].status = ResourceStatus.HAS_CREATED_ERROR;
      state[action.payload.name].error = action.payload.error.toString();
    },
  },
});

export function createReducer(schemaMap: { [key: string]: schema.Entity }) {
  SCHEMA_MAP = schemaMap;
  return reducer;
}
