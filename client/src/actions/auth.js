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

//Load user: load loggedin user as soon as app is run.
export const loadUser = () => async (dispatch) => {
  //Checking if token exists. If it exists, put it on the global header to use it in every request.
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get("/api/auth"); //obtain logged in user.

    // console.log(res);
    // console.log(res.data);

    dispatch({ type: USER_LOADED, payload: res.data }); //payload = user.
  } catch (err) {
    dispatch({ type: AUTH_ERROR });
  }
};

//Register User: registers a new user.
export const register =
  ({ name, email, password }) =>
  async (dispatch) => {
    // console.log(`name: ${name}, email: ${email}, password: ${password}`); Como podemos observar, tenemos las propiedades del objeto en variables.

    //Because we are posting data to the server, we want to create a config object with the content-type.
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({ name, email, password });
    // console.log(body);

    try {
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
      const errors = err.response.data.errors; // [{}, {}, {}, ... ,]
      // console.log(errors);
      // console.log(err); Nos tira el mensaje de error.
      // console.log(err.response); Nos tira el objeto err -> {config: ..., data: errors: [{value: ..., msg: "please include a valid email"}, {}, {}, ]}
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
      payload: res.data,
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;
    console.log(errors);

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }

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
