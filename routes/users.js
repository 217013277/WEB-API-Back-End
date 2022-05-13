const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')

const userModel = require('../models/users.js')
const auth = require('../controllers/auth.js')
const can = require('../permissions/users.js')
const { userValidation } = require('../controllers/validation')

const router = Router({ prefix: '/api/v1/users' })

const getUserAll = async (ctx) => {
  const permission = can.readUserAll(ctx.state.user)
  if (!permission.granted) {
    ctx.status = 403
    return
  }
  try {
    const result = await userModel.getUserAll('user')
    if (result.length) {
      ctx.status = 200
      ctx.body = result
    }
  } catch (error) {
    console.log(error)
  }
}

const getUserById = async (ctx) => {
  const id = ctx.params.id
  const permission = can.readUser(ctx.state.user, parseInt(id))
  if (!permission.granted) {
    ctx.status = 403
    return
  }
  try {
    const result = await userModel.getUserByID(id, 'user')
    if (!result.length) {
      ctx.status = 404
      return
    }
    ctx.status = 200
    ctx.body = result[0]
    console.log('find user successfully')
  } catch (error) {
    console.log(error)
  }
}

const createUser = async (ctx) => {
  const body = ctx.request.body
  try {
    const result = await userModel.createUser(body, 'user')
    ctx.status = 201
    ctx.body = result[0]
    console.log('Create user successfully')
  } catch (error) {
    console.log(error)
    ctx.status = 400
  }
}

const updateUser = async (ctx) => {
  const id = ctx.params.id
  const permission = can.updateUser(ctx.state.user, parseInt(id))
  if (!permission.granted) {
    console.log('Fail to check permission')
    ctx.status = 403
    return
  }
  console.log('Success to check permission')
  try {
    const user = await userModel.getUserByID(id, 'user')
    if (!user.length) {
      ctx.status = 403
      return
    }
    const body = ctx.request.body
    const result = await userModel.updateUser(id, body)
    ctx.body = result[0]
    console.log('Update user detail successfully')
    return
  } catch (error) {
    console.log(error)
    ctx.status = 400
  }
}

const deleteUserById = async (ctx) => {
  const id = ctx.params.id
  const permission = can.deleteUser(ctx.state.user, parseInt(id))
  if (!permission.granted) {
    ctx.status = 403
    return
  }
  try {
    const user = await userModel.getUserByID(id, 'user')
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

const login = async (ctx) => {
  console.log('Start login')
  const result = {
    id: ctx.state.user.id,
    username: ctx.state.user.username,
    password: ctx.state.user.password,
    role: ctx.state.user.role
  }
  ctx.status = 201
  ctx.body = result
  console.log('Login successfuly. Sent login information, finished login')
}

router.get('/', auth, getUserAll)
router.get('/:id([0-9]{1,})', auth, getUserById)
router.post('/', bodyParser(), userValidation, createUser)
router.put('/:id([0-9]{1,})', bodyParser(), auth, userValidation, updateUser)
router.delete('/:id([0-9]{1,})', auth, deleteUserById)
router.post('/login', auth, login)

module.exports = router
