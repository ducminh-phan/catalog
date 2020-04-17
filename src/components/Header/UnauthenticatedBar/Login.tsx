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

import { login } from "actions/auth";

interface ChangeInputPayload {
  name: string;
  value: string;
}

const changeInput = createAction<PrepareAction<ChangeInputPayload>>(
  "login/changeInput",
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
};

const reducer = createReducer(initialState, (builder) =>
  builder.addCase(changeInput, (state, action) => {
    const { name, value } = action.payload;

    return {
      ...state,
      [name]: value,
    };
  }),
);

const connector = connect(null, { login });
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;

const Login = (props: Props): React.ReactElement => {
  const [open, setOpen] = React.useState(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const [{ username, password }, dispatch] = React.useReducer(
    reducer,
    initialState,
  );

  const handleLogin = (): void => {
    setOpen(false);
    props.login({ username, password });
  };

  return (
    <>
      <Button color="inherit" onClick={handleOpen}>
        Login
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="register-form-title"
        fullWidth
      >
        <DialogTitle id="register-form-title">Login</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Username"
            onChange={(e): void => {
              dispatch(changeInput(e));
            }}
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
            name="password"
            value={password}
            required
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogin} color="primary">
            Login
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default connector(Login);
