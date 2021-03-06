//index.js gets all the reducers, that are combined in combineReducers object.
import { combineReducers } from "redux";
import alert from "./alert";
import auth from "./auth";
import profile from "./profile";
import post from "./post";

//combineReducers function takes as argument an object with all the individual function reducers.
//In this case we are doing: alert: alert, auth: auth, ...
export default combineReducers({
  alert,
  auth,
  profile,
  post,
});
