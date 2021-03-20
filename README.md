# Redux Feature Data

Redux Feature Data is a generic set of actions, sagas and selectors to reduce the boilerplate required for interacting with API's in a react project that uses redux-sagas as their middleware.

**Note**: Right now this project is not well suited for GraphQL-like endpoints. There is no deep merging for store data.

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
