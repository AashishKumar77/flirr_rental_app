/**
* Summary. This files routes the function to be called in controller
* Description. This files routes the function to be called in controller
* @Author: Aashish Kumar
* @Created On: 10th July., 2022
*/
import express from "express";
import { registerUser, login ,forgotpassword} from "../controllers/auth/index.js";
import { addUserUnit,getUserUnit } from "../controllers/unit/index.js";
const auth = express.Router();

/**
 * @swagger
 * /register:
 *  post:
 *   tags: ["User"]
 *   summary: User API Endpoint
 *   description: API to add a User to database
 *   parameters:
 *      - in: body
 *        name: User
 *        description: User object
 *        schema:
 *         type: object
 *         required:
 *          - Admin
 *         properties:
 *          email:
 *            type: string
 *            required: true
 *          password:
 *            type: string
 *            required: true
 *          firstName:
 *            type: string
 *          lastName:
 *            type: string
 *   responses:
 *    '200':
 *      description: success
 *    '404':
 *      description: fail
 *    '204':
 *      description: nocontent
 */


auth.post('/register', registerUser);
/**
 * @swagger
 * /login:
 *  post:
 *   tags: ["User"]
 *   summary: User API Endpoint
 *   description: API to add a User to database
 *   parameters:
 *      - in: body
 *        name: User
 *        description: User object
 *        schema:
 *         type: object
 *         required:
 *          - User
 *         properties:
 *          email:
 *            type: string
 *            required: true
 *          password:
 *            type: string
 *            required: true
 *   responses:
 *    '200':
 *      description: success
 *    '404':
 *      description: fail
 *    '204':
 *      description: nocontent
 */
auth.post('/login', login);
/**
 * @swagger
 * /change-password:
 *  post:
 *   tags: ["User"]
 *   summary: User API Endpoint
 *   description: API to add a User to database
 *   parameters:
 *      - in: body
 *        name: User
 *        description: User object
 *        schema:
 *         type: object
 *         required:
 *          - User
 *         properties:
 *          password:
 *            type: string
 *            required: true
 *          newpassword:
 *            type: string
 *            required: true
 *   responses:
 *    '200':
 *      description: success
 *    '404':
 *      description: fail
 *    '204':
 *      description: nocontent
 */

auth.post('/adduserunit', addUserUnit);

auth.get('/unitlist', getUserUnit);


auth.post('/forgotpassword', forgotpassword);
export default auth; 