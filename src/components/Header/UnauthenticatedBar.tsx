import React, { ReactElement } from "react";

import Login from "components/Auth/Login";
import Register from "components/Auth/Register";

const UnauthenticatedBar = (): ReactElement => (
  <>
    <Register />
    <Login />
  </>
);

export default UnauthenticatedBar;
