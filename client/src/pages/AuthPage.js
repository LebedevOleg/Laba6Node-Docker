import React, { useState, useContext } from "react";
import stl from "./AuthPage.module.css";
import axios from "axios";
import { AuthContext } from "../context/authContext";

export const AuthPage = () => {
  const auth = useContext(AuthContext);
  const [form, setForm] = useState({
    login: "",
    password: "",
  });

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };
  const authHandler = async () => {
    const message = "";
    try {
      const authCheck = await axios
        .post("/api/login", { ...form })
        .catch((error) => {
          if (error.response) {
            if (window.M) {
              window.M.toast({ html: error.response.data.message });
            }
          } else if (error.request) {
            if (window.M) {
              window.M.toast({ html: error.response.data.message });
            }
          }
        });
      auth.login(
        authCheck.data.token,
        authCheck.data.userId,
        authCheck.data.userLogin,
        authCheck.data.IsAdmin,
        authCheck.data.IsBlock
      );
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <div id={stl.login}>
        <h1>Форма входа</h1>
        <fieldset id={stl.inputs}>
          <input
            id={stl.username}
            type="text"
            name="login"
            placeholder="Логин"
            autofocus="true"
            required="true"
            onChange={changeHandler}
          />
          <input
            id={stl.password}
            type="password"
            name="password"
            placeholder="Пароль"
            required="true"
            onChange={changeHandler}
          />
        </fieldset>
        <fieldset id={stl.actions}>
          <input
            type="submit"
            id={stl.submit}
            value="ВОЙТИ"
            onClick={authHandler}
          />
          <a href="/register">Регистрация</a>
        </fieldset>
      </div>
    </div>
  );
};

/* .then(res => {
    console.log(res.data.token)                
}) */
