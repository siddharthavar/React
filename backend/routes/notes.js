const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');
//route: 1  featching notes with
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  const notes = await Notes.find({ userId: req.userId });
  res.json(notes);
});

//route: 2 Adding notes notes with
router.post(
  "/addnotes",
  fetchuser,
  [
    body("title", "enter a valid title").isLength({ min: 3 }),
    body("description", "enter a valid description").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
      }
      const notes = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const save = await notes.save();
      res.json(notes);
    } catch (error) {
      console.log("Error at creating the user", error);
      res.status(500).json("Internal Error");
    }
  }
);
// ROUTE 3: Update an existing Note using: PUT "/api/notes/updatenote". Login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        // Create a newNote object
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        // Find the note to be updated and update it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }
console.log(req.user.id + ' is trying to update ' + note.user);
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})
// ROUTE 4: Delete an existing Note using: DELETE "/api/notes/deletenote". Login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        // Find the note to be delete and delete it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        // Allow deletion only if user owns this Note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note has been deleted", note: note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router;
