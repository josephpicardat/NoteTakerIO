const router = require('express').Router();
const store = require('../db/store');

// sends data from notes as a .json file that index.js reads to display data
router.get('/notes', (req, res) => {
    store
        .getNotes('/notes', (req, res) => {})
        .then((notes) => {
            return res.json(notes);
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});

// takes data from html and then saves it with title, text, and custom id ot be then written back on the db.json file
router.post('/notes', (req, res) => {
    store
        .addNote(req.body)
        .then((note) => res.json(note))
        .catch((err) => {
            res.status(500).json(err);
        });
});

// deletes the note with an id equal to req.params.id
router.delete('/notes/:id', (req, res) => {
    store
        .removeNote(req.params.id)
        .then(() => res.json({ ok: true }))
        .catch((err) => res.status(500).json(err));
});

router.put('/notes/:id', (req, res) => {
    const { id } = req.params;
    const { title, text } = req.body;

    store
        .getNotes()
        .then((notes) => {
            // Find the note with the given id
            const noteToUpdate = notes.find((note) => note.id === id);
            if (!noteToUpdate) {
                throw new Error(`Note with id ${id} not found`);
            }

            // Update the note's title and text
            noteToUpdate.title = title;
            noteToUpdate.text = text;

            // Write the updated notes to the database
            return store.write(notes);
        })
        .then(() => res.json({ ok: true }))
        .catch((err) => res.status(500).json(err));
});

module.exports = router;
