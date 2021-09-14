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

/**
 * @ignore
 */
const getFeatureSlices = (state: GenericState): FeatureSlices<FeatureSlice> =>
  state.featureData;

export const makeGetFeatureStatus = ({ name }: { name: string }) => {
  return createSelector(
    getFeatureSlices,
    (slices: FeatureSlices<FeatureSlice>) => slices[name]?.status
  );
};

export const makeGetFeatureData = ({ name }: { name: string }) => {
  return createSelector(
    getFeatureSlices,
    (slices: FeatureSlices<FeatureSlice>) => slices[name]?.data
  );
};

export const makeGetIsFeatureFetching = ({ name }: { name: string }) => {
  const getFeatureStatus = makeGetFeatureStatus({ name });
  return createSelector(
    getFeatureStatus,
    (status: ResourceStatus) => status && status === ResourceStatus.IS_FETCHING
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

export const makeGetIsEntityCreating = ({ name }: { name: string }) => {
  const getFeatureStatus = makeGetFeatureStatus({ name });
  return createSelector(
    getFeatureStatus,
    (status: ResourceStatus) => status && status === ResourceStatus.IS_CREATING
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
  const getFeatureStatus = makeGetFeatureStatus({ name });
  const getFeatureData = makeGetFeatureData({ name });

  return createSelector(
    getFeatureSlices,
    getFeatureStatus,
    getFeatureData,
    (slices: FeatureSlices<FeatureSlice>, status: string, featureData) => {
      if (!status || !featureData || !slices.entities) {
        return undefined;
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
