import { Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import React, { ReactElement } from "react";

import { useNotification } from "contexts/notification";

const Notification = (): ReactElement => {
  const { message, severity, setNotification } = useNotification();

  const handleClose = (): void => {
    setNotification({ severity, message: "" });
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      open={!!message}
      onClose={handleClose}
      autoHideDuration={3000}
    >
      <Alert severity={severity}>{message}</Alert>
    </Snackbar>
  );
};

export default Notification;
