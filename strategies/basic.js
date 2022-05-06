const BasicStrategy = require('passport-http').BasicStrategy
const users = require('../models/users.js')

const verifyPassword = (user, password) => {
  return user.password === password
}

const checkUserAndPassword = async (username, password, done) => {
  console.log('Start Auth')
  let result
  try {
    result = await users.getUserByUsername(username)
  } catch (error) {
    console.log(`Error: during authentication for user ${username}`)
    return done(error)
  }
  if (result.length) {
    const user = result[0]
    if (verifyPassword(user, password)) {
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
