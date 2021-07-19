const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://admin:admin@cluster0.5uqc6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(res => {
        console.log("connected to mongodb")
    });