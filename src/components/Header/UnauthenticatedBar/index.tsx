import { Toolbar } from "@material-ui/core";
import React, { ReactElement } from "react";

import Login from "./Login";
import Register from "./Register";

const UnauthenticatedBar = (): ReactElement => (
  <Toolbar>
    <Register />
    <Login />
  </Toolbar>
);

export default UnauthenticatedBar;
