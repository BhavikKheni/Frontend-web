import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppProvider from "./Provider/Provider";
import SidebarProvider from "./Provider/SidebarProvider";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { themes } from "./themes";
import LayoutWrapper from "./Views/Layout/LayoutWrapper";
import "./App.css";

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
          borderBottom: "3px solid #303030",
        },
      },
    },
  },
});

const App = (props) => {
  return (
    <AppProvider>
      <ThemeProvider theme={theme}>
        <Router>
          <SidebarProvider>
            <LayoutWrapper />
          </SidebarProvider>
        </Router>
      </ThemeProvider>
    </AppProvider>
  );
};

export default App;
