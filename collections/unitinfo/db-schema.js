/*
 * @file: db-schema.js
 * @description: It contains db schema for admin, groupadmin and other admin users.
 * @author: Dinesh Kumar
 */

import mongoose from 'mongoose';

const UnitInfoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        status: {
            type: Number,
        },
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

export default UnitInfoSchema;