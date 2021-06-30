import React, { useReducer } from 'react';
import axios from 'axios';
import AuthContext from './authContext';
import authReducer from './authReducer';
import setAuthToken from '../../utils/setAuthToken';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS,
} from '../types';

const AuthState = (props) => {
  const initialState = {
    //Token will be stores in localStorage and this is the way to get something from out browser's localStorage.
    token: localStorage.getItem('token'),
    isAuthenticated: null, //Tells us if we are logged in or not
    loading: true, //It will be true until we make a request and get a response back. Then we will make it false.
    user: null,
    error: null,
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  //Load User
  //Check which user is logged in.
  //Hit the auth endpoint and get the user data.
  const loadUser = async () => {
    //load token into global headers
    //We set our token into globalHeader. We know that we have to send the headers in object to a route thats protected.
    //We dont want to do that in every method like get contacts and set contacts to we gonna set it as a global header
    //within axios. we have made a apecial file for that and loaded it in here.
    //we have to do this to make a get request to api/axios
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    //After loading the token into headers of url, we can now make requests.
    try {
      const res = await axios.get('/api/auth');

      dispatch({
        type: USER_LOADED,
        payload: res.data,
      });
    } catch (err) {
      dispatch({ type: AUTH_ERROR });
    }
  };

  //Register User
  //sign user up and get a token back
  const register = async (formData) => {
    //since we are making a POST request and we are sending some data, we need that Content-type header
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const res = await axios.post('/api/users', formData, config);
      //The response to above post request will be a token

      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });

      loadUser();
    } catch (err) {
      dispatch({
        type: REGISTER_FAIL,
        payload: err.response.data.msg,
      });
    }
  };

  //Login User
  //log the user in and get the token
  const login = async (formData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const res = await axios.post('/api/auth', formData, config);

      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });

      loadUser();
    } catch (err) {
      dispatch({
        type: LOGIN_FAIL,
        payload: err.response.data.msg,
      });
    }
  };

  //Logout
  //destroy the token and clear everything up
  const logout = () => dispatch({ type: LOGOUT });

  //Clear Errors
  //To clear out any errors in the state
  const clearErrors = () => dispatch({ type: CLEAR_ERRORS });

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        register,
        loadUser,
        login,
        logout,
        clearErrors,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
