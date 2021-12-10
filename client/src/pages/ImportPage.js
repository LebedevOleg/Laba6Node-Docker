import axios from "axios";
import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  Component,
} from "react";
import fs, { writeFileSync } from "fs";
import { useHistory } from "react-router";
import { AuthContext } from "../context/authContext";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import Dropdown from "react-dropdown";
import Select from "react-select";
import "react-dropdown/style.css";
const XLSX = require("xlsx");
const { Parser, parse } = require("json2csv");

const colourStyles = {
  control: (styles) => ({ ...styles, backgroundColor: "white" }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor: isDisabled ? "red" : "white",
      color: "black",
      isSelected: "grey",
      cursor: isDisabled ? "not-allowed" : "default",
    };
  },
};

const optionsSwitch = [
  { value: "like", label: "Колличество лайков" },
  { value: "email", label: "email отправителя" },
];

export const Import = () => {
  const [dateStart, setDateStart] = useState(new Date());
  const [dateEnd, setDateEnd] = useState(new Date());
  const [value, setValue] = useState(0);
  const [formatDate, setFormatDate] = useState("");
  const [formatCount, setFormatCount] = useState("");
  const history = useHistory();
  const auth = useContext(AuthContext);
  const [upDown, setUpDown] = useState(false);

  var listExport = {
    selectedItems: null,
  };

  const LogoutHandler = (event) => {
    event.preventDefault();
    auth.logout();
    history.push("/");
  };

  const options = [
    { value: 1, label: "1" },
    { value: 5, label: "5" },
    { value: 10, label: "10" },
  ];
  const handleChangeCount = (event) => {
    setValue(event.value);
  };
  const handleChangeDateStart = (event) => {
    setDateStart(event.value);
  };
  const handleChangeDateEnd = (event) => {
    setDateEnd(event.value);
  };

  function download(filename, text, type, charset = "utf-8") {
    var element = document.createElement("a");
    element.setAttribute(
      "href",
      `data:text/${type};charset=${charset},` + encodeURI(text)
    );
    element.setAttribute("download", filename);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  // *!! здесь функция отправки по дате
  const ImportFileDate = async () => {
    var writeFile = [];
    var login = "";
    var likes = false;
    var email = false;
    dateEnd.setDate(dateEnd.getDate() + 2);
    await axios
      .post("/api/forum/importDataDate", {
        StartDate: dateStart.toISOString().split("T")[0],
        EndDate: dateEnd.toISOString().split("T")[0],
      })
      .then(async (res) => {
        res.data.rows.map((row) => {
          if (row.login == null) {
            login = "[DELETED]";
          } else {
            login = row.login;
          }
          try {
            if (
              listExport[0].value === "like" ||
              listExport[1].value === "like"
            ) {
              likes = true;
            }
          } catch (e) {}
          try {
            if (
              listExport[0].value == "email" ||
              listExport[1].value == "email"
            ) {
              email = true;
            }
          } catch (e) {}
          if (email && likes) {
            writeFile.push({
              id: row.id,
              login: login,
              text: row.text.replaceAll("\n", ""),
              date: row.date,
              email: row.email,
              likes: row.count,
            });
          } else if (email && !likes) {
            writeFile.push({
              id: row.id,
              login: login,
              text: row.text.replaceAll("\n", ""),
              date: row.date,
              email: row.email,
            });
          } else if (!email && likes) {
            writeFile.push({
              id: row.id,
              login: login,
              text: row.text.replaceAll("\n", ""),
              date: row.date,
              likes: row.count,
            });
          } else {
            writeFile.push({
              id: row.id,
              login: login,
              text: row.text.replaceAll("\n", ""),
              date: row.date,
            });
          }
        });
        var FileName = Date.now().toString() + "." + formatDate;
        switch (formatDate) {
          // !! УРА ОНО РАБОТАЕТ БЛЯТЬ!!!!!!! день на это дерьмо ушло!! !!!!!!!!!!!!!!!!!!!!!!
          case "json":
            var text = JSON.stringify(writeFile);
            download(FileName, text, "json");
            break;
          case "xml":
            var text = "";
            if (email && likes) {
              text =
                '<?xml version="1.0" encoding="utf-8"?> \n <forumPosts>' +
                writeFile
                  .map(
                    ({ id, login, text, date, email, likes }) =>
                      `<post category = "${id}">\n <author> ${login}</author> \n <content> ${text.replaceAll(
                        "<",
                        ""
                      )}</content> \n <date> ${date} </date>\n <email>${email}</email> \n <like>${likes}</like>\n </post>`,
                    " "
                  )
                  .join("\n") +
                "</forumPosts>";
            } else if (email && !likes) {
              text =
                '<?xml version="1.0" encoding="utf-8"?> \n <forumPosts>' +
                writeFile
                  .map(
                    ({ id, login, text, date, email, likes }) =>
                      `<post category = "${id}">\n <author> ${login}</author> \n <content> ${text.replaceAll(
                        "<",
                        ""
                      )}</content> \n <date> ${date} </date>\n <email>${email}</email>\n </post>`,
                    " "
                  )
                  .join("\n") +
                "</forumPosts>";
            } else if (!email && likes) {
              text =
                '<?xml version="1.0" encoding="utf-8"?> \n <forumPosts>' +
                writeFile
                  .map(
                    ({ id, login, text, date, email, likes }) =>
                      `<post category = "${id}">\n <author> ${login}</author> \n <content> ${text.replaceAll(
                        "<",
                        ""
                      )}</content> \n <date> ${date} </date> \n <like>${likes}</like>\n </post>`,
                    " "
                  )
                  .join("\n") +
                "</forumPosts>";
            } else {
              text =
                '<?xml version="1.0" encoding="utf-8"?> \n <forumPosts>' +
                writeFile
                  .map(
                    ({ id, login, text, date, email, likes }) =>
                      `<post category = "${id}">\n <author> ${login}</author> \n <content> ${text.replaceAll(
                        "<",
                        ""
                      )}</content> \n <date> ${date} </date>\n </post>`,
                    " "
                  )
                  .join("\n") +
                "</forumPosts>";
            }

            download(FileName, text, "xml");
            break;

          case "csv":
            var opts = {
              delimiter: ";",
              header: true,
            };
            const csvFile = parse(writeFile, opts);
            download(FileName, csvFile, "csv", "utf8");
            break;
          case "xlsx":
            const workSheet = XLSX.utils.json_to_sheet(writeFile);
            const workBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workBook, workSheet, "students");
            XLSX.write(workBook, { bookType: "xlsx", type: "buffer" });
            XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
            XLSX.writeFile(workBook, FileName);
            break;
        }
        dateEnd.setDate(dateEnd.getDate());
      });
  };

  const ImportFileCount = async () => {
    console.log(formatCount);
    var writeFile = [];
    var login = "";
    var likes = false;
    var email = false;
    if (upDown == false) {
      await axios
        .post("/api/forum/importDataCount", {
          Count: value,
          side: "desc",
        })
        .then(async (res) => {
          res.data.rows.map((row) => {
            if (row.login == null) {
              login = "[DELETED]";
            } else {
              login = row.login;
            }
            try {
              if (
                listExport[0].value === "like" ||
                listExport[1].value === "like"
              ) {
                likes = true;
              }
            } catch (e) {}
            try {
              if (
                listExport[0].value == "email" ||
                listExport[1].value == "email"
              ) {
                email = true;
              }
            } catch (e) {}
            console.log(email, likes);
            if (email && likes) {
              writeFile.push({
                id: row.id,
                login: login,
                text: row.text.replaceAll("\n", ""),
                date: row.date,
                email: row.email,
                likes: row.count,
              });
            } else if (email && !likes) {
              writeFile.push({
                id: row.id,
                login: login,
                text: row.text.replaceAll("\n", ""),
                date: row.date,
                email: row.email,
              });
            } else if (!email && likes) {
              writeFile.push({
                id: row.id,
                login: login,
                text: row.text.replaceAll("\n", ""),
                date: row.date,
                likes: row.count,
              });
            } else {
              writeFile.push({
                id: row.id,
                login: login,
                text: row.text.replaceAll("\n", ""),
                date: row.date,
              });
            }
          });
          var FileName = Date.now().toString() + "." + formatCount;
          switch (formatCount) {
            case "json":
              var text = JSON.stringify(writeFile);
              download(FileName, text, "json");
              break;
            case "xml":
              var text = "";
              if (email && likes) {
                text =
                  '<?xml version="1.0" encoding="utf-8"?> \n <forumPosts>' +
                  writeFile
                    .map(
                      ({ id, login, text, date, email, likes }) =>
                        `<post category = "${id}">\n <author> ${login}</author> \n <content> ${text.replaceAll(
                          "<",
                          ""
                        )}</content> \n <date> ${date} </date>\n <email>${email}</email> \n <like>${likes}</like>\n </post>`,
                      " "
                    )
                    .join("\n") +
                  "</forumPosts>";
              } else if (email && !likes) {
                text =
                  '<?xml version="1.0" encoding="utf-8"?> \n <forumPosts>' +
                  writeFile
                    .map(
                      ({ id, login, text, date, email, likes }) =>
                        `<post category = "${id}">\n <author> ${login}</author> \n <content> ${text.replaceAll(
                          "<",
                          ""
                        )}</content> \n <date> ${date} </date>\n <email>${email}</email>\n </post>`,
                      " "
                    )
                    .join("\n") +
                  "</forumPosts>";
              } else if (!email && likes) {
                text =
                  '<?xml version="1.0" encoding="utf-8"?> \n <forumPosts>' +
                  writeFile
                    .map(
                      ({ id, login, text, date, email, likes }) =>
                        `<post category = "${id}">\n <author> ${login}</author> \n <content> ${text.replaceAll(
                          "<",
                          ""
                        )}</content> \n <date> ${date} </date> \n <like>${likes}</like>\n </post>`,
                      " "
                    )
                    .join("\n") +
                  "</forumPosts>";
              } else {
                text =
                  '<?xml version="1.0" encoding="utf-8"?> \n <forumPosts>' +
                  writeFile
                    .map(
                      ({ id, login, text, date, email, likes }) =>
                        `<post category = "${id}">\n <author> ${login}</author> \n <content> ${text.replaceAll(
                          "<",
                          ""
                        )}</content> \n <date> ${date} </date>\n </post>`,
                      " "
                    )
                    .join("\n") +
                  "</forumPosts>";
              }
              download(FileName, text, "xml");
              break;
            // !! не меняется кодировка русские символы не читаемые Время 1:25 ДАЙТЕ МНЕ УМЕРЕТЬ
            case "csv":
              var opts = {
                delimiter: ";",
                header: true,
              };
              const csvFile = parse(writeFile, opts);
              download(FileName, csvFile, "csv", "utf8");
              break;
            case "xlsx":
              const workSheet = XLSX.utils.json_to_sheet(writeFile);
              const workBook = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(workBook, workSheet, "students");
              XLSX.write(workBook, { bookType: "xlsx", type: "buffer" });
              XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
              XLSX.writeFile(workBook, FileName);
              break;
          }
        });
    } else {
      await axios
        .post("/api/forum/importDataCount", {
          Count: value,
          side: "asc",
        })
        .then(async (res) => {
          res.data.rows.map((row) => {
            if (row.login == null) {
              login = "[DELETED]";
            } else {
              login = row.login;
            }
            try {
              if (
                listExport[0].value === "like" ||
                listExport[1].value === "like"
              ) {
                likes = true;
              }
            } catch (e) {}
            try {
              if (
                listExport[0].value == "email" ||
                listExport[1].value == "email"
              ) {
                email = true;
              }
            } catch (e) {}
            console.log(email, likes);
            if (email && likes) {
              writeFile.push({
                id: row.id,
                login: login,
                text: row.text.replaceAll("\n", ""),
                date: row.date,
                email: row.email,
                likes: row.count,
              });
            } else if (email && !likes) {
              writeFile.push({
                id: row.id,
                login: login,
                text: row.text.replaceAll("\n", ""),
                date: row.date,
                email: row.email,
              });
            } else if (!email && likes) {
              writeFile.push({
                id: row.id,
                login: login,
                text: row.text.replaceAll("\n", ""),
                date: row.date,
                likes: row.count,
              });
            } else {
              writeFile.push({
                id: row.id,
                login: login,
                text: row.text.replaceAll("\n", ""),
                date: row.date,
              });
            }
          });
          var FileName = Date.now().toString() + "." + formatCount;
          switch (formatCount) {
            case "json":
              var text = JSON.stringify(writeFile);
              download(FileName, text, "json");
              break;
            case "xml":
              var text = "";
              if (email && likes) {
                text =
                  '<?xml version="1.0" encoding="utf-8"?> \n <forumPosts>' +
                  writeFile
                    .map(
                      ({ id, login, text, date, email, likes }) =>
                        `<post category = "${id}">\n <author> ${login}</author> \n <content> ${text.replaceAll(
                          "<",
                          ""
                        )}</content> \n <date> ${date} </date>\n <email>${email}</email> \n <like>${likes}</like>\n </post>`,
                      " "
                    )
                    .join("\n") +
                  "</forumPosts>";
              } else if (email && !likes) {
                text =
                  '<?xml version="1.0" encoding="utf-8"?> \n <forumPosts>' +
                  writeFile
                    .map(
                      ({ id, login, text, date, email, likes }) =>
                        `<post category = "${id}">\n <author> ${login}</author> \n <content> ${text.replaceAll(
                          "<",
                          ""
                        )}</content> \n <date> ${date} </date>\n <email>${email}</email>\n </post>`,
                      " "
                    )
                    .join("\n") +
                  "</forumPosts>";
              } else if (!email && likes) {
                text =
                  '<?xml version="1.0" encoding="utf-8"?> \n <forumPosts>' +
                  writeFile
                    .map(
                      ({ id, login, text, date, email, likes }) =>
                        `<post category = "${id}">\n <author> ${login}</author> \n <content> ${text.replaceAll(
                          "<",
                          ""
                        )}</content> \n <date> ${date} </date> \n <like>${likes}</like>\n </post>`,
                      " "
                    )
                    .join("\n") +
                  "</forumPosts>";
              } else {
                text =
                  '<?xml version="1.0" encoding="utf-8"?> \n <forumPosts>' +
                  writeFile
                    .map(
                      ({ id, login, text, date, email, likes }) =>
                        `<post category = "${id}">\n <author> ${login}</author> \n <content> ${text.replaceAll(
                          "<",
                          ""
                        )}</content> \n <date> ${date} </date>\n </post>`,
                      " "
                    )
                    .join("\n") +
                  "</forumPosts>";
              }
              download(FileName, text, "xml");
              break;
            case "csv":
              var opts = {
                delimiter: ";",
                header: true,
              };
              const csvFile = parse(writeFile, opts);
              download(FileName, csvFile, "csv", "utf8");
              break;
            case "xlsx":
              const workSheet = XLSX.utils.json_to_sheet(writeFile);
              const workBook = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(workBook, workSheet, "students");
              XLSX.write(workBook, { bookType: "xlsx", type: "buffer" });
              XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
              XLSX.writeFile(workBook, FileName);
              break;
          }
        });
    }
  };

  const handleChangeFormat = (event) => {
    if (event.target.name === "group1") {
      switch (event.target.id) {
        case "1":
          setFormatDate("json");
          break;
        case "2":
          setFormatDate("csv");
          break;
        case "3":
          setFormatDate("xml");
          break;
        case "4":
          setFormatDate("xlsx");
          break;
      }
    } else {
      switch (event.target.id) {
        case "1":
          setFormatCount("json");
          break;
        case "2":
          setFormatCount("csv");
          break;
        case "3":
          setFormatCount("xml");
          break;
        case "4":
          setFormatCount("xlsx");
          break;
      }
    }
  };

  const changeBlockHandler = async (event) => {
    setUpDown(event.target.checked);
  };

  const changeListExport = async (event) => {
    listExport = event;
  };

  return (
    <>
      <nav>
        <div className="nav-wrapper #689f38 light-green darken-2">
          <a className="brand-logo ">Страница форума</a>
          <ul id="nav-mobile" className="right hide-on-med-and-down ">
            <li> Пользователь: {auth.userLogin}</li>
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
      <div className="row">
        <div className="col s12 m6 ">
          <div className="card blue-grey darken-1">
            <div className="card-content white-text">
              <span className="card-title">Импорт по дате</span>
              <div>
                Дата начала импорта
                <DatePickerComponent
                  placeholder="Дата начала импорта"
                  format="yyyy/MM/dd"
                  max={new Date(Date.now())}
                  onChange={handleChangeDateStart}
                ></DatePickerComponent>
                Дата конца импорта
                <DatePickerComponent
                  placeholder="Дата конца импорта"
                  format="yyyy/MM/dd"
                  max={new Date(Date.now())}
                  onChange={handleChangeDateEnd}
                ></DatePickerComponent>
                <p>
                  <form action="#">
                    <p>
                      <label>
                        <input
                          id="1"
                          name="group1"
                          type="radio"
                          onChange={handleChangeFormat}
                        />
                        <span>JSON</span>
                      </label>
                    </p>
                    <p>
                      <label>
                        <input
                          id="2"
                          name="group1"
                          type="radio"
                          onChange={handleChangeFormat}
                        />
                        <span>CSV </span>
                      </label>
                    </p>
                    <p>
                      <label>
                        <input
                          id="3"
                          class="with-gap"
                          name="group1"
                          type="radio"
                          onChange={handleChangeFormat}
                        />
                        <span>XML</span>
                      </label>
                    </p>
                    <p>
                      <label>
                        <input
                          id="4"
                          class="with-gap"
                          name="group1"
                          type="radio"
                          onChange={handleChangeFormat}
                        />
                        <span>XLSX</span>
                      </label>
                    </p>
                  </form>
                </p>
              </div>
            </div>
            <div className="card-action">
              <a style={{ cursor: "pointer" }} onClick={ImportFileDate}>
                Импортировать
              </a>
            </div>
          </div>
        </div>
        <div className="col s12 m6 ">
          <div className="card blue-grey darken-1">
            <div className="card-content white-text">
              <span className="card-title">Импорт по колличеству</span>
              <Dropdown
                options={options}
                onChange={handleChangeCount}
                value={value}
              />
              <p>
                <form action="#">
                  <p>
                    <label>
                      <input
                        id="1"
                        name="group2"
                        type="radio"
                        onChange={handleChangeFormat}
                      />
                      <span>JSON</span>
                    </label>
                  </p>
                  <p>
                    <label>
                      <input
                        id="2"
                        name="group2"
                        type="radio"
                        onChange={handleChangeFormat}
                      />
                      <span>CSV </span>
                    </label>
                  </p>
                  <p>
                    <label>
                      <input
                        id="3"
                        name="group2"
                        type="radio"
                        onChange={handleChangeFormat}
                      />
                      <span>XML</span>
                    </label>
                  </p>
                  <p>
                    <label>
                      <input
                        id="4"
                        name="group2"
                        type="radio"
                        onChange={handleChangeFormat}
                      />
                      <span>XLSX</span>
                    </label>
                  </p>
                </form>
              </p>
              <div className="switch">
                <label>
                  С верху
                  <input type="checkbox" onChange={changeBlockHandler} />
                  <span className="lever"></span>С низу
                </label>
              </div>
            </div>
            <div className="card-action">
              <a style={{ cursor: "pointer" }} onClick={ImportFileCount}>
                Импортировать
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="col s12 m6">
        <div class="card blue-grey darken-1">
          <div class="card-content white-text">
            <span class="card-title">Выбрать данные для экспорта</span>
            <p>
              <Select
                options={optionsSwitch}
                isMulti={true}
                styles={colourStyles}
                onChange={changeListExport}
              />
            </p>
          </div>
          <div class="card-action"></div>
        </div>
      </div>
    </>
  );
};

export default Import;
