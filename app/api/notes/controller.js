const notesService = require('app/modules/notes')

/**
 * Create a new note
 *
 * @method create
 */
exports.create = async (req, res) => {
  const note = await notesService.create({
    userId: req.userId,
    title: req.body.title,
    message: req.body.message
  })
  res.status(201).send(note)
}

/**
 * Find all notes related to current user
 *
 * @method find
 */
exports.find = async (req, res) => {
  const notes = await notesService.find({ userId: req.userId })
  res.status(200).send(notes)
}
