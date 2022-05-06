const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')

const model = require('../models/dogs.js')
const auth = require('../controllers/auth.js')
const can = require('../permissions/dogs.js')

const router = Router({ prefix: '/api/v1/dogs' })

const getDogAll = async (ctx) => {
  const result = await model.getDogAll()
  if (result.length) {
    ctx.body = result
  }
}

const getDogById = async (ctx) => {
  const id = ctx.params.id
  const result = await model.getDogByID(id)
  if (result.length) {
    ctx.body = result[0]
  }
}

const createDog = async (ctx) => {
  const permission = can.updateDog(ctx.state.user)
  if (!permission.granted) {
    console.log(`Request user: ${ctx.state.user.username} , id: ${ctx.state.user.id} is not authorized to create`)
    ctx.status = 403
    ctx.body = { message: 'You have no permission to create' }
  } else {
    const body = ctx.request.body
    const result = await model.createDog(body)
    if (result.length) {
      ctx.body = result[0]
    }
  }
}

const updateDog = async (ctx) => {
  const id = ctx.params.id
  const permission = can.updateDog(ctx.state.user)
  if (!permission.granted) {
    console.log(`Request user: ${ctx.state.user.username} , id: ${ctx.state.user.id} is not authorized to update dog information`)
    ctx.status = 403
  } else {
    const body = ctx.request.body
    const result = await model.updateDog(id, body)
    if (result.length) {
      ctx.body = result
    } 
  }
}

const deleteDog = async (ctx) => {
  console.log('Processing deleteDog Route')
  const permission = can.deleteDog(ctx.state.user)
  if (!permission.granted) {
    console.log(`Request user: ${ctx.state.user.username} , id: ${ctx.state.user.id} is not authorized to delete any dog information`)
    ctx.status = 403
  } else {
    const id = ctx.params.id
    const result = await model.deleteDog(id)
    if (result) {
      ctx.status = result.status
      ctx.body = { id: parseInt(id) }
    }
  }
}

router.get('/', getDogAll)
router.get('/:id([0-9]{1,})', getDogById)
router.post('/', bodyParser(), auth, createDog)
router.put('/:id([0-9]{1,})', bodyParser(), auth, updateDog)
router.delete('/:id([0-9]{1,})', auth, deleteDog)

module.exports = router
