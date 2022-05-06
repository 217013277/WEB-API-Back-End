const request = require('supertest')
const app = require('./app.test.js')

const expected = {
  "id":1,
  "name":"Lucky",
  "description":"A good dog",
  "birthday":"2018-04-30",
  "datecreated":"2022-04-28T06:03:40.334Z",
  "datemodified":"2022-04-28T06:03:40.334Z",
  "imageurl":null,
  "published":null,
  "authorid":null,
  "breed":"Poodle"
}

jest.setTimeout(30000)

describe('Get all dogs information', () => {
  it('Return all dogs', async () => {
    const res = await request(app.callback())
      .get('/api/v1/dogs')
      .send({})
    expect(res.statusCode).toEqual(200)
    expect(res.type).toEqual("application/json")
    expect(res.body).toContainEqual(expected)
  })
})
