const BasicStrategy = require('passport-http').BasicStrategy
const bcrypt = require('bcrypt')
const users = require('../models/users.js')
const { saltRounds } = require('../config.js')

const verifyPassword = (user, password) => {
  const match = bcrypt.compare(password, user.password)
  return match
}


const checkUserAndPassword = async (username, password, done) => {
  console.log('Start authentication')
  let result
  try {
    result = await users.getUserByUsername(username)
  } catch (error) {
    console.log(`Error: during authentication for user ${username}`)
    return done(error)
  }
  if (result.length) {
    const user = result[0]
    if ( await verifyPassword(user, password)) {
      console.log(`Successfully authentication user ${username}`)
      return done(null, user)
    } else {
      console.log(`Password incorrect for user ${username}`)
    }
  } else {
    console.log(`No user found with username: ${username}`)
  }
  return done(null, false)
}

const strategy = new BasicStrategy(checkUserAndPassword)

module.exports = strategy
