const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();
// require('./models/relation-mapping');
require('./models/mongodb');
const {verifyAdmin, verifyJwt, verifyInstructor} = require('./middleware/user.middleware')
const cors = require('cors');
const {verifyInvoice} = require("./middleware/learning.middleware");

const app = express();
app.use(cors())
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', require('./routes/index'));
app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/home', require('./routes/home.route'))
app.use('/api/validate', require('./routes/validate.route'));
app.use('/api/user', verifyJwt, require('./routes/user.route'));
app.use('/api/instructor', verifyJwt, verifyInstructor, require('./routes/instructor.route'));
app.use('/api/public/instructor', require('./routes/instructor-public.route'));
app.use('/api/admin',verifyJwt, verifyAdmin, require('./routes/admin.route'));
app.use('/api/category', require('./routes/category.route'))
app.use('/api/course', require('./routes/course.route'))
app.use('/api/learning', verifyJwt, verifyInvoice, require('./routes/learning.route'))

// Creates the endpoint for our webhook
app.post('/webhook', (req, res) => {

    let body = req.body;
    console.log(body);

    // Checks this is an event from a page subscription
    if (body.object === 'page') {

        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach(function(entry) {

            // Gets the message. entry.messaging is an array, but
            // will only ever contain one message, so we get index 0
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);
        });

        // Returns a '200 OK' response to all requests
        res.status(200).send('EVENT_RECEIVED');
    } else {
        // Returns a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }

});

// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = "nhp2907"

    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {

            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);

        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
});

app.use(function (err, req, res, next) {
    console.error(err)
    res.status(500).send('Something broke!')
})
const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
    console.log(`app listening on port ${PORT}`);
})
