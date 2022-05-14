exports.myElephentDBConfig = {
  host: 'john.db.elephantsql.com',
  port: 5432,
  user: 'ndapwwhx',
  password: 'DprTEP28tiWlCWgSNDzuVYr-4ol3Vn7X',
  database: 'ndapwwhx',
  connection_limit: 100
}

exports.saltRounds = 10

exports.login = {
  admin: { username: "alice", password: "qwert123" },
  user: { username: "bob", password: "qwert123" },
  anotherUser: { username: "colin", password: "123123" },
  worker: { username: "yuyu", password: "123123" },
  wrongLogin: { username: "wrong123123", password: "wrong-pwdasd" },
  newUser: { username: "newuser", password: "123123" },
  editUser: { username: "edituser", password: "234234" }
}