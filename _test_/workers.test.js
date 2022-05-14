const request = require('supertest')
const app = require('./app.test.js')

// command 'jest workers.test.js' in shell to run test

let id = 0

const admin = { username: "alice", password: "qwert123" }
const user = { username: "bob", password: "qwert123" }
const worker = { username: "yuyu", password: "123123" }
const wrongLogin = { username: "wrong123123", password: "wrong-pwdasd" }
const newUser = { username: "newworker", password: "123123" }
const editUser = { username: "editworker", password: "234234" }


const getExpected = {
  "id": 4,
  "firstname": "yuyu",
  "lastname": "yuyu",
  "username": "yuyu",
  "about": "password: 123123",
  "dateregistered": "2022-04-22T08:41:26.785Z",
  "password": "$2b$10$jcjIWpt7G//S2QezKsW7/u7LRcbU.VWiUYPcQ9W5TRGXDKJKAxbfi",
  "passwordsalt": null,
  "email": "yuyu@123.com",
  "avatarurl": null,
  "role": "worker",
  "workerid": 123
}

const wrongPostData = {
  "email": "test@123.com",
  "password": newUser.password,
  "firstname": "test",
  "lastname": "123",
  "username": newUser.username,
  "workerid": 123,
  "wrongkey": 123123123123
}

const wrongWorkeridPostData = {
  "email": "test@123.com",
  "password": newUser.password,
  "firstname": "test",
  "lastname": "123",
  "username": newUser.username,
  "workerid": 0
}

const postData = {
  "email": "test@123.com",
  "password": newUser.password,
  "firstname": "test",
  "lastname": "123",
  "username": newUser.username,
  "workerid": 123
}

const postExpected = {
  "firstname": "test",
  "lastname": "123",
  "username": newUser.username,
  "about": null,
  "email": "test@123.com",
  "avatarurl": null,
  "role": "worker",
  "workerid": 123
}

const wrongPutData = {
  "email": "edit@123.com",
  "password": editUser.password,
  "firstname": "edited",
  "lastname": "234",
  "username": editUser.username,
  "about": "edit about",
  "workerid": 123,
  "wrongkey": 1384183481
}

const putData = {
  "email": "edit@123.com",
  "password": editUser.password,
  "firstname": "edited",
  "lastname": "234",
  "username": editUser.username,
  "about": "edit about",
  "workerid": 123
}

const putExpected = {
  "firstname": "edited",
  "lastname": "234",
  "username": editUser.username,
  "about": "edit about",
  "email": "edit@123.com",
  "avatarurl": null,
  "role": "worker",
  "workerid": 123
}

jest.setTimeout(300000)

describe('Get all worker information', () => {
  it('Return all workers', async () => {
    const res = await request(app.callback())
      .get('/api/v1/workers')
      .auth(admin.username, admin.password)
      .send({})
    expect(res.statusCode).toEqual(200)
    expect(res.type).toEqual('application/json')
    expect(res.body).toContainEqual(getExpected)
  })
})

describe('Get all worker information with wrong login', () => {
  it('Return status 401', async () => {
    const res = await request(app.callback())
      .get('/api/v1/workers')
      .auth(wrongLogin.username, wrongLogin.password)
      .send({})
    expect(res.statusCode).toEqual(401)
  })
})

describe('Get all worker information with wrong role', () => {
  it('Return status 403', async () => {
    const res = await request(app.callback())
      .get('/api/v1/workers')
      .auth(user.username, user.password)
    expect(res.statusCode).toEqual(403)
  })
})

describe('Get worker id 4 information', () => {
  it('Return dog id 4 information', async () => {
    const res = await request(app.callback())
      .get('/api/v1/workers/4')
      .auth(worker.username, worker.password)
    expect(res.statusCode).toEqual(200)
    expect(res.type).toEqual('application/json')
    expect(res.body).toEqual(getExpected)
  })
})

describe('Get worker id 4 information with wrong login', () => {
  it('Return status 401', async () => {
    const res = await request(app.callback())
      .get('/api/v1/workers/4')
      .auth(wrongLogin.username, wrongLogin.password)
    expect(res.statusCode).toEqual(401)
  })
})

describe('Get worker id 4 information with no permission', () => {
  it('Return status 403', async () => {
    const res = await request(app.callback())
      .get('/api/v1/workers/4')
      .auth(user.username, user.password)
    expect(res.statusCode).toEqual(403)
  })
})

describe('Get worker id unknown information', () => {
  it('Return status 404', async () => {
    const res = await request(app.callback())
      .get('/api/v1/workers/0')
      .auth(admin.username, admin.password)
      .send({})
    expect(res.statusCode).toEqual(404)
  })
})

describe('Post a new worker with wrong schema', () => {
  it('Return status 400', async () => {
    const res = await request(app.callback())
      .post('/api/v1/workers/')
      .send(wrongPostData)
    expect(res.statusCode).toEqual(400)
  })
})

describe('Post a new worker with wrong workerid', () => {
  it('Return status 403', async () => {
    const res = await request(app.callback())
      .post('/api/v1/workers/')
      .send(wrongWorkeridPostData)
    expect(res.statusCode).toEqual(403)
  })
})

describe('Post a new worker', () => {
  it('Return new worker information', async () => {
    const res = await request(app.callback())
      .post('/api/v1/workers/')
      .send(postData)
    expect(res.statusCode).toEqual(201)
    expect(res.type).toEqual('application/json')
    expect(res.body).toMatchObject(postExpected)
    id = res.body.id
  })
})

describe('Update a worker information with wrong schema', () => {
  it('Return status 400', async () => {
    const res = await request(app.callback())
      .put(`/api/v1/workers/${id}`)
      .auth(newUser.username, newUser.password)
      .send(wrongPutData)
    expect(res.statusCode).toEqual(400)
  })
})

describe('Update a worker with wrong login', () => {
  it('Return status 401', async () => {
    const res = await request(app.callback())
      .put(`/api/v1/workers/${id}`)
      .auth(wrongLogin.username, wrongLogin.password)
      .send(putData)
    expect(res.statusCode).toEqual(401)
  })
})

describe('Update a worker with no permission', () => {
  it('Return status 403', async () => {
    const res = await request(app.callback())
      .put(`/api/v1/workers/${id}`)
      .auth(user.username, user.password)
      .send(putData)
    expect(res.statusCode).toEqual(403)
  })
})

describe('Update a worker which is not exist', () => {
  it('Return status 404', async () => {
    const res = await request(app.callback())
      .put(`/api/v1/workers/0`)
      .auth(admin.username, admin.password)
      .send(putData)
    expect(res.statusCode).toEqual(404)
  })
})

describe('Update a worker Successfully', () => {
  it('Return edited worker information', async () => {
    const res = await request(app.callback())
      .put(`/api/v1/workers/${id}`)
      .auth(newUser.username, newUser.password)
      .send(putData)
    expect(res.statusCode).toEqual(200)
    expect(res.type).toEqual('application/json')
    expect(res.body).toMatchObject(putExpected)
  })
})

describe('Delete a worker with wrong login', () => {
  it('Return status 401', async () => {
    const res = await request(app.callback())
      .delete(`/api/v1/workers/${id}`)
      .auth(wrongLogin.username, wrongLogin.password)
    expect(res.statusCode).toEqual(401)
  })
})

describe('Delete a worker with no permission', () => {
  it('Return status 403', async () => {
    const res = await request(app.callback())
      .delete(`/api/v1/workers/${id}`)
      .auth(editUser.username, editUser.password)
    expect(res.statusCode).toEqual(403)
  })
})

describe('Delete a worker which is not exist', () => {
  it('Return status 404', async () => {
    const res = await request(app.callback())
      .delete(`/api/v1/workers/0`)
      .auth(admin.username, admin.password)
    expect(res.statusCode).toEqual(404)
  })
})

describe('Delete a worker successfully', () => {
  it('Return status 204', async () => {
    const res = await request(app.callback())
      .delete(`/api/v1/workers/${id}`)
      .auth(admin.username, admin.password)
    expect(res.statusCode).toEqual(204)
  })
})
