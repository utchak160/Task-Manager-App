const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')
const UserRouter = require('./router/user')
const TaskRouter = require('./router/task')

const app = express()
const port = process.env.PORT || 3000



// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         res.send('Relax! There is some issue, it will be resolved soon.')
//         console.log(req.method, req.path)
//     } else {
//         next()
//     }
// })

app.use(express.json())
app.use(UserRouter)
app.use(TaskRouter)

app.listen(port, () => {
    console.log('Server is up on', port)
})

// const jwt = require('jsonwebtoken')
//
// const myFunction = async () => {
//     const token = jwt.sign({ _id: 'abc123'}, 'Iamfinetoday', { expiresIn: '7 days'})
//     console.log(token)
//
//     const data = jwt.verify(token, 'Iamfinetoday')
//     console.log(data)
// }
//
// myFunction()

// const bcrypt = require('bcryptjs')
//
// const myFunction = async () => {
//     const password = 'qwerty123'
//     const hashedPassword = await bcrypt.hash(password, 8)
//
//     console.log(password)
//     console.log(hashedPassword)
//
//     isMatch = await bcrypt.compare('qwerty123', hashedPassword)
//     console.log(isMatch)
// }
// myFunction()

// const pet = {
//     name: 'Pussy'
// }
//
// pet.toJSON = function () {
//     console.log(this)
// }
//
// console.log(JSON.stringify(pet))


// const main = async () => {
//     const task = await findById()
//     await task.populate('owner').execPopulate()
//     console.log()
// }
