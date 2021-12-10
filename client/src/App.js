import React from "react";
import "materialize-css";
import { useRoutes } from "./routes";
import { BrowserRouter as Router } from "react-router-dom";
import { useAuth } from "./hooks/auth.hook";
import { AuthContext } from "./context/authContext";
import { Loader } from "./components/Loader";

function App() {
  const { token, login, logout, userId, userLogin, ready, isAdmin, isBlock } =
    useAuth();
  const isAuthent = !!token;
  const routes = useRoutes(isAuthent);

  if (!ready) {
    return <Loader />;
  }
  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
        userId,
        isAuthent,
        userLogin,
        isAdmin,
        isBlock,
      }}
    >
      <Router>
        <div className="container">{routes}</div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
