//En este file irán todas nuestras variables (consts) que manejarán los reducers.
//Algunas personas pueden llegar a llamar a este file como constants.js.
//Esto puede parecer un poco raro al principio. La razón de esto es que si necesitamos cambiar cualquier
//Variable de los action types los tendremos todos en un mismo file, y no todo desordenado a lo largo de la App.
export const SET_ALERT = "SET_ALERT";
export const REMOVE_ALERT = "REMOVE_ALERT";

//Estas variables se utilizan en el auth reducer.
export const REGISTER_SUCCESS = "REGISTER_SUCCESS";
export const REGISTER_FAIL = "REGISTER_FAIL";

//Necesitamos nuevos tipos para hacer la verificación de si el usuario está logueado o no cada vez que cargamos la main app.
export const USER_LOADED = "USER_LOADED"; //Este type solo correrá en success, dado que hemos logueado exitosamente al usuario.
export const AUTH_ERROR = "AUTH_ERROR";

//Estos son los tipos para el login action:
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAIL = "LOGIN_FAIL";

export const LOGOUT = "LOGOUT";

//Consts relativas a profile action/reducers.
export const GET_PROFILE = "GET_PROFILE";
export const GET_PROFILES = "GET_PROFILES";
export const GET_REPOS = "GET_REPOS";
export const PROFILE_ERROR = "PROFILE_ERROR";
export const UPDATE_PROFILE = "UPDATE_PROFILE";

//Lo que tenemos que hacer es limpiar el perfil cuando hay un deslogueo.
export const CLEAR_PROFILE = "CLEAR_PROFILE";

export const DELETE_ACCOUNT = "DELETE_ACCOUNT";

export const GET_POSTS = "GET_POSTS";
export const POST_ERROR = "POST_ERROR";

export const UPDATE_LIKES = "UPDATE_LIKES";

export const DELETE_POST = "DELETE_POST";

export const ADD_POST = "ADD_POST";
