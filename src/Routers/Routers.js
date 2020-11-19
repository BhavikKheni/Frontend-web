import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Services from "../Views/Services/Services";
import Profile from "../Views/Profile/UserProfile/UserProfile";
import Messages from "../Views/Messages/Messages";
import CreateService from "../Views/Work/CreateService";
import { SessionContext } from "../Provider/Provider.js";
import ProfileProvider from "../Views/Profile/ProviderProfile/ProviderProfile";
import Home from "../Views/Home/Home";
import Work from "../Views/Work/Work";
import CallPage from "../Views/Work/CallPage/CallPage";

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
      <Route exact path="/" component={Services} />
      <Route exact path="/?forgotPassword=true" component={Services} />
      <Route exact path="/home" component={Home} />
      <Route exact path="/work" component={Work} />
      <Route path="/home/profile" component={Profile} />
      <Route exact path="/home/calendar" component={Home} />
      <Route exact path="/home/service-history" component={Home} />
      <Route exact path="/home/payment-methods" component={Home} />
      <Route exact path="/home/next-booking" component={Home} />
      <ProtectedRoute path="/home/messages" component={Messages} />
      <Route exact path="/create-services" component={CreateService} />
      <Route path="/profile-provider" component={ProfileProvider} />
      <Route path="/call-page" component={CallPage} />
    </Switch>
  );
};

export default CreateRoutes;
