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
    const res = await axios.get("/api/auth"); // /api/auth -> obtiene el usuario logueado.

    // console.log(res);
    // console.log(res.data);

    dispatch({ type: USER_LOADED, payload: res.data }); //El payload vendría a ser el usuario.
  } catch (err) {
    dispatch({ type: AUTH_ERROR });
  }
};

//Register User:
//Dado que estamos enviando data al Servidor, vamos a crear un config object con headers.
//En este caso, dado que en Register.js, cuando ejecutamos la función action constructor le pasamos {name, email, password},
//El resultado era un objeto -> {name: 'Julio Ortiz', email: 'jcortiz54@gmail.com', password: '123456'}
//Por ende, tenemos que desestructurar el objeto para guardar en variables las propiedades.
export const register =
  ({ name, email, password }) =>
  async (dispatch) => {
    // console.log(`name: ${name}, email: ${email}, password: ${password}`); Como podemos observar, tenemos las propiedades del objeto en variables.
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({ name, email, password });
    // console.log(body); Esto nos devuelve el json.

    //axios#post(url[, data[, config]]) -> axios.post lleva un primer parámetro que es la URL para el API hit
    //Luego un body (también llamado data) y luego un config object.
    try {
      const res = await axios.post("/api/users", body, config);

      // console.log(res);
      // console.log(res.data); -> nos devuelve el token.

      //Si no obtenemos ningún error, queremos hacer el dispatch.
      //En este caso, el payload sería el res.data, que nos envía el token.
      //En el caso de tener error, no tengo que retornar un payload.
      //Simplemente el tipo de action a dispatch para el reducer. El reducer se encargará de borrar el token de localStorage
      //(Si es que hay uno) y de actualizar el state.

      // console.log({
      //   type: REGISTER_SUCCESS,
      //   payload: res.data,
      // });

      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });

      //Con el REGISTER_SUCCESS obtendremos un nuevo token guardado en localStorage.
      //Ese token nos servirá para dispatchar el loadUser() action, el cual logueará al usuario cuyo token
      //Está almacenado en localStorage (en este caso, el nuevo usuario registrado).
      dispatch(loadUser());
    } catch (err) {
      //Recordemos que el array de errores que usamos de la validación del backend se llama errors.
      const errors = err.response.data.errors; // [{}, {}, {}, ... ,]
      // console.log(errors);
      // console.log(err); Nos tira el mensaje de error.
      // console.log(err.response); Nos tira el objeto err -> {config: ..., data: errors: [{value: ..., msg: "please include a valid email"}, {}, {}, ]}
      // console.log(err.response.data); //{errors: [{}, {}, {}, ... ,]}

      //Entonces, queremos chequear que el errors array tenga errores. Es decir, que haya algún error.
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger"))); //error.msg es el string con el error.
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
