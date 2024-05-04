const util = require('util');
const fs = require('fs');

// Generates unique ids
const { v1: uuidv1 } = require('uuid');

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

class Store {
    // Reads db/db.json file
    read() {
        return readFileAsync('db/db.json', 'utf8');
    }

    // Writes to db/db.json file
    write(note) {
        return writeFileAsync('db/db.json', JSON.stringify(note));
    }

    // Gets all notes from db/db.json file
    getNotes() {
        return this.read().then((notes) => {
            let parsedNotes;

            // If notes isn't an array or can't be turned into one, send back a new empty array
            try {
                parsedNotes = [].concat(JSON.parse(notes));
            } catch (err) {
                parsedNotes = [];
            }

            return parsedNotes;
        });
    }

    // Adds a note to db/db.json file
    addNote(note) {
        const { title, text } = note;

        if (!title || !text) {
            throw new Error("Note 'title' and 'text' cannot be blank");
        }

        // Add a unique id to the note using uuid package
        const newNote = { title, text, id: uuidv1() };

        // Get all notes, add the new note, write all the updated notes, return the newNote
        return this.getNotes()
            .then((notes) => [...notes, newNote])
            .then((updatedNotes) => this.write(updatedNotes))
            .then(() => newNote);
    }

    // Removes a note from db/db.json file
    removeNote(id) {
        // Get all notes, remove the note with the given id, write the filtered notes
        return this.getNotes()
            .then((notes) => notes.filter((note) => note.id !== id))
            .then((filteredNotes) => this.write(filteredNotes));
    }

    // Updates a note in db/db.json file
    updateNote(id, updates) {
        // Get all notes, find the note with the given id, update its properties,
        // write the updated notes to the file, and return the updated note
        return this.getNotes().then((notes) => {
            const index = notes.findIndex((note) => note.id === id);
            if (index === -1) {
                throw new Error(`Note with id ${id} not found`);
            }
            const updatedNote = { ...notes[index], ...updates };
            const updatedNotes = [
                ...notes.slice(0, index),
                updatedNote,
                ...notes.slice(index + 1),
            ];
            return this.write(updatedNotes).then(() => updatedNote);
        });
    }
}

module.exports = new Store();
