/**
* Summary. Performs user login login and save the token against it
* Description. Performs user login login and save the token against it
* @Author: Aashish
* @Created On: 10th July, 2022
*/
import express from 'express';
import md5 from 'md5';
import config from 'config';
import * as DB from '../../db/index.js';
import Userunit from '../../collections/userunit/index.js';
import UnitInfo from '../../collections/unitinfo/index.js';
import UnitTypes from '../../collections/unittypes/index.js';
import { responseCodes, messages } from '../../constants.js';
import mongoose from 'mongoose';
var ObjectId = mongoose.Types.ObjectId;
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
export const addUserUnit = async function (req, res) {
  let outputJSON;
  try {
    const userData = {
      userid: req.body.userid,
      unittype: req.body.unittype,
      address: req.body.address, 
      postalcode: req.body.postalcode, 
      city: req.body.city, 
      bedroom: req.body.bedroom, 
      bathroom: req.body.bathroom, 
      halfbathroom: req.body.halfbathroom,     
      };
      userData.aboutUnit =  req.body.aboutunit && req.body.aboutunit.length > 0 ?   req.body.aboutunit : []

      await Userunit.saveUser(userData);
      outputJSON = { 'status': 'success', "messageID": responseCodes.newResourceCreated, 'message': messages.addUserUnitSuccess }
    
  }
  catch (e) {
    outputJSON = { 'status': 'failure', "messageID": responseCodes.failureCode, 'message':"Something went wrong"}
  }
  return res.jsonp(outputJSON);
}


export const getUserUnit = async function (req, res) {
  let outputJSON;
  try {
      let valData = await Userunit.fetch();
      let Data  = valData.filter(x=>x.userid == req.body.userid)
      outputJSON = { 'status': 'success', "messageID": responseCodes.userUnitSuccess, 'message': messages.addUserUnitSuccess,data:Data }
  }
  catch (e) {
    outputJSON = { 'status': 'failure', "messageID": responseCodes.failureCode, 'message':"Something went wrong"}
  }
  return res.jsonp(outputJSON);
}