import axios from "axios";
import React, { useState, useEffect } from "react";
import "./ChangeMessage.modal.css";

const Modal = (post) => {
  const [state, setState] = useState(false);
  const [form, setForm] = useState({
    postId: post.post.id,
    text: "",
  });
  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };
  const ChangeMessageHandler = () => {
    try {
      axios.post("/api/forum/updatePost", { ...form }).then((res) => {
        if (window.M) {
          window.M.toast({ html: res.data.message });
        }
        setState(false);
      });
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <React.Fragment>
      <a onClick={() => setState(true)} style={{ cursor: "pointer" }}>
        Изменить сообщение
      </a>

      {state && (
        <div className="modal">
          <div className="modal-body">
            <h1>Изменить сообщение</h1>
            <div className="input-field col s12">
              <textarea
                id="textarea1"
                name="text"
                className="materialize-textarea valid"
                required=""
                onChange={changeHandler}
              >
                {" "}
              </textarea>
              <label for="textarea1">Ваше сообщение</label>
              <button
                className="btn waves-effect waves-light"
                type="submit"
                name="action"
                onClick={ChangeMessageHandler}
              >
                <i className="material-icons right">Отправить</i>
              </button>
            </div>
            <button onClick={() => setState(false)}>Закрыть окно</button>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default Modal;
