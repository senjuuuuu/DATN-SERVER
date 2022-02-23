const path = require('path');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const handlebarOptions = {
  viewEngine: {
    extName: '.handlebars',
    partialsDir: path.resolve('./api/views'),
    defaultLayout: false,
  },
  viewPath: path.resolve('./api/views'),
  extName: '.handlebars',
};
const transportOption = {
  service: process.env.NODEMAILER_SERVER,
  auth: {
    user: process.env.GOOGLE_USER,
    pass: process.env.GOOGLE_PASSWORD,
  },
};
const mailerSend = {
  sendConfirmationEmail: function (toUser) {
    return new Promise((res, rej) => {
      const transporter = nodemailer.createTransport(transportOption);
      transporter.use('compile', hbs(handlebarOptions));
      const mailOptions = {
        from: process.env.GOOGLE_USER,
        //in prod
        // to:toUser.email,
        to: toUser.email,
        subject: 'Your App - Active Account',
        cc: process.env.GOOGLE_USER,
        bcc: process.env.GOOGLE_USER,
        template: 'email',
        context: {
          name: toUser.displayName,
          url: `${process.env.SERVER}/api/auth/activate/${toUser._id}`,
        },
      };
      transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
          rej(err);
        } else {
          res(info);
        }
      });
    });
  },
  sendPasswordEmail: function (toUser, hash) {
    return new Promise((res, rej) => {
      const transporter = nodemailer.createTransport(transportOption);
      transporter.use('compile', hbs(handlebarOptions));
      const mailOptions = {
        from: process.env.GOOGLE_USER,
        //in prod
        // to:toUser.email,
        to: toUser.email,
        subject: 'Your App - Active Account',
        cc: process.env.GOOGLE_USER,
        bcc: process.env.GOOGLE_USER,
        template: 'password',
        context: {
          name: toUser.displayName,
          hash: hash,
          url: `${process.env.SERVER}/api/auth/activate/${toUser._id}`,
        },
      };
      transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
          rej(err);
        } else {
          res(info);
        }
      });
    });
  },
};

module.exports = mailerSend;
