import React from "react";

export const UserSpaun = (user) => {

  
  return (
    <div>
      <h4>
        {user.login}
        <div className="switch">
          <label>
            разблокировать
            <input type="checkbox" name={user.id} onChange = {}/>
            <span className="lever"></span>
            заблокировать
          </label>
        </div>
      </h4>
    </div>
  );
};
