import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import { createAction, createReducer, PrepareAction } from "@reduxjs/toolkit";
import React, { ChangeEvent } from "react";
import { connect, ConnectedProps } from "react-redux";

import { register } from "actions/auth";

interface ChangeInputPayload {
  name: string;
  value: string;
}

const changeInput = createAction<PrepareAction<ChangeInputPayload>>(
  "register/changeInput",
  ({ target: { name, value } }: ChangeEvent<HTMLInputElement>) => ({
    payload: {
      name,
      value,
    },
  }),
);

const initialState = {
  username: "",
  password: "",
  email: "",
  name: "",
  usernameErrorMessage: "",
  passwordErrorMessage: "",
};

const reducer = createReducer(initialState, (builder) =>
  builder.addCase(changeInput, (state, action) => {
    const { name, value } = action.payload;
    let { usernameErrorMessage, passwordErrorMessage } = state;

    if (name === "username") {
      usernameErrorMessage =
        value.length < 5 ? "Username must be at least 5 characters." : "";
    }

    if (name === "password") {
      passwordErrorMessage =
        value.length < 9 ? "Password must be at least 9 characters." : "";
    }

    return {
      ...state,
      [name]: value,
      usernameErrorMessage,
      passwordErrorMessage,
    };
  }),
);

const connector = connect(null, { register });
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;

const Register = (props: Props): React.ReactElement => {
  const [open, setOpen] = React.useState(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const [
    {
      username,
      password,
      email,
      name,
      usernameErrorMessage,
      passwordErrorMessage,
    },
    dispatch,
  ] = React.useReducer(reducer, initialState);

  const handleRegister = (): void => {
    setOpen(false);
    props.register({ username, password, email, name });
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
          <TextField
            autoFocus
            label="Username"
            onChange={(e): void => {
              dispatch(changeInput(e));
            }}
            error={!!usernameErrorMessage}
            helperText={usernameErrorMessage}
            name="username"
            value={username}
            required
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            onChange={(e): void => {
              dispatch(changeInput(e));
            }}
            error={!!passwordErrorMessage}
            helperText={passwordErrorMessage}
            name="password"
            value={password}
            required
            fullWidth
          />
          <TextField
            label="Email Address"
            type="email"
            onChange={(e): void => {
              dispatch(changeInput(e));
            }}
            name="email"
            value={email}
            required
            fullWidth
          />
          <TextField
            label="Name"
            type="text"
            onChange={(e): void => {
              dispatch(changeInput(e));
            }}
            name="name"
            value={name}
            required
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleRegister} color="primary">
            Register
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default connector(Register);
