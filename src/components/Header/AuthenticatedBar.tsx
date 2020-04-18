import { Button, Toolbar } from "@material-ui/core";
import React, { ReactElement } from "react";

import { useAuth } from "contexts/auth";

const AuthenticatedBar = (): ReactElement => {
  const { logout } = useAuth();

  return (
    <Toolbar>
      <Button color="inherit" onClick={logout}>
        Logout
      </Button>
    </Toolbar>
  );
};

export default AuthenticatedBar;
