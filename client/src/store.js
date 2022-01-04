//This script creates new Redux Store.
//We are gonna use multiple reducers (combineReducers), thunk middleware, and DevTools extension.
//Imports:
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "./reducers"; //We can name the combineReducers whatever we want because we are importing default export.

//Initial State:
const initialState = {};

//Only middleware -> thunk.
//Thunk will let as call a function that gets dispatch as argument (high order function).
const middleware = [thunk];

//Creating store. First arg: rootReducer; Second arg: initialState; Third arg: middlewares.
//Because middleware is an array with thunk function as the only element, we have to call spread operator
//...middleware and pass it as argument to applyMiddleware in order to function (applyMiddleware) takes
//functions as arguments and enhance the store dispatch.
//compose is used to apply several middlewares in a row.
//(arguments): The functions to compose. Each function is expected to accept a single parameter.
//Its return value will be provided as an argument to the function standing to the left, and so on.
//The exception is the right-most argument which can accept multiple parameters,
//as it will provide the signature for the resulting composed function.
//In this case, we are doing the same with composeWithDevTools. We are first passing the thunk middleware that enhances the store dispatch
//Then, the return value of the new store is passed as argument to composeWithDevTools!
const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

// console.log(store);

export default store;
