//This script creates new Redux Store.
//We are gonna use multiple reducers (combineReducers), thunk middleware, and DevTools extension.
//Imports:
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

//Initial State:
const initialState = {};

//Only middleware -> thunk.
const middleware = [thunk];

//Creating store. First arg: rootReducer; Second arg: initialState; Third arg: middlewares.
const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

// console.log(store);

export default store;
