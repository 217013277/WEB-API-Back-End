const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')

const model = require('../models/dogs.js')
const auth = require('../controllers/auth.js')
const can = require('../permissions/dogs.js')
const { dogValidation } = require('../controllers/validation');

const router = Router({ prefix: '/api/v1/dogs' })

const getDogAll = async (ctx) => {
  try {
    const result = await model.getDogAll()
    if (result.length) {
      ctx.status = 200
      ctx.body = result
    } 
    } catch (error) {
      console.log(error)
  }
}

const getDogById = async (ctx) => {
  const id = ctx.params.id
  try {
    const result = await model.getDogByID(id)
    if (!result.length) return ctx.status = 404
      ctx.status = 200
      ctx.body = result[0]
    } catch (error) {
      console.log(error)
  }
}

const createDog = async (ctx) => {
  const permission = can.updateDog(ctx.state.user)
  if (!permission.granted) return ctx.status = 403
  try {
    const body = ctx.request.body
    const result = await model.createDog(body)
    if (!result.length) return error
    ctx.status = 201
    ctx.body = result[0]
  } catch (error) {
    console.log(error)
  }
}

const updateDog = async (ctx) => {
  const id = ctx.params.id
  const permission = can.updateDog(ctx.state.user)
  if (!permission.granted) ctx.status = 403
  try {
    const body = ctx.request.body
    const result = await model.updateDog(id, body)
    if (result.length) throw error
    ctx.status= 200
    ctx.body = result[0]
  } catch (error) {
    console.log(error)
  }
}

const deleteDog = async (ctx) => {
  console.log('Processing deleteDog Route')
  const permission = can.deleteDog(ctx.state.user)
  if (!permission.granted) return ctx.status = 403
  try {
    const id = ctx.params.id
    const result = await model.deleteDog(id)
    if (!result) throw error
    console.log(result)
    ctx.status = 204
  } catch (error) {
    console.log(error)
  }
}

router.get('/', getDogAll)
router.get('/:id([0-9]{1,})', getDogById)
router.post('/', bodyParser(), auth, dogValidation, createDog)
router.put('/:id([0-9]{1,})', bodyParser(), auth, dogValidation, updateDog)
router.delete('/:id([0-9]{1,})', auth, deleteDog)

module.exports = router
