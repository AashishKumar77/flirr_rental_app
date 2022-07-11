/*
 * @file: db-schema.js
 * @description: It contains db schema for admin, groupadmin and other admin users.
 * @author: Dinesh Kumar
 */

import mongoose from 'mongoose';
var Schema = mongoose.Schema;
const UserUnitSchema = new mongoose.Schema(
    {
        userid: {
        type: String,
        ref: 'user',
        },
        address: {
            type: String
        },
        city: {
            type: String
        },
        postalcode: {
            type: Number
        },
        unittype: {
           type: Schema.Types.ObjectId,
           ref: 'unittypes',
        },
        bedroom: {
            type: String,
        },
        bathroom: {
            type: String
        },
        halfbathroom: {
            type: String
        },
        aboutUnit: [{
            type: Schema.Types.ObjectId,
             ref: 'unitinfo',
        }],
        createdAt: {
            type: Number
        },
        updatedAt: {
            type: Number
        }
    },
    {
        versionKey: false,
        // Make Mongoose use Unix time (seconds since Jan 1, 1970)
        timestamps: { currentTime: () => Date.now() }
    }
);

export default UserUnitSchema;