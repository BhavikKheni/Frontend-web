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
        fontFamily: "Rubik",
        color: themes.default.colors.nero,
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
