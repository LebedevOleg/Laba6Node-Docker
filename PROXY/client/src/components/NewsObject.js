import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import DOMPurify from "dompurify";
import { AuthContext } from "../context/authContext";

export const NewsObject = (news) => {
  return (
    <div className="col s6">
      <div className="card">
        <div className="card-content">
          <p>Заголовок: {news.news.title._text}</p>
          <a href={news.news.link._text}>Ссылка</a>
        </div>
      </div>
    </div>
  );
};

export default NewsObject;
