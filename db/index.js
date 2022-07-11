/*
 * @file: index.js
 * @description: It contains mongoDB connection setup.
 * @author: Dinesh Kumar
 */

import mongoose from 'mongoose';
import config from 'config';

const { AUTH, DATABASE, HOST, USERNAME, PASSWORD, PORT } = config.get('DB');
const defaultUrl = AUTH
  ? `mongodb://${USERNAME}:${encodeURIComponent(PASSWORD)}@${HOST}:${PORT}/${DATABASE}`
  : `mongodb://${HOST}:${PORT}/${DATABASE}`;

// Connected Database URI

//Export database connection
export const connection = async (url = '') => {
  let MONGO_URL = url ? url : defaultUrl;
  console.log(MONGO_URL,"MONGO_URL")
  try {
    await mongoose.connect(MONGO_URL, {

      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
      // useFindAndModify: false,
      autoIndex: false, // Don't build indexes
      // poolSize: 50,
      // bufferMaxEntries: 0,// Maintain up to 10 socket connections
      // auto_reconnect: true,
    });
    console.log("Database Connected!")
  } catch (err) {
    console.log(`Database not connected!= ${err} `);
  }
};

export const disconnect = async () => await mongoose.connection.close();

export const connectDB = async () => await mongoose.connection.db.databaseName;

