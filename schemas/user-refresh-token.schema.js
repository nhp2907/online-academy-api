let mongoose = require('mongoose');
const {Schema} = mongoose
const mongoJson = require('@meanie/mongoose-to-json')
const userRefreshTokenSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true
    },
    refreshToken: {
        type:String,
        required: true
    }
}, {timestamps: true}).plugin(mongoJson)

const UserRtModel = mongoose.model('user_refresh_token', userRefreshTokenSchema);
module.exports = UserRtModel;