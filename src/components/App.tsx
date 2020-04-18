import "assets/styles/App.css";

import { AppBar, Toolbar } from "@material-ui/core";
import React, { ReactElement } from "react";

import Header from "./Header";

function App(): ReactElement {
  return (
    <AppBar>
      <Toolbar>
        <Header />
      </Toolbar>
    </AppBar>
  );
}

export default App;
