import axios from "axios";
import { setAlert } from "./alert";
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_PROFILE,
} from "./types";
import setAuthToken from "../utils/setAuthToken";

//Load user: load loggedin user as soon as app is running.
export const loadUser = () => async (dispatch) => {
  //Checking if token exists. If it exists, put it on the global header to use it in every request.
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    //Requisites of request: token on "x-auth-token" header (which we have previously saved in setAuthToken())
    const res = await axios.get("/api/auth"); //obtain logged in user.

    // console.log(res);
    // This console.log outputs:
    // {config: ..., data: {avatar: ..., name: ..., email: ..., date: ..., _id: ...}} -> everything except the password.

    // console.log(res.data);
    // This console.log outputs:
    //{avatar: ..., name: ..., email: ..., date: ..., _id: ...}

    //That means the payload needs to be the res.data that is sent to the reducer.

    //After the async request to our self made RESTFUL API, we can dispatch the action to the auth reducer.
    dispatch({ type: USER_LOADED, payload: res.data }); //payload = user.
  } catch (err) {
    dispatch({ type: AUTH_ERROR }); //most common case this gets executed is because there's no token in x-auth-token = no user loggedin.
  }
};

//Register User: registers a new user.
export const register =
  ({ name, email, password }) =>
  async (dispatch) => {
    // console.log(`name: ${name}, email: ${email}, password: ${password}`); saving in variables.

    //Because we are posting data to the server, we want to create a config object with the content-type.
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({ name, email, password });
    // console.log(body);

    try {
      //Requisites: headers -> "Content-Type: application/json", JSON body with name, email, password.
      const res = await axios.post("/api/users", body, config);

      // console.log(res);
      // console.log(res.data); -> get the token back.

      // console.log({
      //   type: REGISTER_SUCCESS,
      //   payload: res.data,
      // });

      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data, //res.data = token.
      });

      //Token is saved on localStorage and then we load newly registered user.
      dispatch(loadUser());
    } catch (err) {
      const errors = err.response.data.errors; // [{}, {}, {}, ... ,] -> this is the actual errors array with object of errors defined by validationResult()
      // console.log(errors);
      // console.log(err); error mensaje
      // console.log(err.response); -> {config: ..., data: errors: [{value: ..., msg: "please include a valid email"}, {}, {}, ]}
      // Remember that the validationResult function of the express-validator package defines an array called errors, which contains objects
      // With different properties of the error.
      // console.log(err.response.data); //{errors: [{}, {}, {}, ... ,]}

      //Check if errors array is truly.
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger"))); //error.msg = error string.
      }

      dispatch({
        type: REGISTER_FAIL,
      });
    }
  };

//Login User: -similar to Register-
export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post("/api/auth", body, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data, //res.data = token
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors; //array of errors as defined by validationResult() from express-validator.
    // console.log(errors);

    //Setting alerts for every validation of the /api/auth api hit not passed.
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }

    //LOGIN_FAIL is the same as REGISTER_FAIL, but we want to be more descriptive.
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

//Logout / Clear Profile:
export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
  dispatch({ type: CLEAR_PROFILE });
};
