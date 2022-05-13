const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')

const userModel = require('../models/users.js')
const auth = require('../controllers/auth.js')
const { workerValidation } = require('../controllers/validation')
const can = require('../permissions/workers.js')
const checkWorkerId = require('../tools/checkWorkerId.js')

const router = Router({ prefix: '/api/v1/workers' })

const getWorkerAll = async (ctx) => {
  const permission = can.readWorkerAll(ctx.state.user)
  if (!permission.granted) {
    ctx.status = 403
    return
  }
  try {
    const result = await userModel.getUserAll('worker')
    if (result.length) {
      ctx.status = 200
      ctx.body = result
    }
  } catch (error) {
    console.log(error)
  }
}

const getWorkerById = async (ctx) => {
  const id = ctx.params.id
  const permission = can.readWorker(ctx.state.user, parseInt(id))
  if (!permission.granted) {
    ctx.status = 403
    return
  }
  try {
    const result = await userModel.getUserByID(id, 'worker')
    if (!result.length) {
      ctx.status = 404
      return
    }
    ctx.status = 200
    ctx.body = result[0]
    console.log('find worker successfully')
  } catch (error) {
    console.log(error)
  }
}

const createWorker = async (ctx) => {
  const body = ctx.request.body
  try {
    const result = await userModel.createUser(body, 'worker')
    ctx.status = 201
    ctx.body = result[0]
    console.log('Create worker successfully')
  } catch (error) {
    console.log(error)
    ctx.status = 400
  }
}

const updateWorker = async (ctx) => {
  const id = ctx.params.id
  const permission = can.updateWorker(ctx.state.user, parseInt(id))
  if (!permission.granted) {
    console.log('Fail to check permission')
    ctx.status = 403
    return
  }
  console.log('Success to check permission')
  try {
    const worker = await userModel.getUserByID(id, 'worker')
    if (!worker.length) {
      ctx.status = 404
      return
    }
    const body = ctx.request.body
    const result = await userModel.updateUser(id, body)
    ctx.body = result[0]
    console.log('Update worker detail successfully')
    return
  } catch (error) {
    console.log(error)
    ctx.status = 400
  }
}

const deleteWorker = async (ctx) => {
  const id = ctx.params.id
  const permission = can.deleteWorker(ctx.state.user, parseInt(id))
  if (!permission.granted) {
    ctx.status = 403
    return
  }
  try {
    const user = await userModel.getUserByID(id, 'worker')
    if (!user.length) {
      ctx.status = 404
      return
    }
    await userModel.deleteUser(id)
    ctx.status = 204
    return
  } catch (error) {
    console.log(error)
    ctx.status = 400
  }
}

router.get('/', auth, getWorkerAll)
router.get('/:id([0-9]{1,})', auth, getWorkerById)
router.post('/', bodyParser(), checkWorkerId, workerValidation, createWorker)
router.put('/:id([0-9]{1,})', bodyParser(), auth, workerValidation, updateWorker)
router.delete('/:id([0-9]{1,})', auth, deleteWorker)

module.exports = router
