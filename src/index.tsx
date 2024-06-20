import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./scenes/signin/signin";
import ProtectedRoute from "./components/PrivateRoute";

import { Provider } from 'react-redux';
import rootReducer from './reducers';
import { createStore, applyMiddleware,compose } from 'redux';
import { thunk } from 'redux-thunk';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer,composeEnhancers(applyMiddleware(thunk)));
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/*"
          element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          } />
        <Route
          path="*"
          element={<Navigate to="/signin" replace />}
        />
      </Routes>
    </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
