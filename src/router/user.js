const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const multer = require('multer')
const { sendWelcomeEmail, sendCancelEmail } = require('../emails/account')
const auth = require('./../middleware/auth')
const sharp = require('sharp')

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token, message: 'Register Successfully' })
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
        res.send({ user, token, message: 'Login Successful'})
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
        res.send({Message: 'Successfully Logged Out'})
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
        await sendCancelEmail(req.user.email, req.user.name)
        await req.user.remove()
        res.send({message: 'Profile removed Successfully'})
    } catch (e) {
        res.status(500).send(e.message);
    }
})

const upload = multer({
    // dest: 'images',
    limits: {
        fileSize: 100000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true)

        // cb(new Error('File must be PDF'))
        // cb(undefined, true)
        // cb(undefined, false)
    }
})



router.post('/users/profile/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 350, height: 450}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send({message: 'File uploaded Successfully'})
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message})
})

router.delete('/users/profile/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send('Successfully Removed')
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(400).send({ Error: 'Something went wrong'})
    }
})



module.exports = router
