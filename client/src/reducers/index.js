//Dentro de index.js vamos a tener múltiples reducers.
//No obstante, vamos a combinar todos en una solo:
import { combineReducers } from "redux";
import alert from "./alert";
import auth from "./auth";
import profile from "./profile";
import post from "./post";

//La función combine reducers toma como argumento un objeto que tiene todos los reducers que utilicemos.
export default combineReducers({
  alert,
  auth,
  profile,
  post,
});
