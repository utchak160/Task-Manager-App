require('../db/mongoose')
const User = require('../models/user')

const UpdateNameAndCount = async (id, name) => {
    await User.findByIdAndUpdate(id, { name })
    const count = await User.countDocuments({ name })
    return count
}

UpdateNameAndCount('5eb002b6dd9f46359c0cc672', 'Gudiya').then((count) => {
    console.log('count:', count)
}).catch((e) => {
    console.log(e.message)
})
