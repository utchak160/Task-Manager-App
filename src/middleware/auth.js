const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'Iamfinetoday')
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})
        console.log(decoded)
        // console.log(user)

        if (!user) {
            throw new Error('No user found')
        }
        req.token = token
        req.user = user
        console.log(token)
        next()
    } catch (e) {
        console.log(e.message)
        res.status(401).send({error: 'Please Authenticate'})
    }
}

module.exports = auth
