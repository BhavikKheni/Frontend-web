import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppProvider from "./Provider/Provider";
import Layout from "./Views/Layout/Layout";
import CreateRoutes from "./Routers/Routers"
import "./App.css";

const App = (props) => {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <CreateRoutes />
        </Layout>
      </Router>
    </AppProvider>
  );
};

export default App;
