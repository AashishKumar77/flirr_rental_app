/*
 * @file: index.js
 * @description: It contains function layer for user collection.
 * @author: Dinesh Kumar
 */

import mongoose from 'mongoose';
import DbSchema from './db-schema.js';

class Userunit {
  static saveUser(payload) {
    return this(payload).save();
  }
  static checkEmail(email) {
    return this.findOne({ email });
  }
static fetch(email) {
    return this.find({ email });
  }
  static findOneByCondition(condition) {
    return this.findOne(condition);
  }

  static updateUserById(userId, payload) {
    let updateData = {
      $set: payload
    };
    return this.findByIdAndUpdate(userId, updateData, { new: true });
  }
  
}

DbSchema.loadClass(Userunit);

export default mongoose.model('Userunit', DbSchema, 'Userunit');
