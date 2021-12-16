import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";

import "./ChangeMessage.modal.css";

const BlockUser = () => {
  const [state, setState] = useState(false);
  const [users, setUsers] = useState([]);

  const getUsers = useCallback(() => {
    axios.get("/api/forum/getAllUsers").then(async (res) => {
      setUsers(res.data);
    });
  }, []);

  const changeBlockHandler = async (event) => {
    await axios
      .post("/api/forum/blockUser", {
        userID: event.target.name,
        blocked: event.target.checked,
      })
      .then((res) => {
        if (window.M) {
          window.M.toast({ html: res.data.message });
        }
      });
  };

  const UserSpaun = (user) => {
    return (
      <React.Fragment>
        <h6>
          {user.login}
          <div className="switch">
            <label>
              разблокировать
              <input
                type="checkbox"
                name={user.id}
                defaultChecked={user.is_block}
                onChange={changeBlockHandler}
              />
              <span className="lever"></span>
              заблокировать
            </label>
          </div>
        </h6>
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      <a
        onClick={() => {
          getUsers();
          setState(true);
        }}
        style={{ cursor: "pointer" }}
      >
        Блокировка пользователей
      </a>

      {state && (
        <div className="modal">
          <div className="modal-body">
            <h1>Блокировка пользователей</h1>
            <div>
              {users.map((user) => (
                <p>{UserSpaun(user)}</p>
              ))}
            </div>
            <p />
            <button
              onClick={() => {
                setUsers([]);
                setState(false);
              }}
            >
              Закрыть окно
            </button>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};
export default BlockUser;
