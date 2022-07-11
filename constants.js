/**
* Summary. Initializes the constants to be used in the application
* Description. The file list all the contants used in the application
* @Author: Aashish Kumar
* @Created On: 27th Sep, 2021
*/

//messages
export const messages = {
    "errorRetreivingData": "Error occured while retreiving the data from collection",
    "successRetreivingData": "Data retreived successfully from the collection",
    "successDeletedData": "Data Deleted successfully from the collection",
    "successUpdatedData": "Data Updated successfully from the collection",
    "tokenExpired": "Token Expired",
    "unAuthorizedUser": "Unauthorized User",
    "internalServerError": "Some error occured",
    "tokenIsNotValid": "Your session expired, Please login again",
    "authTokenNotProvided": "Your session expired, Please login again",
    "recordDoesNotExists": "Record does not exists",
    "putrequiredvalues": "Enter required values",
    "invalidCredentials":"Invalid Credentials",
     
    //Admin
    "duplicateUserEmailSuccess": "User Email already exists",
    "addUserSuccess": "User Registered successfully",
    "addUserFailure": "Error saving user ",
     
    //User
    "duplicateUserSuccess": "Email already exists",
    "addUserSuccess": "User Registeration successfully",
    "addUserFailure": "Error saving user",
    "resetPassword": "Change password successfully",
    
    //UserUnit
    "addUserUnitSuccess": "Unit addedd successfully",
    "userUnitSuccess": "Get unit list successfully",
    "duplicateTutorialSuccess": "Tutorial already exist",
    "updateTutorialSuccess": "Tutorial updated successfully",
    "deleteTutorialSuccess": "Tutorial deleted successfully!",

    //Resources
    "addResourceSuccess": "Resource added successfully",
    "duplicateResourceSuccess": "Resource already exist",
    "updateResourceSuccess": "Resource updated successfully",
    "deleteResourceSuccess":"Resource deleted successfully!",

    //Subscription
    "addSubscriptionSuccess": "Subscription added successfully",
    "duplicateSubscriptionSuccess": "Subscription already exist",
    "updateSubscriptionSuccess": "Subscription updated successfully",
    "deleteSubscriptionSuccess": "Subscription deleted successfully!",
    //Feature
    "addFeatureSuccess": "Feature added successfully",
    "duplicateFeatureSuccess": "Feature already exist",
    "updateFeatureSuccess": "Feature updated successfully",
    "deleteFeatureSuccess": "Feature deleted successfully!",


    //Bestofbot updateBestOfBothSuccess

    "addBestOfBothSuccess": "BestOfBoth added successfully",
    "duplicateBestOfBothSuccess": "BestOfBoth already exist",
    "updateBestOfBothSuccess": "BestOfBoth updated successfully",
    "deleteBestOfBothSuccess":"BestOfBoth deleted successfully!",


    //Bestofbot updatefaqSuccess

    "addfaqSuccess": "FAQ added successfully",
    "duplicatefaqSuccess": "FAQ already exist",
    "updatefaqSuccess": "FAQ updated successfully",
    "deletefaqSuccess": "FAQ deleted successfully!",
    //language
    "duplicateLanguageSuccess": "Language already exist",
    "LanguageDeletedSuccess": "Language deleted successfully",
}


export const MAILGUN = {
    EMAIL_SMTP_DOMAIN_MAILGUN: "myproject.com",
    EMAIL_SMTP_API_MAILGUN: "smartdata",
    EMAIL_SMTP_API_USER: "testpru2@gmail.com",
    API_KEY: 'd75a92cd470e4319d7e42a537e58298d-0f472795-05f124ba',
    DOMAIN: 'sandbox4793ffbe1cac45c0b55aacecdb29b1c7.mailgun.org'
}

export const REPLACE_REGEX_DESC = /\\n|&nbsp;|\s\s/g
export const REPLACE_REGEX_NAME = /\\|\s+/g
//responseCodes
export const responseCodes = {
    //to be used when no new record is inserted but to display success message
    "successCode": 200,
    //to be used when new record is inserted
    "newResourceCreated": 201,
    //to be used if database query return empty record
    "nocontent": 204,
    //to be used if the request is bad e.g. if we pass record id which does not exits
    "badRequest": 400,
    //"jwtTokenExpired": 401,

    //to be used when the user is not authorized to access the API e.g. invalid access token
    "unAuthorizedUser": 401,

    //to be used when access token is not valid
    "forbidden": 403,
    //to be used if something went wrong
    "failureCode": 404,
    //to be used when error occured while accessing the API
    "internalServerError": 500,
    //to be used if record already axists
    "conflictCode": 409,
}


