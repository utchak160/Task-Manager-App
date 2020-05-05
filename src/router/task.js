const express = require('express')
const Task = require('../models/task')
const router = new express.Router()

router.post('/tasks', async (req, res) => {
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

router.patch('/tasks/:id', async (req, res) => {
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


router.delete('/tasks/:id', async (req, res) => {
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

module.exports = router
