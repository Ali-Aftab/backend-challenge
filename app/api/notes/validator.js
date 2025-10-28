const { validate, Validator } = require('app/api/common')
const { body } = validate

class NoteValidator extends Validator {
  async create(req) {
    const validations = [
      body('title').notEmpty().isLength({ min: 1, max: 50 }),
      body('message').notEmpty().isLength({ min: 1, max: 200 })
    ]
    await this.validate(req, validations, { sanitize: 'body' })
  }
}

module.exports = new NoteValidator()
