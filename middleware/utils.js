import * as crypto from "crypto";
import expressValidator from "express-validator";
import config from 'config';
import c from "config";
import moment from "moment";
const { DATABASE, HOST, PORT, } = config.get('DB');
import { MAILGUN } from "./../constants.js"



const { validationResult } = expressValidator;
/**
 * Handles error by printing to console in development env and builds and sends an error response
 * @param {Object} res - response object
 * @param {Object} err - error object
 */
export const handleError = (res, err) => {
  // Prints error in console
  if (process.env.NODE_ENV === "development") {
    console.log(err);
  }
  // Sends error to user
  res.status(err.code).json({
    // errors: {
    //   msg: err.message
    // }
    'messageID': err.code,
    'message': err.message[0].msg
  });
};

/**
 * Builds error object
 * @param {number} code - error code
 * @param {string} message - error text
 */
export const buildErrObject = (code, message) => {
  return {
    code,
    message
  };
};

/**
 * Builds error for validation files
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {Object} next - next object
 */
export const validationResponse = (req, res, next) => {
  try {
    validationResult(req).throw();
    if (req.body.email) {
      req.body.email = req.body.email;
    }
    return next();
  } catch (err) {
    return handleError(res, buildErrObject(422, err.array()));
  }
};

/**
 * Builds initial options for query
 * @param {Object} query - query object
 */
export const listInitOptions = async req => {
  return new Promise(resolve => {
    const order = req.query.order ? Number(req.query.order) : -1;
    const sort = req.query.sort || "createdAt";
    const isSortLng = req.query.isSortLng !== undefined ? req.query.isSortLng : true
    const sortBy = buildSort(sort, order, isSortLng);
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const options = {
      lean: true,
      page,
      limit,
      sort: sortBy,
      collation: {   // <--- setup the sorting options via the collation flags
        locale: 'en',
      },

    };
    if (req.populate) options.populate = req.populate;
    resolve(options);
  });
};
export const listInitOptions1 = async req => {
  return new Promise(resolve => {
    const order = req.query.order || -1;
    const sort = req.query.sort || "createdAt";
    const sortBy = buildSort1(sort, order);
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const options = {
      sort: sortBy,
      lean: true,
      page,
      limit,
      collation: {   // <--- setup the sorting options via the collation flags
        locale: 'en',
      },
    };
    if (req.populate) options.populate = req.populate;
    resolve(options);
  });
};

/**
 * Builds sorting
 * @param {string} sort - field to sort from
 * @param {number} order - order for query (1,-1)
 */
const buildSort = (sort, order, isLngSort) => {
  const sortBy = {};
  let sortByLanguage;
  if (sort === "name" && JSON.parse(isLngSort)) {
    sortByLanguage = sort + ".en"
  } else {
    sortByLanguage = sort
  }
  sortBy[sortByLanguage] = order;
  return sortBy;
};

/**
  * Checks the query string for filtering records
  * query.filter should be the text to search (string)
  * query.fields should be the fields to search into (array)
  * @param {Object} query - query object
  */
export const checkQueryString = async (query) => {
  return new Promise((resolve, reject) => {
    try {

      let filterByLang = query.isLng !== undefined ? JSON.parse(query.isLng) : true
      //  let data = { status: { $ne: 0 } };
      let data = query.fields === 'formula_name' || query.fields === "algo_name" ? { deleted: { $ne: 1 } } : { status: { $ne: 0 } };
      if (query.extraFilter) {
        data = {
          ...data,
          $or: [
            { diagnosis: query.extraFilter },
            { problem: query.extraFilter },
            { goal: query.extraFilter },
          ]
        }
      }
      //ondition for 

      if (
        typeof query.filter !== "undefined" && query.filter &&
        typeof query.fields !== "undefined"
      ) {
        query.filter = query.filter.replace(/\\/g, '"\\"');
        const array = [];

        // Takes fields param and builds an array by splitting with ','
        const arrayFields = query.fields.split(",");
        // Adds SQL Like %word% with regex
        arrayFields.map(item => {
          array.push({
            [!filterByLang || item == 'icd9_code' || item === 'profile.groupId' || item === 'icd10_code' || item === 'emailaddress' || item === 'email' || item === 'profile.group' ? `${item}` : item === 'formula_name' || item === 'algo_name' ? `${item}` : `${item}.en`]: {
              $regex: new RegExp(`.*${query.filter}`, "i")
            }
          });
        });
        // Puts array result in data
        data = { ...data, $or: array }
        resolve(data);
      } else {
        resolve(data);
      }
    } catch (err) {
      reject("ERROR_WITH_FILTER");
    }
  });
}


/**
  * Checks the query string for filtering records only for active data
  * query.filter should be the text to search (string)
  * query.fields should be the fields to search into (array)
  * @param {Object} query - query object
  */
export const checkQueryStringForActiveData = async (query) => {
  return new Promise((resolve, reject) => {
    try {

      let data = { status: 1 };
      if (query.extraFilter) {
        data = {
          ...data,
          $or: [
            { diagnosis: query.extraFilter },
            { problem: query.extraFilter },
            { goal: query.extraFilter },
          ]
        }
      }

      if (
        typeof query.filter !== "undefined" && query.filter &&
        typeof query.fields !== "undefined"
      ) {
        query.filter = query.filter.replace(/\\/g, '"\\"');
        const array = [];
        // Takes fields param and builds an array by splitting with ','
        const arrayFields = query.fields.split(",");
        // Adds SQL Like %word% with regex
        arrayFields.map(item => {
          array.push({
            [item === 'icd9_code' || item === 'icd10_code' || item === 'profile.group' ? `${item}` : `${item}.en`]: {
              $regex: new RegExp(`.*${query.filter}`, "i")
            }
          });
        });
        // Puts array result in data
        data = { ...data, $or: array }
        resolve(data);
      } else {
        resolve(data);
      }
    } catch (err) {
      reject("ERROR_WITH_FILTER");
    }
  });
}



/**
  * Checks the query string for filtering records
  * query.filter should be the text to search (string)
  * query.fields should be the fields to search into (array)
  * @param {Object} query - query object
  */
export const checkQueryStringForNameString = async (query) => {
  return new Promise((resolve, reject) => {
    try {
      let data = { status: { $ne: 0 } };
      if (query && !query.all_lang) {
        data = { status: { $nin: [0, 2] } };
      }
      if (query.extraFilter) {
        data = {
          ...data,
          $or: [
            { diagnosis: query.extraFilter },
            { problem: query.extraFilter },
            { goal: query.extraFilter },
          ]
        }
      }
      if (
        typeof query.filter !== "undefined" && query.filter &&
        typeof query.fields !== "undefined"
      ) {
        query.filter = query.filter.replace(/\\/g, '"\\"');
        const array = [];
        // Takes fields param and builds an array by splitting with ','
        const arrayFields = query.fields.split(",");
        // Adds SQL Like %word% with regex
        arrayFields.map(item => {

          array.push({
            [`${item}`]: {
              $regex: new RegExp(`.*${query.filter}`, "i")
            }
          });
        });
        // Puts array result in data
        data = { ...data, $or: array }
        resolve(data);
      } else if (query.startDate && query.endDate) {
        resolve({ ...data, createdAt: { $gte: moment(query.startDate, "MM/DD/YYYY").valueOf(), $lt: moment(query.endDate, "MM/DD/YYYY").valueOf() } })
      } else {
        resolve(data);
      }
    } catch (err) {
      reject("ERROR_WITH_FILTER");
    }
  });
}
/**
 * 
 * @param {object} query 
 * @returns 
 */
export const checkQueryStringForNameStringEncrypted = async (query) => {
  return new Promise((resolve, reject) => {
    try {
      let data = { status: { $ne: 0 } };
      if (query && !query.all_lang) {
        data = { status: { $nin: [0, 2] } };
      }
      if (query.extraFilter) {
        data = {
          ...data,
          $or: [
            { diagnosis: query.extraFilter },
            { problem: query.extraFilter },
            { goal: query.extraFilter },
          ]
        }
      }
      if (
        typeof query.filter !== "undefined" && query.filter &&
        typeof query.fields !== "undefined"
      ) {
        query.filter = query.filter.replace(/\\/g, '"\\"');
        const array = [];
        // Takes fields param and builds an array by splitting with ','
        const arrayFields = query.fields.split(",");
        // Adds SQL Like %word% with regex
        arrayFields.map(item => {

          array.push({
            [`${item}`]: {
              $regex: new RegExp(`.*${getConvertedString(query.filter)}`, "i")
            }
          });
        });
        // Puts array result in data
        data = { ...data, $or: array }
        resolve(data);
      } else {
        resolve(data);
      }
    } catch (err) {
      reject("ERROR_WITH_FILTER");
    }
  });
}



export const checkQueryStringGettingNotDeletedEntry = async (query) => {
  return new Promise((resolve, reject) => {
    try {
      let data = { status: { $ne: 0 } };
      if (query && !query.all_lang) {
        data = { status: { $nin: [0] } };
      }
      if (query.extraFilter) {
        data = {
          ...data,
          $or: [
            { diagnosis: query.extraFilter },
            { problem: query.extraFilter },
            { goal: query.extraFilter },
          ]
        }
      }
      if (
        typeof query.filter !== "undefined" && query.filter &&
        typeof query.fields !== "undefined"
      ) {
        query.filter = query.filter.replace(/\\/g, '"\\"');
        const array = [];
        // Takes fields param and builds an array by splitting with ','
        const arrayFields = query.fields.split(",");
        // Adds SQL Like %word% with regex
        arrayFields.map(item => {

          array.push({
            [`${item}`]: {
              $regex: new RegExp(`.*${query.filter}`, "i")
            }
          });
        });
        // Puts array result in data
        data = { ...data, $or: array }
        resolve(data);
      } else {
        resolve(data);
      }
    } catch (err) {
      reject("ERROR_WITH_FILTER");
    }
  });
}


// create dynamic db connection url for spacific group
export const databaseUrl = async (DBS = '', staging = false) => {
  return DBS && staging ? `mongodb://${DBS.group_db.username}:${encodeURIComponent(DBS.group_db.password)}@${DBS.group_db.host}:${DBS.group_db.port}/${DBS.group_db.database}`
    : `mongodb://${HOST}:${DBS.group_db.port ? DBS.group_db.port : PORT}/${DBS.group_db.database ? DBS.group_db.database : DATABASE}`;
}


// For Language Services ONly
/*====================================*/



/**
 * Builds sorting
 * @param {string} sort - field to sort from
 * @param {number} order - order for query (1,-1)
 */
const buildSort1 = (sort, order) => {
  const sortBy = {};
  let sortByLanguage;

  sortByLanguage = sort

  sortBy[sortByLanguage] = order;
  return sortBy;
};

/**
  * Checks the query string for filtering records
  * query.filter should be the text to search (string)
  * query.fields should be the fields to search into (array)
  * @param {Object} query - query object
  */
export const checkQueryString1 = async (query) => {
  return new Promise((resolve, reject) => {
    try {
      let data = { status: { $ne: 0 } };
      if (query.extraFilter) {
        data = {
          ...data,
          $or: [
            { diagnosis: query.extraFilter },
            { problem: query.extraFilter },
            { goal: query.extraFilter },
          ]
        }
      }

      if (
        typeof query.filter !== "undefined" && query.filter &&
        typeof query.fields !== "undefined"
      ) {

        const array = [];
        // Takes fields param and builds an array by splitting with ','
        const arrayFields = query.fields.split(",");
        // Adds SQL Like %word% with regex
        arrayFields.map(item => {
          array.push({
            [item == 'icd9_code' || item == 'icd10_code' ? `${item}` : `${item}`]: {
              $regex: new RegExp(`.*${query.filter}`, "i")
            }
          });
        });
        // Puts array result in data
        data = { ...data, $or: array }
        resolve(data);
      } else {
        resolve(data);
      }
    } catch (err) {
      reject("ERROR_WITH_FILTER");
    }
  });
}
export const cleanStringLowerCase = (string) => {
  if (string)
    return string.replace(/\\|\s+/g, ' ').trim().toLowerCase()
  return string
}

export const cleanString = (string) => {
  if (string)
    return string.replace(/\\|\s+/g, ' ').trim()
  return string
}


export const getConvertedString = (text) => {
  if (text) {
    text = text.toLowerCase();
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey, 'hex'), Buffer.from(iv, 'hex'));
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return `${iv.toString('hex')}.${encrypted.toString('hex')}`
  }
  return text
};

export const getNormalString = (hash) => {
  try {
  if (hash) {
    const [iv, content] = hash.split('.');
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey, 'hex'), Buffer.from(iv, 'hex'));
    const decrpyted = Buffer.concat([decipher.update(Buffer.from(content, 'hex')), decipher.final()]);
    let finalString = decrpyted.toString();
    return finalString;
  }
  return null;
} catch (err) {
  console.log(err);
  return null;
}
  
};


export const getNormalArray = (array, keys) => {
  let resultArray = []
  if (array) {
    array.forEach(element => {
      keys.forEach(key => {
        if (element[key]) {
          if (typeof element[key] === 'string')
            element[key] = getNormalString(element[key])
          else if (typeof element[key]['en'] === 'string') {
            element[key]['en'] = getNormalString(element[key]['en'])
            element[key]['es'] = getNormalString(element[key]['es'])
          }
        }
      });
      resultArray.push(element);
    });
  }

  return resultArray
}

export const getMailGunConfig = (document, role) => {
  let result = {}
  if (document && role == 3) {
    const { mailgun } = JSON.parse(JSON.stringify(document));
    const { api_key, domain, host } = mailgun;
    result.apiKey = api_key
    result.domain = domain;
    result.host = host;
  } else {
    result.apiKey = MAILGUN.API_KEY;
    result.domain = MAILGUN.DOMAIN;
  }
  return result
}







