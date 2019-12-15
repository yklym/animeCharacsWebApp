const express = require("express");
const router = express.Router();

const passport = require('passport');
const hashSalt = require("../config.js").hashSalt;
const {cloudinaryUploadPromise, resAuthParams, sha512} = require("./../myFunctions");
const user = require("./../models/user");
const bodyParser = require('body-parser');
const busboyBodyParser = require('busboy-body-parser');

router.use(bodyParser.urlencoded({
    extended: true
  }));
  router.use(bodyParser.json());
  router.use(busboyBodyParser({
    limit: '5mb'
  }));


// const resAuthParams = config.resAuthParams;
const LocalStrategy = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const session = require('express-session');



router.use(cookieParser());
router.use(session({
  secret: "Some_secret^string",
  resave: false,
  saveUninitialized: true
}));
router.use(passport.initialize());
router.use(passport.session());

passport.use(new LocalStrategy(onLogin));

function onLogin(username, password, done) {
    // console.log(username);
    // console.log(password);
    user.findByLogin(username).then(userDoc => {
        if (!userDoc) {
            console.log("No user in LOcal Strategy");
            return done(null, false, {
                message: 'Incorrect username.'
            });
        }
        if (userDoc.password !== sha512(password, hashSalt).passwordHash) {

            console.log("incorrect pass in LOcal Strategy");
            return done(null, false, {
                message: 'Incorrect password.'
            });
        }
        console.log(`Auth successful for {${username}}`);
        return done(null, userDoc);
    }).catch(err => {
        console.log("ERR in LOcal Strategy");
        console.log(err);
        if (err) return err;
    });
}

router.get('/register', function (req, res) {
    let errorMessage = req.query.error;
    // console.log(errorMessage);
    res.render("register", resAuthParams(req.user, {
        isError: Boolean(errorMessage),
        errorMessage
    }));
});

router.post('/register', function (req, res) {
    // console.log(req);
    if (req.body.psw1 !== req.body.psw2) {
        res.redirect("/auth/register/?error=passwords+doesnt+match");
        return;
    }
    const fileObject = req.files.image;
    const fileBuffer = fileObject.data;


    user.findByLogin(req.body.login).then(isExisting => {
        // console.log(isExisting);
        if (isExisting) {
            res.redirect("/auth/register/?error=Username+already+exists");
        } else {

            let newUser = new user(-1, req.body.login, sha512(req.body.psw1, hashSalt).passwordHash, 0, req.body.fullname);
            user.insert(newUser).then(us => {
                let newUserId = us._id;
                cloudinaryUploadPromise(fileBuffer, {
                    resource_type: 'raw'
                }).then(result => {
                    // console.log(result);
                    newUser.image = result.url;
                    user.update(newUserId, newUser).then(() => {
                        res.redirect("/auth/login");

                    });
                });
            }).catch(err => {
                //  console.log(err);
                res.status(404).send(err);
            });
        }

    });
});

// router.post('/login', passport.authenticate('local', {
//     successRedirect: '/',
//     failureRedirect: '/auth/login',
//   }));

router.get('/login', function (req, res) {
    // console.log("hello");
    res.render("login", resAuthParams(req.user, {}));
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// PASPORT
// router.post('/auth/login', passport.authenticate('local', {
//     successRedirect: '/',
//     failureRedirect: '/auth/login',
// }));

passport.serializeUser(function (us, done) {
    // console.log("serializing" + us);
    done(null, us._id);
});

passport.deserializeUser(function (id, done) {
    // console.log("deserializeUser Id : " + id);
    user.getById(id).then(us => {
        done(null, us);
    }).catch(err => {
        console.log(`err deserealizing uz#${id}`);
        done(err, null);
    });
});

// ----------------------------------

module.exports = router;