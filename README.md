[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# Redux Feature Data

Redux Feature Data is a generic set of actions, sagas and selectors to reduce the boilerplate required for interacting with API's in a react project that uses redux-sagas as their middleware.

## Getting Started

### Add the redux feature data reducer to your reducers:

If you're using reduxjs toolkit, it should look something like this:

```js
import { createFeatureDataReducer } from "redux-feature-data";
import { schema } from "normalizr";

// need to pass the normalizr entities so that redux-feature-data
// understands the relationship between entities
const users = new schema.Entity("users");
const featureDataReducer = createFeatureDataReducer({ users });

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
import { schema } from "normalizr";

const users = new schema.Entity("users");

const featureDataReducer = createFeatureDataReducer({ users });

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
import { schema } from "normalizr";

const users = new schema.Entity("users");
const sagaMiddleware = createSagaMiddleware();
const featureDataReducer = createFeatureDataReducer({ users });

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
  const getDenormalizedData = makeGetDenormalizedData({
    name: "counter",
    entity: "users",
  });
  const getHasFeatureFetchedSuccess = makeGetHasFeatureFetchedSuccess({
    name: "counter",
  });
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

If you're curious about the pattern being used for the selector here to pass arguments, feel free to
read the [reselect documentation](https://github.com/reduxjs/reselect#q-how-do-i-create-a-selector-that-takes-an-argument) for an in-depth answer to this question.

## Demo

If you'd like to see redux-feature-data in action, feel free to use [this codesandbox.io link](https://codesandbox.io/s/magical-wave-5itof) to try it out without having to write any code.

## API

[Link to api docs](https://gkadillak.github.io/redux-feature-data/)
