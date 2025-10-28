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
