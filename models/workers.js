const db = require('../helper/postgresDB.js')

exports.getWorkerId = async (workerId) => {
  const id = [workerId]
  const query = 'SELECT * FROM workers WHERE workerid = ?'
  const data = await db.run_query(query, id)
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
  const userId = [id]
  const query = 'SELECT * FROM users WHERE id = ?'
  return await db.run_query(query, userId)
}

/**
  *createUser
  *returns json
  */
exports.createWorker = async (userDetails) => {
  userDetails.role = "worker"
  let keys = Object.keys(userDetails)
  keys = keys.join(',')
  const values = Object.values(userDetails)
  let parm = ''
  for (let i = 0; i < values.length; i++) parm += '?,'
  parm = parm.slice(0, -1)
  const query = `INSERT INTO users (${keys}) VALUES (${parm}) RETURNING *`
  const data = await db.run_query(query, values)
  return data
}

/**
  *updateUser
  *@param id, userDetails
  *returns json
  */
exports.updateWorker = async (id, userDetails) => {
  const workerId = [id]
  let keys = Object.keys(userDetails)
  keys = keys.join(' = ?,')
  const values = Object.values(userDetails)
  const query = `UPDATE users SET ${keys} = ? WHERE id = ${workerId} RETURNING *`
  const data = await db.run_query(query, values)
  return data
}

/**
  *deleteUser
  *@param id, userDetails
  *returns json
  */
exports.deleteUser = async (id) => {
  const workerId = [id]
  const query = `Delete from users WHERE id = ${workerId}`
  try {
    await db.run_query(query)
    return { status: 200 }
  } catch (error) {
    return error
  }
}
