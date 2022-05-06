const model = require('../models/workers.js')

checkWorkerId = async (ctx, next) => {
  let workerId = ctx.request.body.workerid
  result = await model.getWorkerId(workerId)
  if(!result.length) {
    ctx.status = 403
    ctx.body = {message: `Cannot find Worker ID: ${workerId}`}
  } else {
    await next()
  }
}

module.exports = checkWorkerId