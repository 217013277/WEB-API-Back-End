const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')

const model = require('../models/workers.js')
const auth = require('../controllers/auth.js')
const can = require('../permissions/workers.js')
const checkWorkerId = require('../tools/checkWorkerId.js')

const router = Router({ prefix: '/api/v1/workers' })

const getWorkerAll = async (ctx) => {
  const permission = can.readWorkerAll(ctx.state.user)
  if (!permission.granted) {
    ctx.status = 403
  } else {
    const result = await model.getWorkerAll()
    if (result.length) {
      ctx.body = result
    }
  }
}

const getWorkerById = async (ctx) => {
  const id = ctx.params.id
  const permission = can.readWorker(ctx.state.user, parseInt(id))
  if (!permission.granted) {
    ctx.status = 403
  } else {
    const result = await model.getWorkerByID(id)
    if (result.length) {
      ctx.body = result
    }
  }
}

const createWorker = async (ctx) => {
  const body = ctx.request.body
  const result = await model.createWorker(body)
  if (result.length) {
    ctx.body = result
  }
}

const updateWorker = async (ctx) => {
  const id = ctx.params.id
  const permission = can.updateWorker(ctx.state.user, parseInt(id))
  if (!permission.granted) {
    ctx.status = 403
  } else {
    const body = ctx.request.body
    const result = await model.updateWorker(id, body)
    if (result.length) {
      ctx.body = result
    }
  }
}

router.get('/', auth, getWorkerAll)
router.get('/:id([0-9]{1,})', auth, getWorkerById)
router.post('/', bodyParser(), checkWorkerId, createWorker)
router.put('/:id([0-9]{1,})', bodyParser(), auth, updateWorker)

module.exports = router
