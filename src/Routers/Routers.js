import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Dashboard from "../Views/Dashboard/Dashboard";
import Services from "../Views/Services/Services";
import Profile from "../Views/Profile/ProfileWrapper";

import { SessionContext } from "../Provider/Provider.js";
const useSession = () => React.useContext(SessionContext);
const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { isLoggedIn } = useSession();
  return (
    <Route
      render={(props) =>
        isLoggedIn ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: "/", state: { from: props.location } }} />
        )
      }
      {...rest}
    />
  );
};

const CreateRoutes = () => {
  const { loading } = useSession();

  if (loading) return <p>Loading...</p>;
  return (
    <Switch>
      <Route exact path="/dashboard" component={Dashboard} />
      <Route exact path="/services" component={Services} />
      <ProtectedRoute path="/profile" component={Profile} />
    </Switch>
  );
};
export default CreateRoutes;
