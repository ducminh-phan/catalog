import { createReducer } from "@reduxjs/toolkit";

import { login } from "actions/auth";
import storage from "utils/storage";

interface AuthState {
  token: string | null;
}

const initialState: AuthState = {
  token: storage.getToken(),
};

export default createReducer(initialState, (builder) =>
  builder.addCase(
    login.fulfilled,
    (state, { payload: { access_token: token } }) => ({ token }),
  ),
);
