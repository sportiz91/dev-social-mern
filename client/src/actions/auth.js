//En esta action también querré mostrar los errores. Recordemos que si nos olvidamos del nombre, el email o algo
//Obtendremos un array de errores por parte del BackEnd. Para cada tipo de error se querrá mostrar una alerta diferente.

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
} from "./types";
import setAuthToken from "../utils/setAuthToken";

//Load user: cuando cargamos el mail app, queremos que se cargue el usuario que inició sesión y tiene el JSON Web Token en localStorage.
export const loadUser = () => async (dispatch) => {
  //Tenemos que chequear si existe un token.
  //Si existe, queremos poner ese token en el global header. Es decir, si hay un token lo querremos mandar siempre.
  //Para hacer esto se crea una nueva carpeta llamada utils y dentro el file setAuthToken.js

  //Esto correrá solo la primera vez que se loguee el usuario. Por ende, también querremos correrlo en App.js para
  //que se ejecute cada vez que cargamos la main app.
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get("/api/auth");

    dispatch({ type: USER_LOADED, payload: res.data }); //El payload vendría a ser el usuario.
  } catch (err) {
    dispatch({ type: AUTH_ERROR });
  }
};

//Register User:
//Dado que estamos enviando data al Servidor, vamos a crear un config object con headers.
export const register =
  ({ name, email, password }) =>
  async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({ name, email, password });

    try {
      const res = await axios.post("/api/users", body, config);

      //Si no obtenemos ningún error, queremos hacer el dispatch.
      //En este caso, el payload sería el res.data, que nos envía el token.
      //En el caso de tener error, no tengo que retornar un payload.
      //Simplemente el tipo de action a dispatch para el reducer. El reducer se encargará de borrar el token de localStorage
      //(Si es que hay uno) y de actualizar el state.
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });

      dispatch(loadUser());
    } catch (err) {
      //Recordemos que el array de errores que usamos de la validación del backend se llama errors.
      const errors = err.response.data.errors;
      console.log(errors);

      //Entonces, queremos chequear que el errors array tenga errores. Es decir, que haya algún error.
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }

      dispatch({
        type: REGISTER_FAIL,
      });
    }
  };

//Login User:
//Login functionality será parecida a Register.
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
};
