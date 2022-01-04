//Reducer for setAlert State.
import { SET_ALERT, REMOVE_ALERT } from "../actions/types";

//initialState is an array because we can have more than one alert, defined by different ids.
const initialState = [];

//Because state is an array, we can apply state.filter.
const alert = function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_ALERT:
      return [...state, payload];

    //Only leave in the array the alerts where ids do not match
    case REMOVE_ALERT:
      return state.filter((alert) => alert.id !== payload);

    default:
      return state;
  }
};

export default alert;
