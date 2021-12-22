//Este reducer será mucho más largo que el Alert Reducer.
//El auth reducer será diferente al alert reducer, en el sentido de que vamos a lidiar con el backend. Es decir, vamos a estar haciendo http requests.
//Los requests de Axios los haremos en el action file de la parte del auth. Vamos a crear una request, vamos a obtener una response.
//Si la response es successfull, vamos a mostrar un REGISTER_SUCCESS y sino un REGISTER_FAIL

//Imports:
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
} from "../actions/types";

//Initial state:
//Al token lo guardaremos en localStorage. El default para nuestro Token en el State será el token que esté guardado en localStorage.
//Cuando hagamos un request para registrarnos o login, y obtengamos success, vamos a setear el isAuthenticated como true.
//Cuando realizamos la authenticación y recibimos la respuesta del Servidor y nos logueamos con éxito, queremos que el loading ya esté finalizado.
//Por default, ponemos loading como True. Cuando nos querramos loguear, hagamos la request y obtengamos la response, se pondrá como false.
//Por default, user estará en null. No obstante, cuando hagamos el request al api/auth y obtengamos la user data, incluyendo nombre, email avatar, etc.
//Todo eso irá en el campo user.
const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  loading: true,
  user: null,
};

// console.log("InitialState:");
// console.log(initialState);

//Recordemos que el Reducer toma dos parámetros. El initialState y luego la acción que es la que se dispatchó previamente.
//Si tenemos un REGISTER_SUCCESS, lo que querré hacer es poner el token en el localStorage.
//Recordemos, para retornar el state lo que hacemos es ...state, es decir, todo el estado que tenga anteriormente.
//Recordar que el estado es inmutable, es por eso que debo devolver lo que tenía previamente en el estado.
//Si es un register fail quiero remover el token completamente.
export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    //Este switch también tiene que manejar los casos de USER_LOADED y AUTH_ERROR.
    //Estos provienen de la carga inicial del main app. Querré loadear al usuario si hay un token guardado en localStorage
    //Así persistimos al usuario hasta que cierre sesión y se cancele su token.
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload, //el payload, en este caso, vendría a ser el usuario, el cual me trae los campos name, email, avatar, etc (ver atlas para ver todos los campos)
      };

    //En el caso de REGISTER_SUCCESS, el action object tendrá la siguiente forma:
    //{type: "REGISTER_SUCCESS", payload: {token: 123456}}. por lo tanto, para meter la propiedad token del payload
    //En el objeto state, tengo que utilizar el spread operator. En caso que hiciera: return {...state, payload, isAuth...}
    //Token seguiría en Null, o en el valor anterior.
    //Por su parte, LOGIN_SUCCESS, hará exactamente lo mismo que REGISTER_SUCCESS -> pone el token en localStorage,
    //y retorna el nuevo estado el cual tiene el payload (token), authenticated true y loading false.
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem("token", payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
      };

    //En el caso de AUTH_ERROR, quiero hacer lo mismo que para el caso que haya un register fail.
    //Es decir, borrar el token, hacer que el authenticated sea false, que user sea null etc.
    //Básicamente, no queremos tener un token inválido guardado en localStorage nunca.
    //El caso de LOGIN_FAIL será equivalente al de REGISTER_FAIL. Remueve el token, no está authenticado ni cargando.
    //LOGOUT también hace lo mismo. Remueve el token de localStorage, limpia el token y hacemos que el usuario no esté más autenticado.
    case REGISTER_FAIL: //uno abajo de otro = fall-through behaviour.
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT:
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
}
