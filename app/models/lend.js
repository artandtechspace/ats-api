const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const LendsSchema = new mongoose.Schema(
    {
        lendId: {
            type: String,
            required: true,
            unique: true
        },
        userId: {
            type: String,
            required: true,
            unique: true
        },
        lendNameCache: {
            type: String,
            required: true,
        },
        lendUserNameCache: {
            type: String,
            required: true,
        },
        end: {
            type: Boolean,
            default: false,
            required: true
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

LendsSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Lends', LendsSchema)
