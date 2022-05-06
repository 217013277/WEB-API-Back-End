const model = require('../models/users.js')

const checkUserExist = async (ctx, next) => {
  const result = await model.getUserByID(ctx.request.body.workerid)
  if (!result.length) {
    ctx.throw(403, `Cannot find Worker ID: ${body.workerid}`)
  } else {
    await next()
  }
}

module.exports = checkUserExist
