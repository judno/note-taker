const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const app = express();

const noteHtmlPath = path.join(__dirname, "/public/notes.html");
const indexHtmlPath = path.join(__dirname, "/public/index.html");
const jsonPath = path.join(__dirname, "/db/db.json");

app.use(express.urlencoded({ extended: true }));

app.get("/notes", function (req, res) {
  res.sendFile(noteHtmlPath);
});

app.get("/api/notes", function (req, res) {
  fs.readFile(jsonPath, "utf-8", (err, data) => {
    res.type("application/json").send(data);
  });
});

app.delete("/api/notes/:id", (req, res) => {
  const deleteNote = req.params.id;
  fs.readFile(jsonPath, "utf-8", (err, data) => {
    const allNotes = JSON.parse(data);
    const newNotes = allNotes.filter((note) => note.id !== deleteNote);

    // Write all notes back to db.json
    fs.writeFile(jsonPath, JSON.stringify(newNotes), () => {
      res.end();
    });
  });
});

app.post("/api/notes", function (req, res) {
  const newNote = {
    id: uuidv4(),
    ...req.body,
  };

  fs.readFile(jsonPath, "utf-8", (err, data) => {
    const allNotes = JSON.parse(data);

    allNotes.push(newNote);

    // Write all notes back to db.json
    fs.writeFile(jsonPath, JSON.stringify(allNotes), () => {
      res.json(newNote);
    });
  });
});

app.use(express.static("public"));

app.get("*", function (req, res) {
  res.sendFile(indexHtmlPath);
});

app.listen(process.env.PORT || 3000);
