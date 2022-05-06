const db = require('../helper/postgresDB.js')

/**
  *getDogsAll
  *returns json
  */
exports.getDogAll = async () => {
  const query = 'SELECT * FROM dogs'
  const data = await db.run_query(query)
  return data
}

/**
  *getDogByID
  *@param id
  *returns json
  */
exports.getDogByID = async (id) => {
  const userId = [id]
  const query = 'SELECT * FROM dogs WHERE id = ?'
  let data = await db.run_query(query, userId)
  return data
}

/**
  *getDogByName
  *@param username
  *returns json
  */
exports.getDogByName = async (name) => {
  const values = [name]
  const query = 'SELECT * FROM dogs WHERE name = ?'
  const data = await db.run_query(query, values)
  return data
}

/**
  *createDog
  *returns json
  */
exports.createDog = async (userDetails) => {
  let keys = Object.keys(userDetails)
  keys = keys.join(',')
  const values = Object.values(userDetails)
  let parm = ''
  for (let i = 0; i < values.length; i++) parm += '?,'
  parm = parm.slice(0, -1)
  const query = `INSERT INTO dogs (${keys}) VALUES (${parm}) RETURNING *`
  const data = await db.run_query(query, values)
  return data
}

/**
  *updateDog
  *@param id, dogDetails
  *returns json
  */
exports.updateDog = async (id, dogDetails) => {
  const dogId = [id]
  let keys = Object.keys(dogDetails)
  keys = keys.join(' = ?,')
  const values = Object.values(dogDetails)
  const query = `UPDATE dogs SET ${keys} = ? WHERE id = ${dogId} RETURNING *`
  const data = await db.run_query(query, values)
  return data
}

/**
  *deleteUser
  *@param id, userDetails
  *returns promise
  */
exports.deleteDog = async (id) => {
  const dogId = [id]
  const query = `DELETE FROM dogs WHERE id = ${dogId}`
  try {
    await db.run_query(query)
    return { status: 202 }
  } catch (error) {
    return error
  }
}
