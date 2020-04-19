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
  username: yup.string().min(5).required().label("User name"),
  password: yup.string().min(9).required(),
  email: yup.string().email("Not a valid email").required(),
  name: yup.string().required(),
});

const validate = makeValidate(schema);

const required = makeRequired(schema);

type FormData = yup.InferType<typeof schema>;

const Register = (): React.ReactElement => {
  const [open, setOpen] = React.useState(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const { register } = useAuth();

  const handleRegister = (data: FormData): void => {
    register(data);
  };

  return (
    <>
      <Button color="inherit" onClick={handleOpen}>
        Register
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="register-form-title"
        fullWidth
      >
        <DialogTitle id="register-form-title">Register</DialogTitle>
        <DialogContent>
          <Form
            onSubmit={handleRegister}
            validate={validate}
            render={({ handleSubmit, invalid }): ReactNode => (
              <form onSubmit={handleSubmit} noValidate>
                <TextField
                  label="User name"
                  name="username"
                  required={required.username}
                  fullWidth
                />
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  required={required.password}
                  fullWidth
                />
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  required={required.email}
                  fullWidth
                />
                <TextField
                  label="Name"
                  name="name"
                  required={required.name}
                  fullWidth
                />
                <DialogActions>
                  <Button type="button" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button color="primary" type="submit" disabled={invalid}>
                    Register
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

export default Register;
