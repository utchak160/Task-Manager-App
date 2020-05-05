const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        res.status(201).send(user)
    } catch (e) {
        res.status(500).send(e.message)
    }

    // user.save().then(() =>{
    //     res.status(201).send(user)
    // }).catch((e) => {
    //     res.status(400).send(e.message)
    // })
})

app.get('/users', async (req, res) => {

    try {
        const user = await User.find({})
        if (!user) {
            res.status(404).send('User not found')
        }
        res.send(user)
    } catch (e) {
        res.status(500).send(e.message)
    }

    // User.find({}).then((users) => {
    //     res.send(users)
    // }).catch((e) => {
    //     res.status(500).send()
    // })
})

app.get('/users/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const user = await User.findById(_id)
        if (!user) {
            return res.status(404).send('User not found')
        }
        res.send(user)
    } catch (e) {
        res.status(500).send()
    }

    // User.findById(_id).then(user => {
    //     if (!user) {
    //         return res.status(404).send()
    //     }
    //     res.send(user)
    // }).catch((e) => {
    //     res.status(500).send()
    // })
})

app.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'age', 'email', 'password']
    const isValid = updates.every((updates) => allowedUpdates.includes(updates))

    if (!isValid) {
        return res.status(400).send({error: 'Invalid updates'})
    }

    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (e) {
        res.status(500).send(e.message)
    }
})


app.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) {
            return res.status(404).send({error: 'User Not Found'})
        }
        res.send(user)
    } catch (e) {
        res.status(500).send();
    }
})

app.post('/tasks', async (req, res) => {
    const task = new Task(req.body)
    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(500).send()
    }


    // task.save().then(() => {
    //     res.status(201).send(task)
    // }).catch((e) => {
    //     res.status(400).send(e.message)
    // })
})

app.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const AllowedUpdates = ['description', 'completed']
    const isValid = updates.every((updates) => AllowedUpdates.includes(updates))

    if (!isValid) {
        return res.status(400).send({error: 'Invalid Updates'})
    }

    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        if (!task) {
            return res.status(404).send({error: 'Task not found'})
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e.message)
    }
})


app.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)
        if (!task) {
            return res.status(404).send({error: 'Task not found'})
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

app.listen(port, () => {
    console.log('Server is up on', port)
})
