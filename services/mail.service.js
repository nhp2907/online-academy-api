const mailer = require('nodemailer')

const transporter = mailer.createTransport({
    service: 'hotmail',
    auth: {
        user: 'hoangphucxm147@outlook.com',
        pass: process.env.MAIL_PASSWORD,
    }
})

const sendEmail = (options) => {
    transporter.sendMail(options, (err, info) => {
        if (err) {
            console.log("send mail error: ", err);
            return;
        }

        console.log("send mail info: ", info)
    })
}
module.exports = {sendEmail}