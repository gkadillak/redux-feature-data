import { Action } from "redux";
import { put, takeEvery, takeLatest } from "redux-saga/effects";
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
  onCreateEntity,
  onCreateEntitySuccess,
  onCreateEntityError,
  onUpdateMetaData,
} = actions;

interface FetchPayload {
  type: string;
  payload: GenericPayload;
}

interface SagaParams {
  callback: () => any;
  name: string;
  entity: string;
  format?: (data: any) => { [key: string]: any[] } | Generator;
  meta?: (metaData: any) => any;
}

interface GenericSagaHandler extends SagaParams {
  onSuccessAction: (params: FeatureSuccessPayload) => Action<any>;
  onErrorAction: (params: FeatureErrorPayload) => Action<any>;
}

/**
 * @ignore
 */
export function* genericSagaHandler({
  callback,
  name,
  entity,
  format,
  meta,
  onSuccessAction,
  onErrorAction,
}: GenericSagaHandler) {
  try {
    const { data } = yield callback();
    let formattedData: { [key: string]: any[] };
    if (format) {
      formattedData = yield format(data);
    } else {
      formattedData = data;
    }
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

export function* fetchData({
  callback,
  name,
  entity,
  format,
  meta,
}: SagaParams) {
  yield genericSagaHandler({
    callback,
    name,
    entity,
    format,
    meta,
    onSuccessAction: onFetchDataSuccess,
    onErrorAction: onFetchDataError,
  });
}

function* handleFetch(action: FetchPayload) {
  const { callback, name, entity, format, meta } = action.payload;
  yield fetchData({
    callback,
    name,
    entity,
    format,
    meta,
  });
}

export function* createEntity({
  callback,
  name,
  entity,
  format,
  meta,
}: SagaParams) {
  yield genericSagaHandler({
    callback,
    name,
    entity,
    format,
    meta,
    onSuccessAction: onCreateEntitySuccess,
    onErrorAction: onCreateEntityError,
  });
}

function* handleCreate(action: FetchPayload) {
  const { callback, name, entity, format, meta } = action.payload;
  yield createEntity({
    callback,
    name,
    entity,
    format,
    meta,
  });
}

export default function* featureSagasRoot() {
  yield takeEvery(onFetchData.toString(), handleFetch);
  yield takeEvery(onCreateEntity.toString(), handleCreate);
}
