import { v4 as uuidv4 } from "uuid";
import { SET_ALERT, REMOVE_ALERT } from "./types";

//setAlert high level order function -> takes dispatch as parameter because of thunk middleware.
//We define a default timeout of 5s for the alert.
export const setAlert =
  (msg, alertType, timeout = 5000) =>
  (dispatch) => {
    const id = uuidv4(); //Generate random uuid and save it on id variable.

    // console.log(dispatch);

    dispatch({
      type: SET_ALERT,
      payload: { msg, alertType, id },
    });

    //After 5 seconds, REMOVE_ALERT action gonna be dispatched.
    setTimeout(() => {
      dispatch({ type: REMOVE_ALERT, payload: id });
    }, timeout);
  };
