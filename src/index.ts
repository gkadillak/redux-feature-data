import {
  createReducer as createFeatureDataReducer,
  actions as featureDataActions,
} from "./featureSlice";
import featureSagasRoot, * as featureSagas from "./featureSagas";
import * as featureSelectors from "./featureSelectors";

export {
  createFeatureDataReducer,
  featureDataActions,
  featureSagasRoot,
  featureSagas,
  featureSelectors,
};
