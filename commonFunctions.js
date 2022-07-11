/**
* Summary. This files will contain all the functions which can used in common across the application
* Description. This files will contain all the functions which can used in common across the application
* @Author: Anurag Sethi
* @Created On: 1st July, 2020
*/
import moment from "moment";
import _ from "underscore-node";
import crypto from "crypto";
import uniqueRandom from "unique-random";
import translate from 'translate';
// import Language from './collections/language/index.js';
import mongoose from 'mongoose';

// Generate random strings.
export const GenerateRandom = (length = 32, alphanumeric = true) => {
    let data = "",
        keys = "";

    if (alphanumeric) {
        keys = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    } else {
        keys = "0123456789";
    }

    for (let i = 0; i < length; i++) {
        data += keys.charAt(Math.floor(Math.random() * keys.length));
    }
    return data;
};

/**
 * @param // cerate key String
 * @returns return a key String
 */
export const createKeyString = async (item) => item.toLowerCase().replace(/ /g, "_").trim()




/**
* @Description: Define supported data types in OrientDB and return data type as string by using ID of data type
* @param: {
    id //Data Type ID as Number
  }
  @return {
    type: String
  }
*/
export const DataType = (id) => {
    const supportedDataTypes = [
        {
            id: 0,
            type: 'BOOLEAN'
        },
        {
            id: 1,
            type: 'INTEGER'
        },
        {
            id: 2,
            type: 'SHORT'
        },
        {
            id: 4,
            type: 'FLOAT'
        },
        {
            id: 5,
            type: 'DOUBLE'
        },
        {
            id: 6,
            type: 'DATETIME'
        },
        {
            id: 7,
            type: 'STRING'
        },
        {
            id: 8,
            type: 'BINARY'
        },
        {
            id: 9,
            type: 'EMBEDDED'
        },
        {
            id: 10,
            type: 'EMBEDDEDLIST'
        },
        {
            id: 11,
            type: 'EMBEDDEDSET'
        },
        {
            id: 12,
            type: 'EMBEDDEDMAP'
        },
        {
            id: 13,
            type: 'LINK'
        },
        {
            id: 14,
            type: 'LINKLIST'
        },
        {
            id: 15,
            type: 'LINKSET'
        },
        {
            id: 16,
            type: 'LINKMAP'
        },
        {
            id: 17,
            type: 'BYTE'
        },
        {
            id: 18,
            type: 'TRANSIENT'
        },
        {
            id: 19,
            type: 'DATE'
        },
        {
            id: 20,
            type: 'CUSTOM'
        },
        {
            id: 21,
            type: 'DECIMAL'
        },
        {
            id: 22,
            type: 'LINKBAG'
        },
        {
            id: 23,
            type: 'ANY'
        }
    ];
    let type;
    for (var obj of supportedDataTypes) {
        if (obj.id === id) {
            type = obj.type;
            break;
        }
    }
    return type;
}

export const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/**
* @Description: Return date without offset in milliseconds
* @param: {
    date //new Date()
  }
  @return {
    type: number
  }
*/
export const removeOffset = (date) => {
    var userOffset = new Date(date).getTimezoneOffset();
    var userOffsetMilli = userOffset * 60 * 1000;
    var dateInMilli = moment(new Date(date)).valueOf();
    var dateInUtc = !isNaN(userOffsetMilli) ? dateInMilli - userOffsetMilli : "";
    return dateInUtc;
};

/**
* @Description: Return date with offset in milliseconds
* @param: {
    date //new Date()
  }
  @return {
    type: number
  }
*/
export const addOffset = (date) => {
    var userOffset = new Date(date).getTimezoneOffset();
    var userOffsetMilli = userOffset * 60 * 1000;
    var dateInMilli = moment(new Date(date)).valueOf();
    var dateInUtc = !isNaN(userOffsetMilli) ? dateInMilli + userOffsetMilli : "";
    return dateInUtc;
};

// export const translateLang = async (text, from = 'en') => {
//     try {
//         let languages = await Language.fetch({ $or: [{ status: 1 }, { status: null }] });
//         let obj = {};
//         for (var i = 0; i < languages.docs.length; i++) {
//             let trans = await translate(text, {
//                 from: from, to: languages.docs[i].code,
//                 engine: 'google', key: 'AIzaSyCR4y83WNOIpFrlwK6TJgPhAAfBTM96FM0'
//             });
//             obj[languages.docs[i].code] = trans && trans.replace(/( \/)\/ +/g, "//").replace(/ (\/)\s+/g, '$1').replace(/(\:)\s+/g, ":").replace(/ \./g, '.');
//         }
//         return obj;
//     } catch{

//     }
// }

export const encrypt = (text) => {
    var cipher = crypto.createCipher('aes-256-cbc', 'd6F3Efeq')
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
};

export const decrypt = (text) => {
    var decipher = crypto.createDecipher('aes-256-cbc', 'd6F3Efeq')
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
};


export const parseSSN = (ssn) => {
    if (ssn) {
        ssn = String(ssn)
        ssn = ssn.replace(/[^0-9]/ig, "");
        ssn = String(ssn)
        if (ssn.length != 0) {
            if (ssn.length < 9) {
                while (ssn.length != 9) {
                    ssn = "0" + ssn;
                }
            }
            if (ssn.length > 9) {
                ssn = ssn.substring(0, 9);
            }
        }
    }
    return ssn;
};
export const hideSSN = (ssn) => {
    var last4 = ssn.substr(5, 4);
    return "***-**-" + last4;
};
export const parseZip = (zip) => {
    var patt = new RegExp("^[0-9]*$");
    if (zip) {
        zip = zip.replace(/[a-z]/gi, "");
        zip = String(zip);
        if (patt.test(zip)) {
            if (zip.length != 0) {
                if (zip.length < 5) {
                    while (zip.length != 5) {
                        zip = "0" + zip;
                    }
                }
                if (zip.length > 5) {
                    zip = zip.substring(0, 5);
                }
            }
        } else {
            var strArray = zip.split(/[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/);
            if (strArray.length) {
                zip = strArray[0];
                for (var i = 0; i < strArray.length; i++) {
                    if (strArray[i].length && patt.test(strArray[i])) {
                        zip = strArray[i];
                        break;
                    }
                }
                if (zip.length != 0) {
                    if (zip.length < 5) {
                        while (zip.length != 5) {
                            zip = "0" + zip;
                        }
                    }
                    if (zip.length > 5) {
                        zip = zip.substring(0, 5);
                    }
                }
            }
        }
    }
    return zip;
};
export const checkGender = (gender) => {
    if (typeof gender == "string") {
        gender = gender.toLowerCase();
        if (gender.length > 1) {
            gender = gender.substr(0, 1);
        }
        if (gender == "2" || gender == "m") {
            return 2;
        } else if (gender == "1" || gender == "f") {
            return 1;
        } else {
            return 2;
        }
    } else {
        return 2;
    }
};

// Set default password
export const defaultPassword = (staticPassword) => {
    if (staticPassword) {
        return "Healthiex123";
    } else {
        var chars = "23456789";
        var uppercase = "ABCDEFGHJKLMNPQRSTUVWXYZ";
        var lowercase = "abcdefhkmnprstuvwxyz";
        var len = 3;
        var randomstring = '';
        for (var i = 0; i < len; i++) {
            var rnum = Math.floor(Math.random() * uppercase.length);
            randomstring += uppercase.substring(rnum, rnum + 1);
        }
        for (var i = 0; i < len; i++) {
            var rnum = Math.floor(Math.random() * chars.length);
            randomstring += chars.substring(rnum, rnum + 1);
        }
        for (var i = 0; i < len; i++) {
            var rnum = Math.floor(Math.random() * lowercase.length);
            randomstring += lowercase.substring(rnum, rnum + 1);
        }
        return randomstring;
    }
};
export const generateBardcode = function () {
    const barcode = uniqueRandom(0, 9);
    const barcode1 = uniqueRandom(1, 9);
    let barcodeValue =
        barcode1() +
        "" +
        barcode() +
        "" +
        barcode() +
        "" +
        barcode() +
        "" +
        barcode() +
        "" +
        barcode() +
        "" +
        barcode() +
        "" +
        barcode() +
        "" +
        barcode() +
        "" +
        barcode();
    return barcodeValue;
};

export const generateCertNumber = function () {
    const certCode = uniqueRandom(0, 9);
    const certCode1 = uniqueRandom(1, 9);
    let certNumberValue =
        certCode1() +
        "" +
        certCode() +
        "" +
        certCode() +
        "" +
        certCode() +
        "" +
        certCode() +
        "" +
        certCode() +
        "" +
        certCode() +
        "" +
        certCode() +
        "" +
        certCode();
    return certNumberValue;
};