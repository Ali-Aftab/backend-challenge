let should
let agent
let mockData

before(() => {
  should = require('should')
  agent = require('test/lib/agent')
  mockData = require('test/lib/mock-data')
})

describe('api', () => {
  describe('notes', () => {
    describe('create-notes', () => {
      let userOne
      const title = 'Title'
      const message = 'Message'

      before(async () => {
        userOne = await mockData.mockAuthAndUser()
      })

      it('should not create note without authorization', async () => {
        await agent.client().post('/note').send({ title, message }).expect(401).promise()
      })

      it('should create note with authorization', async () => {
        const note = {
          title,
          message
        }

        const createdNote = await agent
          .client()
          .post('/note')
          .set('authorization', userOne.token)
          .send(note)
          .expect(201)
          .promise()

        should.exist(createdNote)
        createdNote.title.should.equal(note.title)
        createdNote.message.should.equal(note.message)
        createdNote.userId.should.equal(userOne.user)
      })

      it('should not create note without title', async () => {
        await agent.client().post('/note').set('authorization', userOne.token).send({ message }).expect(422).promise()
      })

      it('should not create note without message', async () => {
        await agent.client().post('/note').set('authorization', userOne.token).send({ title }).expect(422).promise()
      })
    })
  })
})
