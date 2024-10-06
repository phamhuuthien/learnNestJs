export const configSendMail = {
  transport: {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'phamhuuthien2608@gmail.com',
      pass: 'wsnlufmtuomzwujf',
    },
  },
};

// wsnl ufmt uomz wujf
// const sendMail = async({email,html})=>{
//     const transporter = nodemailer.createTransport(smtpTransport({
//         host: "smtp.gmail.com",
//         port: 465,
//         secure: true,
//         auth: {
//           user: process.env.EMAIL_NAME,
//           pass: process.env.EMAIL_APP_PASSWORD,
//         },
//       }));

//     const info = await transporter.sendMail({
//         from: 'cuahangdientu" <no-reply@cuahangdientu.com>',
//         to: email,
//         subject: "forgot password ",
//         text: "Hello world?",
//         html: html,
//     });
//     return info
// }
// module.exports = sendMail
