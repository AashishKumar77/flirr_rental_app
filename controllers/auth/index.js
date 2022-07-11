/**
* Summary. Performs user login login and save the token against it
* Description. Performs user login login and save the token against it
* @Author: Aashish
* @Created On: 10th July, 2022
*/
import express from 'express';
import jwt from 'jsonwebtoken';
import md5 from 'md5';
import config from 'config';
import * as DB from '../../db/index.js';
import User from '../../collections/users/index.js';
import UnitInfo from '../../collections/unitinfo/index.js';
import UnitTypes from '../../collections/unittypes/index.js';
import { responseCodes, messages } from '../../constants.js';
import { GenerateRandom } from '../../commonFunctions.js';
const secret = config.get('secret');
const auth = express.Router();
// import { sendEmail } from "../middleware/emailer.js"
const { APIHOST, URL } = config.get('APP');
const { MODE } = config.get('DEBUG_MODE');
import crypto from "crypto"
import AWS from "aws-sdk";
const { accessKeyId, secretAccessKey } = config.get('s3');

const s3 = new AWS.S3({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey
});

//Rgister User Login
export const registerUser = async function (req, res) {
  let outputJSON;
  try {
    const userData = {
      email: req.body.email,
      password: md5(req.body.password),
      firstName: req.body.firstName, 
      lastName: req.body.lastName, 
    };
    let existedUser = await User.checkEmail(req.body.email);
    if (existedUser) {
      outputJSON = { 'status': 'success', 'messageID': responseCodes.successCode, 'message': messages.duplicateUserEmailSuccess }
    } else {
      await User.saveUser(userData);
      outputJSON = { 'status': 'success', "messageID": responseCodes.newResourceCreated, 'message': messages.addUserSuccess }
    }
  }
  catch (e) {
    outputJSON = { 'status': 'failure', "messageID": responseCodes.failureCode, 'message': messages.addUserFailure }
  }
  return res.jsonp(outputJSON);
}

// User login
export const login = async (req,res) => {
  try {
    let user = await User.findOneByCondition({ email: req.body.email, password: md5(req.body.password) });
    let unitinfoData = await UnitInfo.fetch({});
    let UnittypesData = await UnitTypes.fetch({})
    if (user) {
      user = JSON.parse(JSON.stringify(user));
      const token = await jwt.sign(user, secret.jwt, { expiresIn: '24h' });
      let userObj = {};
      userObj.email = user.email;
      userObj.user_id = user._id;
      userObj.fullname = user.first_name;
      userObj.unitinfo = unitinfoData;
      userObj.unittypes = UnittypesData;
      userObj.token = `Bearer ${token}`;
      return res.jsonp({ 'status': 'success', "messageID": responseCodes.successCode, 'message': messages.loginSuccessfull, 'data': userObj });
    } else {
      return res.jsonp({ 'status': 'failure', "messageID": responseCodes.failureCode, 'message': messages.invalidCredentials });
    }

  } catch (err) {
    console.log(err, "===errro")
  }
}

export const checkPasswordToken = async function (req, res, next) {
  var outputJSON = '';
  try {
    let user = await Admin.findOneByCondition({ passwordtoken: req.params.token });
    if (user) {
      if (user.passwordexpiretime === Date.now()) {
        return res.jsonp({ 'status': 'success', "messageID": responseCodes.successCode, 'data': false })
      } else {
        return res.jsonp({ 'status': 'success', "messageID": responseCodes.successCode, 'data': true })
      }
    } else {
      return res.jsonp({ 'status': 'success', "messageID": responseCodes.successCode, 'data': false })
    }

  }
  catch (err) {

    outputJSON = { 'status': 'failure', "messageID": responseCodes.failureCode, 'message': messages.somethingWentWrong };
    res.jsonp(outputJSON);
  }
}
 
export const recoverPassword = async function (req, res, next) {
  var outputJSON = '';
  try {
    let user = await Admin.findOneByCondition({ passwordtoken: req.body.token });
    if (user) {
      await Admin.updateUserById(user._id, { password: md5(req.body.password) });
      outputJSON = { 'status': 'success', "messageID": responseCodes.successCode, 'message': messages.passwordupdatesuccessully };
      res.jsonp(outputJSON);
    } else {
      outputJSON = { 'status': 'failure', "messageID": responseCodes.failureCode, 'message': messages.somethingWentWrong };
      res.jsonp(outputJSON);
    }
  }
  catch (err) {
    outputJSON = { 'status': 'failure', "messageID": responseCodes.failureCode, 'message': messages.somethingWentWrong };
    res.jsonp(outputJSON);
  }
}
// Forgot Passsword  checkPasswordToken
export const forgotPassword = async function (req, res, next) {
  var outputJSON = '';
  try {
    const tempPassword = GenerateRandom(10, true);
    let user = await Admin.findOneByCondition({ email: req.query.email });
    if (user) {
      let date = new Date();
      let expireTime = date.setHours(date.getHours() + 1)
      const updatedData = await Admin.updateUserById(user._id, { passwordtoken: md5(tempPassword), passwordexpiretime: expireTime });
      let EmailtypeId = await EmailType.findOneByCondition({ "name.en": "Forgot Password" });
      let template = await EmailTemplate.findOneByCondition({ email_type: EmailtypeId._id });

      template.content['en'] = template.content['en'].replace(/{firstName}/g, user.fullName);
      template.content['en'] = template.content['en'].replace(/{lastName}/g, '');
      template.content['en'] = template.content['en'].replace(/{forgotPasswordLink}/g, `${APIHOST}:3005/recover-password/${user.passwordtoken}`);
      var data = {
        from: template.email_from,
        to: user.email,
        subject: template.subject['en'],
        html: template.content['en'].split('"').join(""),
      }

      await sendEmail(data).then(result => {
        return res.jsonp({ 'status': 'success', "messageID": responseCodes.successCode, 'message': messages.EmailSentSucessfully })
      }).catch(err => {
        return res.jsonp({ 'status': 'success', "messageID": responseCodes.successCode, 'message': messages.EmailSentSucessfully })
      })
      // const updatedData = await Admin.updateUserById(user._id, { password: md5(tempPassword) });
      // outputJSON = { 'status': 'success', "messageID": responseCodes.successCode, 'message': `${messages.passwordCreated} ${tempPassword}`, 'data': {} };
    } else {

      outputJSON = { 'status': 'success', "messageID": responseCodes.successCode, 'message': messages.EmailSentSucessfully };
    }
    res.jsonp(outputJSON);
  }
  catch (err) {
    outputJSON = { 'status': 'failure', "messageID": responseCodes.failureCode, 'message': messages.somethingWentWrong };
    res.jsonp(outputJSON);
  }
}


// Change Passsword Route without Checking any role
export const changePassword = async function (req, res, next) {
  var outputJSON = '';
  try {
    const newPassword = md5(req.body.password);
    const userId = req.user['_id'];
    if (req.user && req.user.role === '3') {
      const result = await Users.updateByIdOnlyPassword(userId, { password: req.body.password });
      await DB.disconnect();
      await DB.connection();
      const update = await Admin.findOneAndUpdate({ email: req.user.email }, { $set: { password: newPassword } });
      outputJSON = { 'status': 'success', "messageID": responseCodes.successCode, 'message': messages.resetPassword, 'data': result };
      res.jsonp(outputJSON);
    } else {
      const result = await Admin.updateUserById(userId, { password: newPassword });
      if (result) {
        outputJSON = { 'status': 'success', "messageID": responseCodes.successCode, 'message': messages.resetPassword, 'data': result };
        res.jsonp(outputJSON);
      }
    }

  }
  catch (err) {
    outputJSON = { 'status': 'failure', "messageID": responseCodes.failureCode, 'message': messages.somethingWentWrong };
    res.jsonp(outputJSON);
  }
}

// Logout Route
export const logout = async function (req, res, next) {
  var outputJSON = '';
  try {
    if (req.user) {
      const userId = req.user._id;
      req.user.role === 3 ? await Users.updateById(userId, { token: '' }) : await Admin.updateUserById(userId, { token: '' });
      res.jsonp({ 'status': 'success', "messageID": responseCodes.successCode, 'message': messages.LogoutSuccessfull, 'data': {} });
    }
  }
  catch (err) {
    outputJSON = { 'status': 'failure', "messageID": responseCodes.failureCode, 'message': messages.somethingWentWrong };
    res.jsonp(outputJSON);
  }
}


export default auth;