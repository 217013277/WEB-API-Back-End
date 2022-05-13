const Router = require('koa-router')

const router = Router({prefix: '/'})

router.get('/', async ctx => ctx.body = '<p>API Document: <a href="https://web-api-assignment-back-end.217013277.repl.co/doc/dogapi.html">https://web-api-assignment-back-end.217013277.repl.co/doc/dogapi.html</a></p>')

//router.get(async ctx => ctx.body = 'hello')

module.exports = router