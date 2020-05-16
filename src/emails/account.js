const sgMail = require('@sendgrid/mail')

const sendgridAPIKey = process.env.SENDGRID_API_KEY

sgMail.setApiKey(sendgridAPIKey)

// const msg = {
//     to: 'chakravartyutkarsh@gmail.com',
//     from: 'chakravartyutkarsh@gmail.com',
//     subject: 'Testing',
//     text: 'I hope you got this mail',
//     html: '<strong>Its to easy to use this</strong>'
// }

// sgMail.send(msg)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'chakravartyutkarsh@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    })
}

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'chakravartyutkarsh@gmail.com',
        subject: 'Account Deleted Successful',
        text: `Hi, ${name}. Your account is deleted Successfully. Come back, whenever you need us`
    })
}

module.exports = {
    sendWelcomeEmail, sendCancelEmail
}
