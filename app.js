const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const User = require("./models/user");
require('dotenv').config();
require('./models/relation-mapping');
require('./models/mongodb');
const {verifyJwt} = require("./services/auth.service");
const cors = require('cors');

const app = express();
app.use(cors())
// app.use(session({
//     secret: 'keyboard cat',
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         // secure: true
//     }
// }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', require('./routes/index'));
app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/user', verifyJwt, require('./routes/user.route'));
app.use('/api/category', require('./routes/category.route'))
app.use('/api/course', require('./routes/course.route'))
// app.use('/instructor', require('./routes/instructor'));
// app.use('/admin', require('./routes/admin'));
// app.use('/api/category', require('./api/category.api'));
// app.use('/error', require('./routes/error'));
// app.use('/test', require('./routes/test'));
// app.use('/cart', require('./routes/cart'));
// app.use('/cart/payment', require('./routes/payment'));
// app.use('/my-courses', require('./routes/my-course'));
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})
const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
    console.log(`app listening on port ${PORT}`);
})
