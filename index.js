const Koa = require('koa')
const cors = require('@koa/cors')
const static = require('koa-static-router')
const homepage = require('./routes/homepage.js')
const users = require('./routes/users.js')
const workers = require('./routes/workers.js')
const dogs = require('./routes/dogs.js')

const app = new Koa()
let port = process.env.Port || 10888
app.listen(port, () => {
  console.log(`Server started in port ${port}`)
})

const options = {
  origins: '*'
}
app.use(cors(options))

app.use(homepage.routes())
app.use(users.routes())
app.use(workers.routes())
app.use(dogs.routes())
app.use(static({dir:'docs', router:'/doc/'})) 
//static link: https://web-api-assignment-back-end.217013277.repl.co/doc/dogapi.html
