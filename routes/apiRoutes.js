const router = require('express').Router();
let notes = require('../db/db.json');
const fs = require('fs');
const path = require('path');
const { uid } = require('uid');

// sends data from notes as a .json file that index.js reads to display data
router.get('/notes', (req, res) => {
  res.json(notes);
});

// takes data from html and then saves it with title, text, and custom id ot be then written back on the db.json file
router.post('/notes', (req, res) => {
  let saveNote = {
    title: req.body.title,
    text: req.body.text,
    id: uid(),
  };

  // adds the new file to notes and rewrites the file back to db.json. Using fs.writeFile gets rid of the file there and replaces it with another so we have to add data to the notes array and then rewrite it.
  notes.push(saveNote);
  fs.writeFile(
    path.join(__dirname, '../db', 'db.json'),
    JSON.stringify(notes),
    err => {
      if (err) {
        console.log(err);
      }
      res.json(notes);
    },
  );
});

module.exports = router;
