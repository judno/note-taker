const express = require("express");
const path = require("path");
const app = express();

const noteHtml = "/public/notes.html";
const indexHtml = "/public/index.html";

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, noteHtml));
});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, indexHtml));
});

app.listen(3000);
