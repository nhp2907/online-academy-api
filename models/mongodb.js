const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/online-academy', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(res => {
        console.log("connected to mongodb")
    });