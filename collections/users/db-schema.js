/*
 * @file: db-schema.js
 * @description: It contains db schema for admin, groupadmin and other admin users.
 * @author: Dinesh Kumar
 */

import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String
        },
        firstName: {
            type: String
        },
        lastName: {
            type: String
        },
        password: {
            type: String,
            select: false
        },
        login_type: {
            type: String,
        },
        token: {
            type: String
        },
        passwordtoken: {
            type: String
        },
        passwordexpiretime: {
            type: Number
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

export default UserSchema;