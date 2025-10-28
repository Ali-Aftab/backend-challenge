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
    describe('find-notes', () => {
      let userOne, userTwo, userThree

      before(async () => {
        userOne = await mockData.mockAuthAndUser()
        userTwo = await mockData.mockAuthAndUser()
        userThree = await mockData.mockAuthAndUser()
      })

      const createNoteSuccessfully = (token, data) => {
        return agent.client().post('/note').set('authorization', token).send(data).expect(201).promise()
      }

      it('should not show notes without authorization', async () => {
        await agent.client().get(`/user/${userOne.user}/notes`).expect(401).promise()
      })

      it('should show no notes when user has not created any', async () => {
        const notes = await agent
          .client()
          .get(`/user/${userOne.user}/notes`)
          .set('authorization', userOne.token)
          .expect(200)
          .promise()

        should.exist(notes)
        notes.should.be.an.Array()
        notes.length.should.equal(0)
      })

      it('should list all notes for an authenticated user', async () => {
        const title1 = 'Title 1'
        const title2 = 'Title 2'
        const message1 = 'Message 1'
        const message2 = 'Message 2'
        await createNoteSuccessfully(userOne.token, { title: title1, message: message1 })
        await createNoteSuccessfully(userOne.token, { title: title2, message: message2 })

        const notes = await agent
          .client()
          .get(`/user/${userOne.user}/notes`)
          .set('authorization', userOne.token)
          .expect(200)
          .promise()

        should.exist(notes)
        notes.should.be.an.Array()
        notes.length.should.equal(2)
        notes[0].userId.should.equal(userOne.user)
        notes[0].title.should.equal(title1)
        notes[0].message.should.equal(message1)
        notes[1].userId.should.equal(userOne.user)
        notes[1].title.should.equal(title2)
        notes[1].message.should.equal(message2)
      })

      it('should not show notes for another user', async () => {
        await createNoteSuccessfully(userTwo.token, { title: 'Title 1', message: 'Message 1' })
        await createNoteSuccessfully(userThree.token, { title: 'Title 2', message: 'Message 2' })
        await createNoteSuccessfully(userTwo.token, { title: 'Title 3', message: 'Message 3' })

        const notesUserTwo = await agent
          .client()
          .get(`/user/${userTwo.user}/notes`)
          .set('authorization', userTwo.token)
          .expect(200)
          .promise()

        const notesUserThree = await agent
          .client()
          .get(`/user/${userThree.user}/notes`)
          .set('authorization', userThree.token)
          .expect(200)
          .promise()

        should.exist(notesUserTwo)
        should.exist(notesUserThree)
        notesUserTwo.length.should.equal(2)
        notesUserThree.length.should.equal(1)
        notesUserTwo[0].userId.should.equal(userTwo.user)
        notesUserTwo[1].userId.should.equal(userTwo.user)
        notesUserThree[0].userId.should.equal(userThree.user)
        userTwo.should.not.equal(userThree)
      })

      it('should not allow user to view another users notes', async () => {
        await agent
          .client()
          .get(`/user/${userTwo.user}/notes`)
          .set('authorization', userOne.token)
          .expect(403)
          .promise()
      })
    })
  })
})
