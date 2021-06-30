import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import AuthContext from '../../context/auth/authContext';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated, loading } = authContext;

  //if user is not authenticated and done loading,
  // we dont want to put him into our private route, so we redirect him to login page
  //else, we load out component and extra props in the component
  //This is very common for creating a private route component

  //this is the reason why as soon as our server starts, we see login page because initially, isAuthenticated is false and therefore redirected to /login

  return (
    <Route
      {...rest}
      render={(props) =>
        !isAuthenticated && !loading ? (
          <Redirect to='/login' />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

export default PrivateRoute;
