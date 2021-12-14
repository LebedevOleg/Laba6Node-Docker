import React, { useState, useEffect, useContext, useCallback } from "react";
import stl from "./AuthPage.module.css";
import axios from "axios";
import { useHistory } from "react-router";
import { AuthContext } from "../context/authContext";
import NewsObject from "../components/NewsObject";

export const NewsPage = () => {
  const [news, setNews] = useState([]);
  const history = useHistory();
  const auth = useContext(AuthContext);
  const getNews = useCallback(async () => {
    try {
      await axios.get("/api/news/getNews").then((res) => {
        var jsonRes = JSON.parse(res.data);
        setNews(jsonRes.rss.channel.item);
      });
    } catch (e) {
      console.log(e.message);
    }
  }, []);
  const LogoutHandler = (event) => {
    event.preventDefault();
    auth.logout();
    history.push("/");
  };

  useEffect(() => {
    getNews();
  }, [getNews]);
  return (
    <>
      <nav>
        <div className="nav-wrapper #689f38 light-green darken-2">
          <a className="brand-logo ">Страница форума</a>
          <ul id="nav-mobile" className="right hide-on-med-and-down ">
            <li> Пользователь: {auth.userLogin}</li>
            <li>
              <a href="/news/">Новости</a>
            </li>
            <li>
              <a href="/forum/">Форум</a>{" "}
            </li>
            <li>
              <a href="/import/">импорт сообщений</a>{" "}
            </li>
            <li>
              <a href="/" onClick={LogoutHandler}>
                выход
              </a>
            </li>
          </ul>
        </div>
      </nav>
      <div>
        <h2>НОВОСТИ</h2>
        <div className="row">
          {news.map((object) => (
            <NewsObject news={object} />
          ))}
        </div>
      </div>
    </>
  );
};

export default NewsPage;
