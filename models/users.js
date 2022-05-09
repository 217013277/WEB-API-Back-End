const db = require('../helper/postgresDB.js')

/**
  *getUserAll
  *returns json
  */
exports.getUserAll = async () => {
  const query = 'SELECT * FROM users'
  const data = await db.run_query(query)
  return data
}

/**
  *getUserByID
  *@param id
  *returns json
  */
exports.getUserByID = async (id) => {
  const userId = [id]
  const query = 'SELECT * FROM users WHERE id = ?'
  const data = await db.run_query(query, userId)
  return data
}

/**
  *getUserByUsername
  *@param username
  *returns json
  */
exports.getUserByUsername = async (username) => {
  const values = [username]
  const query = 'SELECT * FROM users WHERE username = ?'
  const data = await db.run_query(query, values)
  return data
}

/**
  *createUser
  *returns json
  */
exports.createUser = async (body) => {
  let keys = Object.keys(body)
  keys = keys.join(',')
  const values = Object.values(body)
  let parm = ''
  for (let i = 0; i < values.length; i++) parm += '?,'
  parm = parm.slice(0, -1)
  const query = `INSERT INTO users (${keys}) VALUES (${parm}) RETURNING *`
  const data = await db.run_query(query, values)
  return data
}

/**
  *updateUser
  *@param id, body
  *returns json
  */
exports.updateUser = async (id, body) => {
  const valueId = [id]
  let keys = Object.keys(body)
  keys = keys.join(' = ?,')
  const values = Object.values(body)
  const query = `UPDATE users SET ${keys} = ? WHERE id = ${valueId} RETURNING *`
  const data = await db.run_query(query, values)
  return data
}

exports.login = async(body) => {
  const username = body.username
  const password = body.password
  const query = `SELECT username AND role FROM users WHERE username = '${username}' AND password = '${password}'`
  return await db.run_query(query)
}

/**
  *deleteUser
  *@param id, userDetails
  *returns json
  */
exports.deleteUser = async (id) => {
  const valueId = [id]
  const query = `Delete from users WHERE id = ${valueId}`
  try {
    return await db.run_query(query)
  } catch (error) {
    return error
  }
}
