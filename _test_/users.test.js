const request = require('supertest')
const app = require('./app.test.js')

// command 'jest users.test.js' in shell to run test

let id = 0

const admin = { username: "alice", password: "qwert123" }
const user = { username: "bob", password: "qwert123" }
const anotherUser = { username: "colin", password: "123123" }
const worker = { username: "yuyu", password: "123123" }
const wrongLogin = { username: "wrong123123", password: "wrong-pwdasd" }
const newUser = { username: "newuser", password: "123123" }
const editUser = { username: "edituser", password: "234234" }


const getExpected = {
  "id": 2,
  "firstname": "bob",
  "lastname": "bob",
  "username": "bob",
  "about": "password: qwert123",
  "dateregistered": "2022-03-21T15:18:26.438Z",
  "password": "$2b$10$w.zRxKSbI7hLcqXl30wOA.9MZqVJhb5mgwVf33fJmvzkGr65wcrdq",
  "passwordsalt": null,
  "email": "bob@123.com",
  "avatarurl": null,
  "role": "user",
  "workerid": null
}

const wrongPostData = {
  "email": "test@123.com",
  "password": newUser.password,
  "firstname": "test",
  "lastname": "123",
  "username": newUser.username,
  "wrongkey": 123123123123
}

const wrongWorkeridPostData = {
  "email": "test@123.com",
  "password": newUser.password,
  "firstname": "test",
  "lastname": "123",
  "username": newUser.username,

}

const postData = {
  "email": "test@123.com",
  "password": newUser.password,
  "firstname": "test",
  "lastname": "123",
  "username": newUser.username
}

const postExpected = {
  "firstname": "test",
  "lastname": "123",
  "username": newUser.username,
  "about": null,
  "email": "test@123.com",
  "avatarurl": null,
  "role": "user",
  "workerid": null
}

const wrongPutData = {
  "email": "edit@123.com",
  "password": editUser.password,
  "firstname": "edited",
  "lastname": "234",
  "username": editUser.username,
  "about": "edit about",
  "wrongkey": 1384183481
}

const putData = {
  "email": "edit@123.com",
  "password": editUser.password,
  "firstname": "edited",
  "lastname": "234",
  "username": editUser.username,
  "about": "edit about"
}

const putExpected = {
  "firstname": "edited",
  "lastname": "234",
  "username": editUser.username,
  "about": "edit about",
  "email": "edit@123.com",
  "avatarurl": null,
  "role": "user",
  "workerid": null
}

jest.setTimeout(300000)

describe('Get all users', () => {
  it('Return all workers', async () => {
    const res = await request(app.callback())
      .get('/api/v1/users')
      .auth(admin.username, admin.password)
    expect(res.statusCode).toEqual(200)
    expect(res.type).toEqual('application/json')
    expect(res.body).toContainEqual(getExpected)
  })
})

describe('Get all users with wrong login', () => {
  it('Return status 401', async () => {
    const res = await request(app.callback())
      .get('/api/v1/users')
      .auth(wrongLogin.username, wrongLogin.password)
    expect(res.statusCode).toEqual(401)
  })
})

describe('Get all users with wrong role', () => {
  it('Return status 403', async () => {
    const res = await request(app.callback())
      .get('/api/v1/users')
      .auth(user.username, user.password)
    expect(res.statusCode).toEqual(403)
  })
})

describe('Get user id 2', () => {
  it('Return user id 4 information', async () => {
    const res = await request(app.callback())
      .get('/api/v1/users/2')
      .auth(user.username, user.password)
    expect(res.statusCode).toEqual(200)
    expect(res.type).toEqual('application/json')
    expect(res.body).toEqual(getExpected)
  })
})

describe('Get user id 2 with wrong login', () => {
  it('Return status 401', async () => {
    const res = await request(app.callback())
      .get('/api/v1/users/2')
      .auth(wrongLogin.username, wrongLogin.password)
    expect(res.statusCode).toEqual(401)
  })
})

describe('Get user id 4 with no permission', () => {
  it('Return status 403', async () => {
    const res = await request(app.callback())
      .get('/api/v1/users/2')
      .auth(anotherUser.username, anotherUser.password)
    expect(res.statusCode).toEqual(403)
  })
})

describe('Get user id which is not existed', () => {
  it('Return status 404', async () => {
    const res = await request(app.callback())
      .get('/api/v1/users/0')
      .auth(admin.username, admin.password)
    expect(res.statusCode).toEqual(404)
  })
})

describe('Post a new user with wrong schema', () => {
  it('Return status 400', async () => {
    const res = await request(app.callback())
      .post('/api/v1/users/')
      .send(wrongPostData)
    expect(res.statusCode).toEqual(400)
  })
})

describe('Post a new user', () => {
  it('Return new user information', async () => {
    const res = await request(app.callback())
      .post('/api/v1/users/')
      .send(postData)
    expect(res.statusCode).toEqual(201)
    expect(res.type).toEqual('application/json')
    expect(res.body).toMatchObject(postExpected)
    id = res.body.id
  })
})

describe('Update a user with wrong schema', () => {
  it('Return status 400', async () => {
    const res = await request(app.callback())
      .put(`/api/v1/users/${id}`)
      .auth(newUser.username, newUser.password)
      .send(wrongPutData)
    expect(res.statusCode).toEqual(400)
  })
})

describe('Update a user with wrong login', () => {
  it('Return status 401', async () => {
    const res = await request(app.callback())
      .put(`/api/v1/users/${id}`)
      .auth(wrongLogin.username, wrongLogin.password)
      .send(putData)
    expect(res.statusCode).toEqual(401)
  })
})

describe('Update a user with no permission', () => {
  it('Return status 403', async () => {
    const res = await request(app.callback())
      .put(`/api/v1/users/${id}`)
      .auth(user.username, user.password)
      .send(putData)
    expect(res.statusCode).toEqual(403)
  })
})

describe('Update a user which is not existed', () => {
  it('Return status 404', async () => {
    const res = await request(app.callback())
      .put(`/api/v1/user/0`)
      .auth(admin.username, admin.password)
      .send(putData)
    expect(res.statusCode).toEqual(404)
  })
})

describe('Update a user Successfully', () => {
  it('Return edited worker information', async () => {
    const res = await request(app.callback())
      .put(`/api/v1/users/${id}`)
      .auth(newUser.username, newUser.password)
      .send(putData)
    expect(res.statusCode).toEqual(200)
    expect(res.type).toEqual('application/json')
    expect(res.body).toMatchObject(putExpected)
  })
})

describe('Delete a user with wrong login', () => {
  it('Return status 401', async () => {
    const res = await request(app.callback())
      .delete(`/api/v1/users/${id}`)
      .auth(wrongLogin.username, wrongLogin.password)
    expect(res.statusCode).toEqual(401)
  })
})

describe('Delete a worker with no permission', () => {
  it('Return status 403', async () => {
    const res = await request(app.callback())
      .delete(`/api/v1/users/${id}`)
      .auth(editUser.username, editUser.password)
    expect(res.statusCode).toEqual(403)
  })
})

describe('Delete a user which is not exist', () => {
  it('Return status 404', async () => {
    const res = await request(app.callback())
      .delete(`/api/v1/users/0`)
      .auth(admin.username, admin.password)
    expect(res.statusCode).toEqual(404)
  })
})

describe('Delete a user successfully', () => {
  it('Return status 204', async () => {
    const res = await request(app.callback())
      .delete(`/api/v1/users/${id}`)
      .auth(admin.username, admin.password)
    expect(res.statusCode).toEqual(204)
  })
})
