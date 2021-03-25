import { Action } from "redux";
import { put, takeLatest } from "redux-saga/effects";
import { normalize } from "normalizr";
import {
  actions,
  FeatureErrorPayload,
  FeatureSuccessPayload,
  SCHEMA_MAP,
} from "./featureSlice";
import type { GenericPayload } from "./featureSlice";

const {
  onFetchData,
  onFetchDataSuccess,
  onFetchDataError,
  onCreateEntitySuccess,
  onCreateEntityError,
  onUpdateMetaData,
} = actions;

interface FetchPayload {
  type: string;
  payload: GenericPayload;
}

interface GenericSagaHandler {
  action: FetchPayload;
  onSuccessAction: (params: FeatureSuccessPayload) => Action<any>;
  onErrorAction: (params: FeatureErrorPayload) => Action<any>;
}

export function* genericSagaHandler({
  action,
  onSuccessAction,
  onErrorAction,
}: GenericSagaHandler) {
  const { callback, name, entity, format, meta } = action.payload;
  try {
    const { data } = yield callback();
    const formattedData = format ? format(data) : data;
    const metaData = meta ? meta(data) : {};
    const entityToUse = SCHEMA_MAP[entity];
    const { result, entities } = normalize(formattedData, {
      [entity]: [entityToUse],
    });
    yield put(onSuccessAction({ name, data: result, entities }));
    if (metaData) {
      yield put(onUpdateMetaData({ name, metaData }));
    }
  } catch (error) {
    yield put(onErrorAction({ name, error }));
  }
}

export function* handleFetchSaga(action: FetchPayload) {
  yield genericSagaHandler({
    action,
    onSuccessAction: onFetchDataSuccess,
    onErrorAction: onFetchDataError,
  });
}

export function* handleCreateSaga(action: FetchPayload) {
  yield genericSagaHandler({
    action,
    onSuccessAction: onCreateEntitySuccess,
    onErrorAction: onCreateEntityError,
  });
}

export default function* featureSagasRoot() {
  yield takeLatest(onFetchData.toString(), handleFetchSaga);
}
