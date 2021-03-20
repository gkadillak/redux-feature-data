# Redux Feature Data

Redux Feature Data is a generic set of actions, sagas and selectors to reduce the boilerplate required for interacting with API's in a react project that uses redux-sagas as their middleware.

## Getting Started

### Add the redux feature data reducer to your reducers:

If you're using reduxjs toolkit, it should look something like this:

```js
import { createFeatureDataReducer } from "redux-feature-data";

// The value of the object here are the arguments that are passed to normalizr.
// In this case, the key of the entity will be 'users'.
const featureDataReducer = createFeatureDataReducer({ users: ["users"] });

export default configureStore({
  reducer: {
    // other reducers here
    featureData: featureDataReducer, // The name of this slice can be whatever you want
  },
});
```

If you aren't using reduxjs toolkit, it should look something like this:

```js
import { combineReducers } from "redux";

const featureDataReducer = createFeatureDataReducer({ users: ["users"] });

export default combineReducers({
  // other reducers here
  featureData: featureDataReducer,
});
```

### Add the redux feature data saga to your sagas:

If you're using reduxjs toolkit, it should look something like this:

```js
import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { createFeatureDataReducer, featureSagasRoot } from "redux-feature-data";

const sagaMiddleware = createSagaMiddleware();
const featureDataReducer = createFeatureDataReducer({ users: ["users"] });

export default configureStore({
  reducer: {
    // other reducers here
    featureData: featureDataReducer,
  },
  middleware: [sagaMiddleware],
});

sagaMiddleware.run(featureSagasRoot);
```

### Now you're free to use the actions and selectors in your components

```js
import React, { useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { featureDataActions, featureSelectors } from "redux-feature-data";

const {
  makeGetDenormalizedData,
  makeGetHasFeatureFetchedSuccess,
} = featureSelectors;

export function Counter() {
  const dispatch = useDispatch();
  const getDenormalizedData = makeGetDenormalizedData("counter", "users");
  const getHasFeatureFetchedSuccess = makeGetHasFeatureFetchedSuccess(
    "counter"
  );
  const hasUsersFetched = useSelector(getHasFeatureFetchedSuccess);
  const data = useSelector(getDenormalizedData);

  useEffect(() => {
    console.log(data);
  }, [hasUsersFetched]);

  return (
    <div>
      {hasUsersFetched && (
        <ul>
          {data.users?.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}
      <button
        onClick={() => {
          dispatch(
            featureDataActions.onFetchData({
              name: "counter",
              entity: "users",
              callback: () => axios.get("https://api.mocki.io/v1/f8750ac9"),
            })
          );
        }}
      >
        Add Async
      </button>
    </div>
  );
}
```
