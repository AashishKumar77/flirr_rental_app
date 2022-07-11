// import Mailgun from 'mailgun-js';
// import nodemailer from 'nodemailer'
// import mg from 'nodemailer-mailgun-transport'
// import { MAILGUN } from "./../constants.js"
// /**
//  * Sends email
//  * @param {Object} data - data
//  * @param {boolean} callback - callback
//  */
// export const sendEmail = async (data, callback) => {
//     return new Promise(function (resolve, reject) {
//         try {
//             const transporter = nodemailer.createTransport(mg({ auth: { api_key: MAILGUN.API_KEY, domain: MAILGUN.DOMAIN } }))
//             transporter.sendMail(data, err => {
//                 console.log(data, "==data", err, "error")
//                 if (data) {
//                     resolve(data)
//                 } else {
//                     reject(err)
//                 }
//             });
//         }
//         catch (e) {
//             return false
//         }
//     });
// }


// /**
//  * 
//  * @param {Object} data 
//  * @param {Function} callback 
//  *   this method used to send mail usiing pure mailgun method with nodemailer
//  * 
//  * @returns - return the priomise
//  */

// const mailGunConfig = { apiKey: MAILGUN.API_KEY, domain: MAILGUN.DOMAIN }

// export const sendMailViaApi = (config = mailGunConfig, data, callback) => {
//     return new Promise((resolve, reject) => {
//         try {
//             const mg = Mailgun(config);
//             const format = { ...data }
//             mg.messages().send(format, (error, res) => {
//                 console.log(res, "==data", error, "error")
//                 if (res) {
//                     resolve(res)
//                 } else {
//                     reject(error)
//                 }
//             });

//         }
//         catch (e) {
//             console.log(e)
//             return false
//         }
//     });
// }
