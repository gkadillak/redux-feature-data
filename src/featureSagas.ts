import { put, takeLatest } from 'redux-saga/effects';
import { actions } from './featureSlice';

const { onFetchData, onFetchDataSuccess, onFetchDataError } = actions;

interface ActionPayload {
    type: string;
    payload: {
        name: string
        callback<T>(): Promise<T>
    }
}

function* handleFetchData(action: ActionPayload) {
    const { callback, name } = action.payload;
    try {
        const { data } = yield callback();
        yield put(onFetchDataSuccess({ name, data }));
    } catch (error) {
        yield put(onFetchDataError({ name, error }));
    }
}

export default function* featureSagas() {
    yield takeLatest(onFetchData.toString(), handleFetchData);
}