(async function () {
  const nodemailer = require('nodemailer')
  const handlebars = require('express-handlebars')
  const { htmlToText } = require('nodemailer-html-to-text')
  const nodemailerHandlebars = require('nodemailer-express-handlebars')
  const { promisify } = require('util')
  const path = require('path')

  const transporter = nodemailer.createTransport({
    host: 'mail.privateemail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.PRIVATE_EMAIL_USERNAME,
      pass: process.env.PRIVATE_EMAIL_PASSWORD
    }
  })

  transporter.use('compile', nodemailerHandlebars({ 
    viewEngine: handlebars.create({}),
    viewPath: path.join(__dirname, 'templates'),
    extName: '.hbs'
  }))
  transporter.use('compile', htmlToText())
  transporter.verify = promisify(transporter.verify)

  try {
    await transporter.verify()

    const message = {
      from: process.env.PRIVATE_EMAIL_ACCOUNT,
      to: process.env.EMAIL_DESTINATION,
      subject: 'Test',
      template: 'email',
      context: {
        sendAt: new Date().toLocaleDateString()
      }
    }

    const sendInfo = await transporter.sendMail(message)
    console.log(sendInfo)
  }
  catch (err) {
    console.error(err.message)
  }
})()
