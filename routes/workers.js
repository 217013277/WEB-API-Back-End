const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')

const workerModel = require('../models/workers.js')
const userModel = require('../models/users.js')
const auth = require('../controllers/auth.js')
const { workerValidation } = require('../controllers/validation');
const can = require('../permissions/workers.js')
const checkWorkerId = require('../tools/checkWorkerId.js')

const router = Router({ prefix: '/api/v1/workers' })

const getWorkerAll = async (ctx) => {
  const permission = can.readWorkerAll(ctx.state.user)
  if (!permission.granted) return ctx.status = 403
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
  if (!permission.granted) return ctx.status = 403
  try {
    const result = await userModel.getUserByID(id, 'worker')
    if (!result.length) return ctx.status = 404
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
    if (!result.length) throw error
    ctx.status = 201
    ctx.body = result[0]
    console.log('Create worker successfully')
  } catch(error) {
    console.log(error)
  }
}

const updateWorker = async (ctx) => {
  const id = ctx.params.id
  const permission = can.updateWorker(ctx.state.user, parseInt(id))
  if (!permission.granted) { 
    console.log('Fail to check permission')
    return ctx.status = 403
  }
  console.log('Success to check permission')
  try{
    const worker = await userModel.getUserByID(id, 'worker')
    if (!worker.length) return ctx.status = 404
    const body = ctx.request.body
    const result = await userModel.updateUser(id, body)
    if (!result.length) throw error
    ctx.body = result[0]
    console.log('Update worker detail successfully')
    return
  } catch (error) {
    console.log(error)
  } 
}

const deleteWorkerById = async (ctx) => {
  const id = ctx.params.id
  const permission = can.deleteWorker(ctx.state.user, parseInt(id))
  if (!permission.granted) return ctx.status = 403

  try {
    const user = await userModel.getUserByID(id)
    if (!user.length) return ctx.status = 404
    const result = await model.deleteUser(id)
    if (!result) throw error
    return ctx.status = 204
  } catch (error) {
    console.log(error)
  }
}

router.get('/', auth, getWorkerAll)
router.get('/:id([0-9]{1,})', auth, getWorkerById)
router.post('/', bodyParser(), checkWorkerId, workerValidation, createWorker)
router.put('/:id([0-9]{1,})', bodyParser(), auth, workerValidation, updateWorker)
router.delete('/:id([0-9]{1,})', auth, deleteWorkerById)

module.exports = router
