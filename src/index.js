const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')
const UserRouter = require('./router/user')
const TaskRouter = require('./router/task')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(UserRouter)
app.use(TaskRouter)

app.listen(port, () => {
    console.log('Server is up on', port)
})
