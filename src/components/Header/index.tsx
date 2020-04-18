import { AppBar } from "@material-ui/core";
import React, { ReactElement } from "react";

import { useAuth } from "contexts/auth";

import AuthenticatedBar from "./AuthenticatedBar";
import UnauthenticatedBar from "./UnauthenticatedBar";

const Header = (): ReactElement => {
  const { data } = useAuth();

  return (
    <AppBar>
      {data !== null ? <AuthenticatedBar /> : <UnauthenticatedBar />}
    </AppBar>
  );
};

export default Header;
