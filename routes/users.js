const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')

const model = require('../models/users.js')
const auth = require('../controllers/auth.js')
const can = require('../permissions/users.js')

const router = Router({ prefix: '/api/v1/users' })

const getUserAll = async (ctx) => {
  const permission = can.readUserAll(ctx.state.user)
  if (!permission.granted) {
    ctx.status = 403
  } else {
    const result = await model.getUserAll()
    if (result.length) {
      ctx.body = result
    }
  }
}

const getUserById = async (ctx) => {
  const id = ctx.params.id
  const permission = can.readUser(ctx.state.user, parseInt(id))
  if (!permission.granted) {
    ctx.status = 403
  } else {
    const result = await model.getUserByID(id)
    if (result.length) {
      ctx.body = result
    }
  }
}

const createUser = async (ctx) => {
  const body = ctx.request.body
  const result = await model.createUser(body)
  if (result.length) {
    ctx.body = result
  }
}

const updateUser = async (ctx) => {
  const id = ctx.params.id
  const permission = can.updateUser(ctx.state.user, parseInt(id))
  if (!permission.granted) {
    ctx.status = 403
  } else {
    const body = ctx.request.body
    const result = await model.updateUser(id, body)
    if (result.length) {
      ctx.body = result
    }
  }
}

const deleteUserById = async (ctx) => {
  const id = ctx.params.id
  const permission = can.deleteUser(ctx.state.user, parseInt(id))
  if (!permission.granted) {
    ctx.status = 403
  } else {
    const result = await model.deleteUser(id)
    if (result) {
      ctx.status = result.status
      ctx.body = { id: parseInt(id) }
    }
  }
}

const login = async (ctx) => {
  console.log('start login')
  console.log(ctx.state.user)
  const body = ctx.state.user
  let result = { id: body.id, username: body.username, password: body.password, role: body.role }
    console.log(body)
    ctx.status = 201
    ctx.body = result
}

router.get('/', auth, getUserAll)
router.get('/:id([0-9]{1,})', auth, getUserById)
router.post('/', bodyParser(), createUser)
router.put('/:id([0-9]{1,})', bodyParser(), auth, updateUser)
router.delete('/:id([0-9]{1,})', auth, deleteUserById)
router.post('/login', auth, login)

module.exports = router
