/*
 * @file: db-schema.js
 * @description: It contains db schema for admin, groupadmin and other admin users.
 * @author: Dinesh Kumar
 */

import mongoose from 'mongoose';

const UnitTypesSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            enum : ['Appartment or Condo','Single-Family','Multi-Family']
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

export default UnitTypesSchema;