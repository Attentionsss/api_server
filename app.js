const express = require('express')
const app = express()
const config = require('./config')
const expressJWT = require('express-jwt')

app.use((req, res, next) => {
  res.cc = (err, status = 1) => {
    res.send({
      status,
      message: err instanceof Error ? err.message : err,
    })
  }
  next()
})
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))

const cors = require('cors')
app.use(cors())

// 配置解析表单数据的中间件，application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))

const userRouter = require('./router/user')
app.use('/api', userRouter)

const userinfoRouter = require('./router/userinfo')
app.use('/my', userinfoRouter)

const joi = require('@hapi/joi')
app.use((err, req, res, next) => {
  if (err instanceof joi.ValidationError) {
    return res.cc(err)
  }

  if (err.name === 'UnauthorizedError') {
    return res.cc('身份认证失败！')
  }
  // 未知错误
  res.cc(err)
})

app.listen(3007, () => {
  console.log('api server running at 127.0.0.1:3007')
})
