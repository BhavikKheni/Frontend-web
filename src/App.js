import React, { useEffect } from "react";
import $ from "jquery";
import { BrowserRouter as Router } from "react-router-dom";
import AppProvider from "./Provider/Provider";
import AuthProvider from "./Provider/AuthProvider";
import SidebarProvider from "./Provider/SidebarProvider";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { themes } from "./themes";
import LayoutWrapper from "./Views/Layout/LayoutWrapper";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import "./App.css";
const stripePromise = loadStripe("pk_test_51HV3voA4BHXPR0uaKu46F6TbzTFRpsRUjTA8R3EVo79EdEKvnzwqLxghxL3G7sxiFmw3KrUxn6HPjY0vtGJEgodb00bu2NvPeI");
const theme = createMuiTheme({
  overrides: {
    MuiInputLabel: {
      root: {
        "&$focused": {
          color: themes.default.colors.nero,
        },
        fontFamily: themes.default.fontFamily,
        color: themes.default.colors.nero,
      },
    },
    MuiOutlinedInput: {
      root: {
        "&$focused $notchedOutline": {
          borderColor: "inherit !important",
        },
      },
    },
    MuiMenuItem: {
      root: {
        background: "transparent",
        fontFamily: themes.default.fontFamily,
        color: themes.default.colors.darkGray,
        "&$selected": {
          backgroundColor: "transparent",
          fontWeight: 500,
          borderBottom: "none",
        },
      },
    },
  },
});

const App = (props) => {
  useEffect(() => {
    $(document).ready(function () {
      var headerHeight = $("header").height();
      $(".page_content").attr(
        "style",
        "height:calc(100vh - " +
          headerHeight +
          "px); margin-top:" +
          headerHeight +
          "px"
      );
    });
  });
  return (
    <Elements stripe={stripePromise}>
      <AppProvider>
        <ThemeProvider theme={theme}>
          <Router>
            <SidebarProvider>
              <AuthProvider>
                <LayoutWrapper />
              </AuthProvider>
            </SidebarProvider>
          </Router>
        </ThemeProvider>
      </AppProvider>
    </Elements>
  );
};

export default App;
