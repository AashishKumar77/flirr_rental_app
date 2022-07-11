import { validationResponse } from "../middleware/utils.js";
import expressValidator from "express-validator";
const { check } = expressValidator;



/**
 * Validates login request
 */
export const loginIsValid = [
    check("email")
        .optional()
        .exists()
        .withMessage("MISSING")
        .not()
        .isEmpty()
        .withMessage("IS_EMPTY")
        .isEmail()
        .withMessage("Email is not valid."),

    check("password")
        .exists()
        .withMessage("MISSING")
        .not()
        .isEmpty()
        .withMessage("IS_EMPTY")
        .isLength({
            min: 6
        })
        .withMessage("PASSWORD_TOO_SHORT_MIN_6"),
    (req, res, next) => {
        validationResponse(req, res, next);
    }
];



/**
 * Validates register request
 */
export const registerIsValid = [
    check("email")
        .not()
        .isEmpty()
        .withMessage("IS_EMPTY")
        .isEmail()
        .withMessage("Email is not valid"),
    check("fullname")
        .not()
        .isEmpty()
        .withMessage("IS_EMPTY"),
    check("password")
        .not()
        .isEmpty()
        .withMessage("IS_EMPTY")
        .isLength({
            min: 6
        })
        .withMessage("PASSWORD_TOO_SHORT_MIN_6"),
    (req, res, next) => {
        validationResponse(req, res, next);
    }
];

/**
 * Validates register request
 */
export const changePasswordIsValid = [
    check("password")
        .not()
        .isEmpty()
        .withMessage("IS_EMPTY")
        .isLength({
            min: 6
        })
        .withMessage("PASSWORD_TOO_SHORT_MIN_6"),
    (req, res, next) => {
        validationResponse(req, res, next);
    }
];