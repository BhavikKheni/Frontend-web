import React from "react";
import { Route } from "react-router-dom";
import ProfileView from "./Profile";
import UpdateProfile from "./UpdateProfile";

export default function Profile(props) {
  return (
    <div style={{ width: "100%" }}>
      <div style={{ width: "100%" }}>
        <Route path="/profile" component={ProfileView} exact />
        <Route path="/profile/edit" component={UpdateProfile} exact />
      </div>
    </div>
  );
}
