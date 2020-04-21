import "./assets/styles/index.css";

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import App from "components/App";
import Notification from "components/Notification";
import { AuthProvider } from "contexts/auth";
import { NotificationProvider } from "contexts/notification";
import store from "store";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <NotificationProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
        <Notification />
      </NotificationProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root"),
);
