const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const UserPermissionRevokeSchema = new mongoose.Schema(
    {
        permissionIdLink: {
            type: String,
            required: true
        },
        addedAdminId: {
            type: String,
            required: true
        },
        revokeMessage: {
            type: String
        },
        revokeIsActive: {
            type: Boolean,
            default: true,
            required: true
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
)
UserPermissionRevokeSchema.plugin(mongoosePaginate)

module.exports = UserPermissionRevokeSchema