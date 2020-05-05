require('../db/mongoose')
const Task = require('../models/task')

Task.findByIdAndDelete('5eafe87d2e1da156f85ce287').then((task) => {
    console.log(task)
    return Task.countDocuments({completed: false})
}).then((count) => {
    console.log(count)
}).catch((e) => {
    console.log(e.message)
})

