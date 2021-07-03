const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();
require('./models/relation-mapping');
require('./models/mongodb');
const {verifyJwt} = require("./services/auth.service");
const {verifyAdmin} = require('./middleware/user.middleware')
const cors = require('cors');

const app = express();
app.use(cors())
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', require('./routes/index'));
app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/user', verifyJwt, require('./routes/user.route'));
app.use('/api/instructor', require('./routes/instructor.route'));
app.use('/api/category', require('./routes/category.route'))
app.use('/api/course', require('./routes/course.route'))
app.use('/api/admin', verifyAdmin, require('./routes/admin.route'));
// app.use('/error', require('./routes/error'));
// app.use('/test', require('./routes/ test'));
// app.use('/cart', require('./routes/cart'));
// app.use('/cart/payment', require('./routes/payment'));
// app.use('/my-courses', require('./routes/my-course'));

app.use(function (err, req, res, next) {
    console.error(err)
    res.status(500).send('Something broke!')
})
const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
    console.log(`app listening on port ${PORT}`);
})
