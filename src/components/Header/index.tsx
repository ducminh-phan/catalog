import React, { ReactElement } from "react";

import { useAuth } from "contexts/auth";

import AuthenticatedBar from "./AuthenticatedBar";
import UnauthenticatedBar from "./UnauthenticatedBar";

const Header = (): ReactElement => {
  const { data } = useAuth();

  return data !== null ? <AuthenticatedBar /> : <UnauthenticatedBar />;
};

export default Header;
