const mongoose = require('mongoose')
const validator = require('validator')
const mongoosePaginate = require('mongoose-paginate-v2')

const UserPermissionRevokeSchema = new mongoose.Schema(
    {
        addedAdminId: {
            type: String,
            required: true
        },
        revokeMessage: {
            type: String,
            default: "Reason is not assignt"
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