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

export const makeGetFeatureStatus = ({ name }: { name: string }) => {
  return createSelector(
    getFeatureSlices,
    (slices: FeatureSlices<FeatureSlice>) => slices[name]?.status
  );
};

export const makeGetHasFeatureFetchedSuccess = ({ name }: { name: string }) => {
  const getFeatureStatus = makeGetFeatureStatus({ name });
  return createSelector(
    getFeatureStatus,
    (status: ResourceStatus) =>
      status && status === ResourceStatus.HAS_FETCHED_SUCCESS
  );
};

export const makeGetHasFeatureFetchedError = ({ name }: { name: string }) => {
  const getFeatureStatus = makeGetFeatureStatus({ name });
  return createSelector(
    getFeatureStatus,
    (status: ResourceStatus) =>
      status && status === ResourceStatus.HAS_FETCHED_ERROR
  );
};

export const makeGetHasEntityCreatedSuccess = ({ name }: { name: string }) => {
  const getFeatureStatus = makeGetFeatureStatus({ name });
  return createSelector(
    getFeatureStatus,
    (status: ResourceStatus) =>
      status && status === ResourceStatus.HAS_CREATED_SUCCESS
  );
};

export const makeGetHasEntityCreatedError = ({ name }: { name: string }) => {
  const getFeatureStatus = makeGetFeatureStatus({ name });
  return createSelector(
    getFeatureStatus,
    (status: ResourceStatus) =>
      status && status === ResourceStatus.HAS_CREATED_ERROR
  );
};

export const makeGetDenormalizedData = ({
  name,
  entity,
}: {
  name: string;
  entity: string;
}) => {
  const getHasFeatureFetchedSuccess = makeGetHasFeatureFetchedSuccess({ name });
  return createSelector(
    getFeatureSlices,
    getHasFeatureFetchedSuccess,
    (slices: FeatureSlices<FeatureSlice>, hasFetchedSuccessfully: boolean) => {
      if (!hasFetchedSuccessfully || !slices.entities) {
        return {};
      }

      const { data } = slices[name];
      const entitiesSlice = slices.entities as Entities;
      const entityToUse = SCHEMA_MAP[entity];
      return denormalize(
        data,
        { [entity]: [entityToUse] },
        { [entity]: entitiesSlice[entity] }
      );
    }
  );
};

export const makeGetMetaData = ({ name }: { name: string }) => {
  return createSelector(
    getFeatureSlices,
    (slices: FeatureSlices<FeatureSlice>) => {
      return slices[name].meta;
    }
  );
};
