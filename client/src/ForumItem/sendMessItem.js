import React, { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/authContext";

const SendMessTodo = () => {
  const auth = useContext(AuthContext);
  const [form, setForm] = useState({
    userId: auth.userId,
    text: "",
  });

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const sendPost = async (event) => {
    if (form.text.trim() === "") {
      if (window.M) {
        window.M.toast({ html: "Нельзя отправить пустое сообщение" });
      }
      return;
    }
    try {
      const addPost = await axios
        .post("/api/forum/sendPost", { ...form })
        .then((res) => {
          if (window.M) {
            window.M.toast({ html: res.data.message });
          }
        })
        .catch((error) => {});
    } catch (e) {}
  };
  return (
    <div>
      {!auth.isBlock ? (
        <div className="row">
          <div className="col s12">
            <div className="row">
              <div className="input-field col s12">
                <textarea
                  id="textarea1"
                  name="text"
                  className="materialize-textarea validate"
                  type="text"
                  required=""
                  onChange={changeHandler}
                ></textarea>
                <label for="textarea1">Ваше сообщение</label>
                <button
                  className="btn waves-effect waves-light"
                  type="submit"
                  name="action"
                  onClick={sendPost}
                >
                  <i className="material-icons right">Отправить</i>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>ВЫ ЗАБЛОКИРОВАНЫ И НЕ МОЖЕТЕ ПИСАТЬ СООБЩЕНИЯ</div>
      )}
    </div>
  );
};

export default SendMessTodo;
