import "./assets/styles/index.css";

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import * as serviceWorker from "serviceWorker";

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

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
