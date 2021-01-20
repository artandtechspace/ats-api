const mongoose = require('mongoose')

const UserPermissionAccessSchema = new mongoose.Schema(
    {
        userid: {
            type: String,
            required: true
        },
        userNameCache: {
            type: String,
            required: true
        },
        permissionId: {
            type: String,
            required: true
        },
        permissionNameCache: {
            type: String,
            required: true
        },
        end: {
            type: Boolean,
            default: false,
            required:true
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

module.exports = mongoose.model('UserPermissionAccess', UserPermissionAccessSchema)
