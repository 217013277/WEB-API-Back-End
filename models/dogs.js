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
  const valueId = [id]
  const query = 'SELECT * FROM dogs WHERE id = ?'
  let data = await db.run_query(query, valueId)
  return data
}

/**
  *getDogByName
  *@param username
  *returns json
  */
exports.getDogByName = async (name) => {
  const valuesName = [name]
  const query = 'SELECT * FROM dogs WHERE name = ?'
  const data = await db.run_query(query, valuesName)
  return data
}

/**
  *createDog
  *returns json
  */
exports.createDog = async (body) => {
  let keys = Object.keys(body)
  keys = keys.join(',')
  const values = Object.values(body)
  let parm = ''
  for (let i = 0; i < values.length; i++) parm += '?,'
  parm = parm.slice(0, -1)
  const query = `INSERT INTO dogs (${keys}) VALUES (${parm}) RETURNING *`
  const data = await db.run_query(query, values)
  return data
}

/**
  *updateDog
  *@param id, body
  *returns json
  */
exports.updateDog = async (id, body) => {
  const valueId = [id]
  let keys = Object.keys(body)
  keys = keys.join(' = ?,')
  const values = Object.values(body)
  const query = `UPDATE dogs SET ${keys} = ? WHERE id = ${valueId} RETURNING *`
  const data = await db.run_query(query, values)
  return data
}

/**
  *deleteUser
  *@param id, userDetails
  *returns promise
  */
exports.deleteDog = async (id) => {
  const valueId = [id]
  const query = `DELETE FROM dogs WHERE id = ${valueId}`
  try {
    await db.run_query(query)
    return { status: 202 }
  } catch (error) {
    return error
  }
}
