import React, { useEffect } from "react";
import $ from "jquery";
import { BrowserRouter as Router } from "react-router-dom";
import AppProvider from "./Provider/Provider";
import SidebarProvider from "./Provider/SidebarProvider";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { themes } from "./themes";
import LayoutWrapper from "./Views/Layout/LayoutWrapper";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import "./App.css";
const stripePromise = loadStripe("pk_test_6pRNASCoBOKtIshFeQd4XMUh");
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
              <LayoutWrapper />
            </SidebarProvider>
          </Router>
        </ThemeProvider>
      </AppProvider>
    </Elements>
  );
};

export default App;
