import { Button } from "@material-ui/core";
import React, { ReactElement } from "react";

import { useAuth } from "contexts/auth";

const Logout = (): ReactElement => {
  const { logout } = useAuth();

  return (
    <Button color="inherit" onClick={logout}>
      Logout
    </Button>
  );
};

export default Logout;
