import React from "react";
import { Route, Switch } from "react-router-dom";
import ProfileView from "./Profile";
// import UpdateProfile from "./UpdateProfile";

export default function Profile(props) {
  return (
    <Switch>
      <Route path="/profile" component={ProfileView} exact />
      {/* <Route path="/profile/edit" component={UpdateProfile} exact /> */}
    </Switch>
  );
}
