const mongoose = require('mongoose');
const dbUrl = process.env.DB_URL;
mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(res => {
        console.log("connected to mongodb")
    });