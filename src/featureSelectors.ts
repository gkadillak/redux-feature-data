import { createSelector } from "reselect";
import { denormalize, schema } from "normalizr";
import {
  FeatureSlices,
  FeatureSlice,
  SCHEMA_MAP,
  ResourceStatus,
  Entities,
} from "./featureSlice";

interface GenericState {
  [key: string]: any;
}

const getFeatureSlices = (state: GenericState): FeatureSlices<FeatureSlice> =>
  state.featureData;

export const makeGetFeatureStatus = (name: string) => {
  return createSelector(getFeatureSlices, (slices) => slices[name]?.status);
};

export const makeGetHasFeatureFetchedSuccess = (name: string) => {
  const getFeatureStatus = makeGetFeatureStatus(name);
  return createSelector(
    getFeatureStatus,
    (status) => status && status === ResourceStatus.HAS_FETCHED_SUCCESS
  );
};

export const makeGetHasFeatureFetchedError = (name: string) => {
  const getFeatureStatus = makeGetFeatureStatus(name);
  return createSelector(
    getFeatureStatus,
    (status) => status && status === ResourceStatus.HAS_FETCHED_ERROR
  );
};

export const makeGetHasEntityCreatedSuccess = (name: string) => {
  const getFeatureStatus = makeGetFeatureStatus(name);
  return createSelector(
    getFeatureStatus,
    (status) => status && status === ResourceStatus.HAS_CREATED_SUCCESS
  );
};

export const makeGetHasEntityCreatedError = (name: string) => {
  const getFeatureStatus = makeGetFeatureStatus(name);
  return createSelector(
    getFeatureStatus,
    (status) => status && status === ResourceStatus.HAS_CREATED_ERROR
  );
};

export const makeGetDenormalizedData = (name: string, entity: string) => {
  const getHasFeatureFetchedSuccess = makeGetHasFeatureFetchedSuccess(name);
  const entityToUse = SCHEMA_MAP[entity];
  return createSelector(
    getFeatureSlices,
    getHasFeatureFetchedSuccess,
    (slices, hasFetchedSuccessfully) => {
      if (!hasFetchedSuccessfully || !slices.entities) {
        return {};
      }

      const { data } = slices[name];
      const entitiesSlice = slices.entities as Entities;
      return denormalize(
        data,
        { [entity]: [entityToUse] },
        { [entity]: entitiesSlice[entity] }
      );
    }
  );
};

export const makeGetMetaData = (name: string) => {
  return createSelector(getFeatureSlices, (slices) => {
    return slices[name].meta;
  });
};