const request = require('supertest')
const app = require('./app.test.js')
const { login } = require('../config.js')

// command 'jest dogs.test.js' in shell to run test

let id = 0

const getExpected = {
  id: 1,
  name: 'Lucky',
  description: 'A good dog',
  birthday: '2018-04-30',
  datecreated: '2022-04-28T06:03:40.334Z',
  datemodified: '2022-04-28T06:03:40.334Z',
  imageurl: null,
  published: null,
  authorid: null,
  breed: 'Poodle'
}

const postData = {
  name: 'Wow Wow',
  description: 'Wow Wow Wow',
  birthday: '2018-04-30',
  breed: 'Poodle',
  published: false
}

const wrongPostData = {
  name: 'Wow Wow',
  description: 'Wow Wow Wow',
  birthday: '2018-04-30',
  breed: 123
}

const postExpected = {
  name: 'Wow Wow',
  description: 'Wow Wow Wow',
  birthday: '2018-04-30',
  imageurl: null,
  published: false,
  authorid: null,
  breed: 'Poodle'
}

const putData = {
  name: 'Nom Nom',
  description: 'Nom Nom Nom Nom',
  birthday: '2019-05-01',
  breed: 'breed'
}

const wrongPutData = {
  name: 'Nom Nom',
  description: 'Nom Nom Nom Nom',
  birthday: null,
  breed: 'breed'
}

const putExpected = {
  name: 'Nom Nom',
  description: 'Nom Nom Nom Nom',
  birthday: '2019-05-01',
  imageurl: null,
  published: false,
  authorid: null,
  breed: 'breed'
}

jest.setTimeout(300000)

describe('Get all dogs information', () => {
  it('Return all dogs', async () => {
    const res = await request(app.callback())
      .get('/api/v1/dogs')
      .send({})
    expect(res.statusCode).toEqual(200)
    expect(res.type).toEqual('application/json')
    expect(res.body).toContainEqual(getExpected)
  })
})

describe('Get dog id 1 information', () => {
  it('Return dog id 1', async () => {
    const res = await request(app.callback())
      .get('/api/v1/dogs/1')
      .send({})
    expect(res.statusCode).toEqual(200)
    expect(res.type).toEqual('application/json')
    expect(res.body).toEqual(getExpected)
  })
})

describe('Get dog id 0 information', () => {
  it('Return not found status 404', async () => {
    const res = await request(app.callback())
      .get('/api/v1/dogs/0')
      .send({})
    expect(res.statusCode).toEqual(404)
  })
})

describe('Post a new dog id with wrong syntax', () => {
  it('Return status 400', async () => {
    const res = await request(app.callback())
      .post('/api/v1/dogs/')
      .auth(login.worker.username, login.worker.password)
      .send(wrongPostData)
    expect(res.statusCode).toEqual(400)
  })
})

describe('Post a new dog id with wrong password', () => {
  it('Return status 401', async () => {
    const res = await request(app.callback())
      .post('/api/v1/dogs/')
      .auth(login.wrongLogin.username, login.wrongLogin.password)
      .send(postData)
    expect(res.statusCode).toEqual(401)
  })
})

describe('Post a new dog id with no permission', () => {
  it('Return status 403', async () => {
    const res = await request(app.callback())
      .post('/api/v1/dogs/')
      .auth(login.user.username, login.user.password)
      .send(postData)
    expect(res.statusCode).toEqual(403)
  })
})

describe('Post a new dog id', () => {
  it('Return new dog information', async () => {
    const res = await request(app.callback())
      .post('/api/v1/dogs/')
      .auth(login.worker.username, login.worker.password)
      .send(postData)
    expect(res.statusCode).toEqual(201)
    expect(res.type).toEqual('application/json')
    expect(res.body).toMatchObject(postExpected)
    id = res.body.id
  })
})

describe('Update a new dog with wrong syntax', () => {
  it('Return status 400', async () => {
    const res = await request(app.callback())
      .put(`/api/v1/dogs/${id}`)
      .auth(login.worker.username, login.worker.password)
      .send(wrongPutData)
    expect(res.statusCode).toEqual(400)
  })
})

describe('Update a dog with wrong password', () => {
  it('Return status 401', async () => {
    const res = await request(app.callback())
      .put(`/api/v1/dogs/${id}`)
      .auth(login.wrongLogin.username, login.wrongLogin.password)
      .send(postData)
    expect(res.statusCode).toEqual(401)
  })
})

describe('Update a dog with no permission', () => {
  it('Return status 403', async () => {
    const res = await request(app.callback())
      .put(`/api/v1/dogs/${id}`)
      .auth(login.user.username, login.user.password)
      .send(postData)
    expect(res.statusCode).toEqual(403)
  })
})

describe('Update a dog', () => {
  it('Return edited dog information', async () => {
    const res = await request(app.callback())
      .put(`/api/v1/dogs/${id}`)
      .auth(login.worker.username, login.worker.password)
      .send(putData)
    expect(res.statusCode).toEqual(200)
    expect(res.type).toEqual('application/json')
    expect(res.body).toMatchObject(putExpected)
  })
})

describe('Delete a dog with wrong password', () => {
  it('Return status 401', async () => {
    const res = await request(app.callback())
      .delete(`/api/v1/dogs/${id}`)
      .auth(login.wrongLogin.username, login.wrongLogin.password)
    expect(res.statusCode).toEqual(401)
  })
})

describe('Delete a dog id with no permission', () => {
  it('Return status 403', async () => {
    const res = await request(app.callback())
      .delete(`/api/v1/dogs/${id}`)
      .auth(login.user.username, login.user.password)
    expect(res.statusCode).toEqual(403)
  })
})

describe('Delete a dog ', () => {
  it('Return delete successfully status code', async () => {
    const res = await request(app.callback())
      .delete(`/api/v1/dogs/${id}`)
      .auth(login.worker.username, login.worker.password)
    expect(res.statusCode).toEqual(204)
  })
})

describe('Delete a dog which is not existed', () => {
  it('Return status 404', async () => {
    const res = await request(app.callback())
      .delete(`/api/v1/dogs/${id}`)
      .auth(login.worker.username, login.worker.password)
    expect(res.statusCode).toEqual(404)
  })
})
