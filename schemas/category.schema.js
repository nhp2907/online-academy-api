let mongoose = require('mongoose');
const {Schema} = mongoose
const mongoJson = require('@meanie/mongoose-to-json')
const category = new Schema({
    id: String,
    name: {
        type: String,
        minLength: 1
    },
    uniqueName: {
        type: String,
        minLength: 1
    },
    icon: {
        type: String
    },
    level: {
        type: Number,
        required: true
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Category'
    },
    subs: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Category',
        required: function () {
            return this.level > 2
        }
    }]
}, {timestamps: true}).plugin(mongoJson)

const CategoryModel = mongoose.model('Category', category);
module.exports = CategoryModel;