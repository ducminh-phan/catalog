import React, { ReactElement } from "react";

import Logout from "components/Auth/Logout";

const AuthenticatedBar = (): ReactElement => {
  return <Logout />;
};

export default AuthenticatedBar;
