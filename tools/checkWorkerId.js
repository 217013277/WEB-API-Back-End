const model = require('../models/workers.js')

const checkWorkerId = async (ctx, next) => {
  const workerId = ctx.request.body.workerid
  const result = await model.getWorkerId(workerId)
  if (!result.length) {
    console.log(result)
    ctx.status = 403
    ctx.body = { message: `Cannot find Worker ID: ${workerId}` }
    return
  } else {
    await next()
  }
}

module.exports = checkWorkerId
