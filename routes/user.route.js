const fs = require('fs');
const express = require('express')
const UserService = require("../services/user.service");
const router = express.Router();

const multer = require('multer')
const USER_IMAGE_PATH = "public/assets/images/users/";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, USER_IMAGE_PATH)
    },
    filename: function (req, file, cb) {
        let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
        cb(null, Date.now() + ext)
    }
})
const upload = multer({storage: storage});

router.get('/auth', (req, res) => {
    if (req.cookies.token) {
        res.redirect('/');
    }
    res.render('pages/auth', {
        layout: 'blank',
        css: ['auth']
    })
})

router.get('/me', async (req, res) => {
    const user = res.locals.user;
    if (!user) {
        res.status(401).send({
            message: 'Invalid token'
        })
    } else {
        delete user.password
        res.send(user);
    }
})

router.put('/update-basic-info', async (req, res) => {
    const user = req.body
    user.id = res.locals.user.id;
    // validate if necessary
    const updatedUser = await UserService.updateBasicInfo(user).then(r => console.log('update user basic info successfully', r));
    res.locals.user = updatedUser;

    res.json(updatedUser);
})

router.post('/update-avatar', upload.single('avatar'), async (req, res) => {
    const file = req.file;
    if (!file) {
        res.redirect('/user/me')
    }
    console.log(file)
    const oldPath = res.locals.user.image;
    const user = await UserService.updateBasicInfo({
        id: res.locals.user.id,
        image: 'assets/images/users/' + file.filename
    })
        .then(r => console.log('update avatar', r));
    res.locals.user = user;
    fs.rmSync(`public/` + oldPath, {
        force: true,
    });
    res.status(200).send({
        message: "success"
    })
})

router.post('/update-password', async (req, res) => {
    const {oldPassword, newPassword} = req.body
    console.log(req.body);
    // validate if need
    const token = await UserService.updatePassword(res.locals.user.id, oldPassword, newPassword);
    console.log('update password new token: ', token);
    if (token != null) {
        res.send({
            message: 'success'
        })
    } else {
      res.status(401).send({
          message: "Incorrect password"
      })
    }
})

module.exports = router;