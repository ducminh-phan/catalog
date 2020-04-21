import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import { makeRequired, makeValidate, TextField } from "mui-rff";
import React, { ReactNode } from "react";
import { Form } from "react-final-form";
import * as yup from "yup";

import { useAuth } from "contexts/auth";

const schema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required(),
});

const validate = makeValidate(schema);

const required = makeRequired(schema);

type FormData = yup.InferType<typeof schema>;

const Login = (): React.ReactElement => {
  const [open, setOpen] = React.useState(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const { login } = useAuth();

  const handleLogin = (data: FormData): void => {
    login(data);
  };

  return (
    <>
      <Button color="inherit" onClick={handleOpen}>
        Login
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="login-form-title"
        fullWidth
      >
        <DialogTitle id="login-form-title">Login</DialogTitle>
        <DialogContent>
          <Form
            onSubmit={handleLogin}
            validate={validate}
            render={({ handleSubmit, invalid }): ReactNode => (
              <form onSubmit={handleSubmit} noValidate>
                <TextField
                  id="login-username"
                  label="Username"
                  name="username"
                  required={required.username}
                  fullWidth
                />
                <TextField
                  id="login-password"
                  label="Password"
                  name="password"
                  type="password"
                  required={required.password}
                  fullWidth
                />
                <DialogActions>
                  <Button type="button" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button color="primary" type="submit" disabled={invalid}>
                    Login
                  </Button>
                </DialogActions>
              </form>
            )}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Login;
