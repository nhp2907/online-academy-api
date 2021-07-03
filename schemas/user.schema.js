let mongoose = require('mongoose');
const {Schema} = mongoose
const mongoJson = require('@meanie/mongoose-to-json')
const userSchema = new Schema({
   firstName: {
       type: String,
       required: true
   },
   lastName: {
       type: String,
       required: true
   },
   username: {
       type: String,
       required: true
   },
   password: {
       type: String,
       required: true
   },
   email: {
       type: String,
       required: true
   },
   role: {
       type: String,
       required: true
   },
   roleId: {
       type: Number,
       required: true
   },
   status: {
       type: Boolean,
       default: true
   }
}, {timestamps: true}).plugin(mongoJson)

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;