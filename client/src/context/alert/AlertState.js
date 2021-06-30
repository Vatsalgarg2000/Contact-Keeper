import React, { useReducer } from 'react';
import AlertContext from './alertContext';
import alertReducer from './alertReducer';
import { v4 as uuidv4 } from 'uuid';
import { SET_ALERT, REMOVE_ALERT } from '../types';

const AlertState = (props) => {
  //we will have an array of alerts
  const initialState = [];

  const [state, dispatch] = useReducer(alertReducer, initialState);

  //Set Alert
  const setAlert = (msg, type, timeout = 5000) => {
    const id = uuidv4(); //gererate a random id to dispatch it with payload becuase we have an array of alerts and we need an identifier
    dispatch({
      type: SET_ALERT,
      payload: { msg, type, id },
    });

    //we send the id here as well so as to know which alert to remove from array
    setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
  };

  return (
    <AlertContext.Provider
      value={{
        alerts: state,
        setAlert,
      }}
    >
      {props.children}
    </AlertContext.Provider>
  );
};

export default AlertState;
