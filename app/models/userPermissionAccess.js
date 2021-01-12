const mongoose = require('mongoose')
const validator = require('validator')

const UserPermissionAccessSchema = new mongoose.Schema(
    {
        userid: {
            type: String,
            required: true
        },
        permissionId: {
            type: String,
            required: true
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
)
module.exports = mongoose.model('UserPermissionAccess', UserPermissionAccessSchema)
