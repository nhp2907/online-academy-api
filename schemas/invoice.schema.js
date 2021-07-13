let mongoose = require('mongoose');
const {Schema} = mongoose
const mongoJson = require('@meanie/mongoose-to-json')
const invoiceSchema = new Schema({
    name: String,
    courseId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'course',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'user'
    },
    price: {
        type: Number,
        required: true,
    },
    note: {
        type: String,
    },
}, {timestamps: true}).plugin(mongoJson)

const InvoiceModel = mongoose.model('Invoice', invoiceSchema);
module.exports = InvoiceModel;