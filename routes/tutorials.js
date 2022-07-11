/**
* Summary. This files routes the function to be called in controller
* Description. This files routes the function to be called in controller
* @Author: Dixit
* @Created On: 12th Sep., 2021
*/
import express from "express";

import { verifyToken } from '../lib/auth/passport.js';
import { addUserUnit} from "../controllers/unit/index.js";
const auth = express.Router();


/**
 * @swagger
 * /gettutorial:
 *  get:
 *   tags: ["User Unit"]
 *   summary: User API Endpoint
 *   description: API to add a User to database
 *   responses:
 *    '200':
 *      description: success
 *    '404':
 *      description: fail
 *    '204':
 *      description: nocontent
 */
auth.post('/adduserunit', addUserUnit);





export default auth;