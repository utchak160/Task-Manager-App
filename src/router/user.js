const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const auth = require('./../middleware/auth')

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e.message)
    }

    // user.save().then(() =>{
    //     res.status(201).send(user)
    // }).catch((e) => {
    //     res.status(400).send(e.message)
    // })
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token } )
    } catch (e) {
        res.status(400).send('Please enter the Valid Credentials')
    }
})

router.get('/users/profile', auth ,  async (req, res) => {

    try {
        const user = await User.findOne({})
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

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save('Logout Successful')
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logout', auth,  async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send('Successfully Logged Out')
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/:id', async (req, res) => {
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

router.patch('/users/profile',auth,  async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'age', 'email', 'password']
    const isValid = updates.every((updates) => allowedUpdates.includes(updates))

    if (!isValid) {
        return res.status(400).send({error: 'Invalid updates'})
    }

    try {
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        // const user = await User.findById(req.params.id)
        const user = req.user

        updates.forEach((update) => user[update] = req.body[update])

        await user.save()

        // if (!user) {
        //     return res.status(404).send()
        // }
        res.send(user)
    } catch (e) {
        res.status(500).send(e.message)
    }
})


router.delete('/users/profile', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.params.id)
        // if (!user) {
        //     return res.status(404).send({error: 'User Not Found'})
        // }
        await req.user.remove()
        res.send(user)
    } catch (e) {
        res.status(500).send();
    }
})

module.exports = router
