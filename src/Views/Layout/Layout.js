import React from "react";
import OweraHeader from "../Header/Header";

function DefaultLayout(props) {
  return (
    <div>
      <OweraHeader />
      <div>{props.children}</div>
    </div>
  );
}
export default DefaultLayout;
