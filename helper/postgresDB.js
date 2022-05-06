const { Sequelize, QueryTypes } = require('sequelize')
const info = require('../config.js')

const url = `postgres://${info.myElephentDBConfig.user}:${info.myElephentDBConfig.password}@${info.myElephentDBConfig.host}:${info.myElephentDBConfig.port}/${info.myElephentDBConfig.database}
`
/**
  * run_query
  * @param query, values
  * returns Integer
  */
exports.run_query = async (query, values = '') => {
  try {
    const sequelize = new Sequelize(url)
    await sequelize.authenticate()
    const data = await sequelize.query(query, {
      replacements: values,
      type: QueryTypes.SELECT
    })
    await sequelize.close()
    return data
  } catch (error) {
    console.error(error, query, values)
    throw new Error('Database query error')
  }
}
