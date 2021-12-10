import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { AuthPage } from "./pages/AuthPage";
import { ForumPage } from "./pages/ForumPage";
import { RegisterPage } from "./pages/RegisterPage";
import { Import } from "./pages/ImportPage";

export const useRoutes = (isAuth) => {
  if (isAuth) {
    return (
      <Switch>
        <Route path="/forum/" exact>
          <ForumPage />
        </Route>
        <Route path="/import/" exact>
          <Import />
        </Route>
        <Redirect to="/forum/" />
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path="/login">
        <AuthPage />
      </Route>
      <Route path="/register">
        <RegisterPage />
      </Route>
      <Redirect to="/login" />
    </Switch>
  );
};
