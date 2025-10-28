let should
let agent
let mockData

before(() => {
  should = require('should')
  agent = require('test/lib/agent')
  mockData = require('test/lib/mock-data')
})

describe('api', () => {
  describe('user', () => {
    describe('update-user', () => {
      let userOne, userTwo
      const firstNameUpdate = 'Update Name'

      before(async () => {
        userOne = await mockData.mockAuthAndUser()
        userTwo = await mockData.mockAuthAndUser()
      })

      it('should update the users first name properly', async () => {
        const outdatedUser = await agent
          .client()
          .get(`/user/${userOne.user}`)
          .set('authorization', userOne.token)
          .expect(200)
          .promise()

        await agent
          .client()
          .put(`/user/${userOne.user}`)
          .set('authorization', userOne.token)
          .send({ firstName: firstNameUpdate })
          .expect(200)
          .promise()

        const updatedUser = await agent
          .client()
          .get(`/user/${userOne.user}`)
          .set('authorization', userOne.token)
          .expect(200)
          .promise()

        should.exist(outdatedUser)
        should.exist(updatedUser)
        outdatedUser.firstName.should.not.equal(updatedUser.firstName)
        updatedUser.firstName.should.equal(firstNameUpdate)
      })

      it('should keep same user id after updating the user', async () => {
        const outdatedUser = await agent
          .client()
          .get(`/user/${userOne.user}`)
          .set('authorization', userOne.token)
          .expect(200)
          .promise()

        await agent
          .client()
          .put(`/user/${userOne.user}`)
          .set('authorization', userOne.token)
          .send({ firstName: firstNameUpdate })
          .expect(200)
          .promise()

        const updatedUser = await agent
          .client()
          .get(`/user/${userOne.user}`)
          .set('authorization', userOne.token)
          .expect(200)
          .promise()

        should.exist(outdatedUser)
        should.exist(updatedUser)
        updatedUser.firstName.should.equal(firstNameUpdate)
        outdatedUser.id.should.equal(updatedUser.id)
      })

      it('should not allow user to update another users account', async () => {
        await agent
          .client()
          .put(`/user/${userTwo.user}`)
          .set('authorization', userOne.token)
          .send({ firstName: 'updated Name' })
          .expect(403)
          .promise()
      })
    })
  })
})
