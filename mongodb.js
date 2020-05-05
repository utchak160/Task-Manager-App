const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const ObjectID = mongodb.ObjectID

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

// const id = new ObjectID()
// console.log(id)
// console.log(id.getTimestamp())
// console.log(id.id)
// console.log(id.id.length)
// console.log(id.toHexString())
// console.log(id.toHexString().length)

MongoClient.connect(connectionURL, { useUnifiedTopology: true}, (error, client) => {
    if (error) {
        return console.log('Unable to connect')
    }

    const db = client.db(databaseName)

    // db.collection('users').insertOne({
    //     name: 'Utkarsh',
    //     age: 20
    // })
    // db.collection('task').insertMany([
    //     {
    //         description: 'Form status',
    //         completed: true
    //     },
    //     {
    //         description: 'Project status',
    //         completed: false
    //     }
    // ], (error, result) => {
    //     if (error) {
    //         console.log('Unable to insert')
    //     }
    //
    //     console.log(result.ops)
    // })

    // db.collection('task').findOne({ completed: true}, (error, task) => {
    //     if (error) {
    //         return console.log('Unable to find')
    //     }
    //     console.log(task)
    // })

    // db.collection('task').find({completed: false}).toArray( (error, user) => {
    //     if (error) {
    //         return console.log('Unable to find')
    //     }
    //     console.log(user)
    // })
    // db.collection('task').find({completed: false}).count( (error, user) => {
    //     if (error) {
    //         return console.log('Unable to find')
    //     }
    //     console.log(user)
    // })

    // db.collection('task').updateMany({ completed: true},
    //     {
    //     $set: {
    //         completed: false
    //     }
    // }).then((result) => {
    //     console.log(result)
    // }).catch(error => {
    //     console.log(error)
    // })

    db.collection('task').deleteOne({ completed: false}).then(result => {
        console.log(result)
    }).catch(error => {
        console.log(error)
    })
})
