/*
 * @file: index.js
 * @description: It contains function layer for user collection.
 * @author: Dinesh Kumar
 */

import mongoose from 'mongoose';
import DbSchema from './db-schema.js';

class UnitInfo {
  static saveData(payload) {
    return this(payload).save();
  }
  static checkExist(email) {
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

DbSchema.loadClass(UnitInfo);

export default mongoose.model('unitinfo', DbSchema, 'unitinfo');
