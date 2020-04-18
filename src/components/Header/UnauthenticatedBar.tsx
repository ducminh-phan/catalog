import { Toolbar } from "@material-ui/core";
import React, { ReactElement } from "react";

import Login from "components/Auth/Login";
import Register from "components/Auth/Register";

const UnauthenticatedBar = (): ReactElement => (
  <Toolbar>
    <Register />
    <Login />
  </Toolbar>
);

export default UnauthenticatedBar;
