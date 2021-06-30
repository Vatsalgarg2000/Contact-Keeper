import { SET_ALERT, REMOVE_ALERT } from '../types';

//In setAlert, we add our new alert to the list of alerts.
//in remove alert, we remove the alert having same id from the array from the arrAY
export default (state, action) => {
  switch (action.type) {
    case SET_ALERT:
      return [...state, action.payload];
    case REMOVE_ALERT:
      return state.filter((alert) => alert.id !== action.payload);
    default:
      return state;
  }
};
