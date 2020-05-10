const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
    // const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
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

router.get('/tasks', auth,  async (req, res) => {
    try{
        // const tasks = await Task.find({})
        await req.user.populate('tasks').execPopulate()
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const AllowedUpdates = ['description', 'completed']
    const isValid = updates.every((updates) => AllowedUpdates.includes(updates))

    if (!isValid) {
        return res.status(400).send({error: 'Invalid Updates'})
    }

    try {
        const task = await  Task.findOne({_id: req.params.id, owner: req.user._id})
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        if (!task) {
            return res.status(404).send({error: 'Task not found'})
        }
        updates.forEach((update)=> task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch (e) {
        res.status(500).send(e.message)
    }
})


router.delete('/tasks/:id',auth,  async (req, res) => {
    try {
        // const task = await Task.findByIdAndDelete(req.params.id)
        const task = await  Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id})
        if (!task) {
            return res.status(404).send({error: 'Task not found'})
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router
