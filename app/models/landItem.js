const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const LendItemSchema = new mongoose.Schema(
    {
        lend: {
            type: String,
            required: true,
            unique: true
        },
        lendName: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: false
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

LendItemSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('LendItem', LendItemSchema)
