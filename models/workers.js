const db = require('../helper/postgresDB.js')

exports.getWorkerId = async (workerId) => {
  const valueId = [workerId]
  const query = 'SELECT * FROM workers WHERE workerid = ?'
  const data = await db.run_query(query, valueId)
  return data
}

/**
  *getUserAll
  *returns json
  */
exports.getWorkerAll = async () => {
  const role = ['worker']
  const query = 'SELECT * FROM users where role = ?'
  const data = await db.run_query(query, role)
  return data
}

/**
  *getUserByID
  *@param id
  *returns json
  */
exports.getWorkerByID = async (id) => {
  const valueId = [id]
  const query = 'SELECT * FROM users WHERE id = ?'
  return await db.run_query(query, valueId)
}

/**
  *createUser
  *returns json
  */
exports.createWorker = async (body) => {
  body.role = "worker"
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
exports.updateWorker = async (id, body) => {
  const valueId = [id]
  let keys = Object.keys(body)
  keys = keys.join(' = ?,')
  const values = Object.values(body)
  const query = `UPDATE users SET ${keys} = ? WHERE id = ${valueId} RETURNING *`
  const data = await db.run_query(query, values)
  return data
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
    await db.run_query(query)
    return { status: 200 }
  } catch (error) {
    return error
  }
}
