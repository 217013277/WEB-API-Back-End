const {Validator, ValidationError} = require('jsonschema')
const dogSchema = require('../schemas/dogs.schema.js')
const userSchema = require('../schemas/users.schema.js')

const v = new Validator()

exports.dogValidation = async (ctx, next) => {
  console.log('Start validating dog details')
  const validationOptions = {
    throwError: true,
    allowUnknowonAttributes: false
  }
  const body = ctx.request.body
  try {
    v.validate(body, dogSchema, validationOptions)
    console.log('Validate dog details successfully')
    await next()
  } catch(error) {

    if(error instanceof ValidationError) {
      ctx.body = error
      ctx.status = 400
      console.log('Fail to validate dog details')
    } else {
      throw error
    }
  }
}

exports.userValidation = async (ctx, next) => {
  console.log('Start validating user details')
  const validationOptions = {
    throwError: true,
    allowUnknowonAttributes: false
  }
  const body = ctx.request.body
  try {
    v.validate(body, dogSchema, validationOptions)
    console.log('Validate dog user successfully')
    await next()
  } catch(error) {

    if(error instanceof ValidationError) {
      ctx.body = error
      ctx.status = 400
      console.log('Fail to validate user details')
    } else {
      throw error
    }
  }
}