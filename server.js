const express = require("express");
const socketIO = require("socket.io");
const path = require("path");

const app = express();
const server = app.listen(8080, () => {
    console.log("Server running on port 8080");
});
const io = socketIO(server);

app.get("/page1", (req, res) => {
  res.sendFile(path.join(__dirname, "/pages/page1.html"));
});

app.get("/page2", (req, res) => {
  res.sendFile(path.join(__dirname, "/pages/page2.html"));
});

let checkboxState = {};
let textValues = {};

io.on("connection", (socket) => {

  socket.on("pageClosing", ({}) => {
    io.emit("pageClosed", {});
    console.log('invoked')
  });

  io.emit("initialState", {
    checkboxState,
    textValues,
  });

  socket.on("checkboxChange", ({ checkboxId, isChecked }) => {
    checkboxState[checkboxId] = isChecked;

    io.emit("checkboxState", {
      checkboxId,
      checkboxState,
    });
  });

  socket.on("textChange", ({ textboxId, text }) => {
    textValues[textboxId] = text;
    io.emit("textChange", {
      textboxId,
      text,
    });
  });
});

const port = 8080;


