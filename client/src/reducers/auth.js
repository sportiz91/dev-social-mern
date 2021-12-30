//Imports:
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  DELETE_ACCOUNT,
} from "../actions/types";

//Initial State:
//token got from localStorage.
//loading is true by default. When request gets proccessed, loading becomes false.
//User -> gets populated with name, email, avatar.
const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  loading: true,
  user: null,
};

// console.log(initialState);

//When REGISTER_SUCCESSS or LOGIN_SUCCESS, the user's token gets saved in localStorage.
const auth = function (state = initialState, action) {
  const { type, payload } = action;

  //This reducer also handles USER_LOADED & AUTH_ERROR that comes from the initial loading of the app.
  //User needs to be logged in if he has previously logged in (token in localStorage)
  switch (type) {
    case USER_LOADED:
      return {
        ...state, //remember, state is inmutable, so always returns previous state.
        isAuthenticated: true,
        loading: false,
        user: payload,
      };

    //REGISTER_SUCCESS -> payload: {token: 123456}. That's why we "...payload" below.
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem("token", payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
      };

    //token needs to be deleted from localStorage. Basically, we don't want an invalid token saved in localStorage never.
    case REGISTER_FAIL:
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT:
    case DELETE_ACCOUNT:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    default:
      return state;
  }
};

export default auth;
