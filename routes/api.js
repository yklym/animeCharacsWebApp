const express = require("express");
const router = express.Router();
const {
    cloudinaryUploadPromise,
    sha512,
    // checkAuth,
    checkAdmin
} = require("./../myFunctions");
const cors = require("cors");
const {
    hashSalt,
    pageSize,
    api_secret
} = require("./../config");
const user = require("./../models/user");
const title = require("./../models/title");
const character = require("./../models/character");

const jwt = require('jsonwebtoken');
const busboyBodyParser = require('busboy-body-parser');
const cookieParser = require('cookie-parser');
const bot = require("../bot");

router.use(cookieParser());

router.use(cors())
// router.use(bodyParser);
router.use(express.json()); //Used to parse JSON bodies

router.use(busboyBodyParser({
    limit: '5mb'
}));

const passport = require('passport');


const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: api_secret
}

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    // console.log(jwt_payload);
    user.findByLogin(jwt_payload.username).then(userDoc => {
        if (!userDoc) {
            return done(null, false, {
                message: 'Incorrect username.'
            });
        }
        return done(null, userDoc);
    }).catch(err => {
        if (err) return err;
    });

}));
router.use(passport.initialize());

const checkAuth = passport.authenticate("jwt", {
    session: false
});

//@part HANDLERS


// @part JWT TEST

router.post('/auth/login', function (req, res) {
    console.log("------------------------");
    const {
        username,
        password
    } = req.body;
    console.log(req.body);

    user.findByLogin(username).then(userDoc => {
        if (!userDoc) {
            console.log("Wrong login");
            res.status(401).json({
                err: "wrong login"
            });
            return;
        }
        if (userDoc.password !== sha512(password, hashSalt).passwordHash) {
            console.log("incorrect pass ");
            res.status(401).json({
                err: "wrong password"
            });
            return;
        }
        console.log(`Auth successful for {${username}}`);
        console.log(userDoc);
        const token = jwt.sign({
            role: userDoc.role,
            username: userDoc.login,
            tgLogin: userDoc.tgLogin,
            _id: userDoc._id,
        }, api_secret, {
            expiresIn: '10h'
        });
        const decodedToken = jwt.decode(token);
        // console.log("Decoded token");
        // console.log(decodedToken);

        const response = {
            token: `${token}`,
        };

        res.status(200).json({
            response: response
        })

        return userDoc;
    }).catch(err => {
        console.log("ERR");
        console.log(err);
        res.status(401).json({
            reqErr: err
        });
    });



    // Issue token


});


router.post('/auth/register', function (req, res) {
    console.log(req.body);

    user.findByLogin(req.body.login).then(isExisting => {
        // console.log(isExisting);
        if (isExisting) {
            res.status(400).json("Login already exists");
        } else {

            let newUser = new user(req.body.login, sha512(req.body.password1, hashSalt).passwordHash, 0, req.body.fullname, "http://res.cloudinary.com/yarklym/raw/upload/v1576089587/d481pfwz7g2msze9ft9g");
            user.insert(newUser)
                .then(us => {
                    res.status(200).json({
                        login: us.login
                    });

                }).catch(err => {
                    //  console.log(err);
                    res.status(404).send(err);
                });
        }

    });

});


router.get('/auth/checkToken', checkAuth, function (req, res) {
    console.log("REQ WAS GOT");
    if (req.user) {
        const token = jwt.sign({
            role: req.user.role,
            username: req.user.login,
            _id: req.user._id,
            tgLogin: req.user.tgLogin,
        }, api_secret, {
            expiresIn: '1h'
        });
        // const decodedToken = jwt.decode(token);
        // console.log("Decoded token");
        // console.log(decodedToken);

        const response = {
            token: `${token}`,
        };
        res.status(201).json(response);
    } else {
        res.sendStatus(401).json({
            token: false
        }); // 'Not authorized'
    }

});

// @part USER
router.post('/createSubscription', checkAuth, function (req, res) {
    let characId = req.body.characId;
    let userId = req.body.userId;
    user.getById(userId).then(us => {
        bot.sendMessage(us.chatId, `You've subscribed to new element!`);
    }).then(() => {
        user.addSubsription(userId, characId)
            .then(res => {
                return character.addSubsription(userId, characId);
            }).then(charac => {
                if (!charac.subscribers.includes(userId)) {
                    charac.subscribers.push(userId);
                }
                res.status(200).json(charac);
            }).catch(err => {
                console.log(err);
            })
    })
});

router.post('/deleteSubscription', checkAuth, function (req, res) {
    let characId = req.body.characId;
    let userId = req.body.userId;
    console.log("deleteSubs:");

    user.deleteSubsription(userId, characId)
        .then(res => {
            return character.deleteSubsription(userId, characId);
        }).then(charac => {
            if (charac.subscribers.includes(userId)) {
                charac.subscribers.splice(charac.subscribers.indexOf(userId), 1)
            }
            res.status(200).json(charac);
        }).catch(err => {
            console.log(err);
        })
});

router.get('/users', checkAuth, checkAdmin, function (req, res) {
    let currPageNumber = parseInt(req.query.page);

    if (!currPageNumber || currPageNumber <= 0) {
        currPageNumber = 1;
    }
    user.getAll().then(userList => {
        let pagesAmount = Math.ceil(userList.length / pageSize);
        if (currPageNumber >= pagesAmount) {
            currPageNumber = pagesAmount;
        }
        let pageBufIndex = (currPageNumber - 1) * pageSize;
        let resUsers = userList.splice(pageBufIndex, pageSize);
        res.json({
            resUsers,
            pagesAmount
        });
    }).catch(err => {
        res.status(404).json({
            "err": err
        });
    });
});

router.get('/users/:id', checkAuth, function (req, res) {
    let id = req.params.id;
    console.log(`/api/v1/users/${id} send`);
    user.getById(id).then(targetUser => {
        res.json(targetUser);
    }).catch(err => {
        res.status(404).json({
            "err": err
        });
    });
});
router.delete('/users/:id', checkAuth, checkAdmin, function (req, res) {
    let id = req.params.id;
    console.log(`/api/v1/users/${id} - delete send`);
    user.deleteById(id).then(result => {
        if (result === null) {
            return Promise.reject("no element with this id");
        }
        res.json(result);
    }).catch(err => {
        res.status(404).json({
            "err": err
        });
    });
});

router.put('/users/:id', checkAuth, function (req, res) {
    let id = req.params.id;
    let body = req.body;
    console.log(body);
    

    if (!req.files.image) {
        req.body.image = req.body.imageUrl;
        user.update(id, body)
            .then(updatingResult => {
                res.status(200).json(updatingResult);
            }).catch(err => {
                res.status(404).json({
                    "err": err
                });
            });
    } else {
        let fileObject;
        let fileBuffer;
        fileObject = req.files.image;
        if (!fileObject) {
            res.status(404).send("problems with file");
        }
        fileBuffer = fileObject.data;

        return cloudinaryUploadPromise(fileBuffer, {
            resource_type: 'raw'
        }).then(result => {
            body.image = result.url;
            return user.update(id, body);
        }).then(updatingResult => {
            res.json(updatingResult);
        }).catch(err => {
            res.status(404).json({
                "err": err
            });
        });
    }

});
// @part Charac
// , checkAuth, 
router.get('/charactersGetAll', checkAuth, function (req, res) {
    character.getAll().then(result => {
        res.status(200).json(result);
    })
});
router.get('/characters', checkAuth, function (req, res) {
    let searchWord = req.query.search || "";
    let currPageNumber = parseInt(req.query.page);
    if (!currPageNumber || currPageNumber <= 0) {
        currPageNumber = 1;
    }
    console.log(`/api/v1/characters send`);
    character.getAllByString(searchWord).then(characsList => {
        let pagesAmount = Math.ceil(characsList.length / pageSize);
        if (currPageNumber >= pagesAmount) {
            currPageNumber = pagesAmount;
        }
        let pageBufIndex = (currPageNumber - 1) * pageSize;
        let resCharacs = characsList.splice(pageBufIndex, pageSize);
        // 

        res.json({
            resCharacs,
            pagesAmount
        });
    }).catch(err => {
        res.status(404).json({
            "err": err
        });
    });
});
// checkAuth,
router.get('/characters/:id', checkAuth, function (req, res) {
    let id = req.params.id;
    console.log(`/api/v1/characters/${id} send`);
    character.getById(id).then(targetCharacter => {
        if (targetCharacter === null) {
            return Promise.reject("No character with this id");
        }
        res.json(targetCharacter);
    }).catch(err => {
        res.status(404).json({
            "err": err
        });
    });
});

router.delete('/characters/:id', checkAuth, checkAdmin, function (req, res) {
    let id = req.params.id;
    console.log(`/api/v1/characters/${id} - delete send`);
    character.deleteById(id).then(result => {
        if (result === null) {
            return Promise.reject("no element with this id");
        }
        res.json(result);
    }).catch(err => {
        res.status(404).json({
            "err": err
        });
    });
});

router.post('/characters', checkAuth, checkAdmin, function (req, res) {
    console.log("POST CHARACTERS REQ:")
    console.log(req.files);
    let body = req.body;
    let fileObject;
    let fileBuffer;
    fileObject = req.files.characPic;

    if (!fileObject) {
        res.status(404).send("problems with file");
    }
    fileBuffer = fileObject.data;
    cloudinaryUploadPromise(fileBuffer, {
        resource_type: 'raw'
    }).then(result => {
        body.image = result.url;
        return character.insert(body);
    }).then(finRes => {
        console.log(finRes);
        res.status(201).json(finRes);
    }).catch(err => {
        res.status(404).json({
            "err": err
        });
    });
});


router.put('/characters/:id', checkAuth, checkAdmin, function (req, res) {
    let id = req.params.id;
    let body = req.body;
    console.log("Update character");
    if (!req.files.image) {

        body.image = body.imageUrl;
        return character.update(id, body)
            .then(updatingResult => {

                res.json(updatingResult);
                return user.findManyById(updatingResult.subscribers);
            }).catch(err => {
                res.status(404).json({
                    "err": err
                });
            }).then((usArr)=>{
                console.log(usArr);
                usArr.forEach(userEl=>{
                    bot.sendMessage(userEl.chatId, `It seems one of your favourite characs ${body.name} has been updated!`);
                });
            })
    } else {
        let fileObject;
        let fileBuffer;
        console.log("Saving image");
        fileObject = req.files.image;
        if (!fileObject) {
            res.status(404).send("problems with file");
        }
        fileBuffer = fileObject.data;


        return cloudinaryUploadPromise(fileBuffer, {
            resource_type: 'raw'
        }).then(result => {
            body.image = result.url;
            return character.update(id, body);
        }).then(updatingResult => {
            res.json(updatingResult);
        }).catch(err => {
            res.status(404).json({
                "err": err
            });
        });
    }

});
// @part Title

router.get('/titles', checkAuth, checkAuth, function (req, res) {
    let searchWord = req.query.search || "";
    let currPageNumber = parseInt(req.query.page);
    if (!currPageNumber || currPageNumber <= 0) {
        currPageNumber = 1;
    }
    console.log(`/api/v1/titles send`);
    title.getAllByString(searchWord).then(titlesList => {
        let pagesAmount = Math.ceil(titlesList.length / pageSize);
        if (currPageNumber >= pagesAmount) {
            currPageNumber = pagesAmount;
        }
        let pageBufIndex = (currPageNumber - 1) * pageSize;
        let resTitles = titlesList.splice(pageBufIndex, pageSize);

        res.json({
            resTitles,
            pagesAmount
        });
    }).catch(err => {
        res.status(404).json({
            "err": err
        });
    });
});

router.get('/titles/:id', checkAuth, checkAuth, function (req, res) {
    let id = req.params.id;
    console.log(`/api/v1/titles/${id} send`);
    title.getById(id).then(targetTitles => {
        res.json(targetTitles);
    }).catch(err => {
        res.status(404).json({
            "err": err
        });
    });
});

router.delete('/titles/:id', checkAuth, checkAdmin, function (req, res) {
    let id = req.params.id;
    console.log(`/api/v1/titles/${id} - delete send`);
    title.deleteById(id).then(result => {
        if (result === null) {
            return Promise.reject("no element with this id");
        }
        res.json(result);
    }).catch(err => {
        res.status(404).json({
            "err": err
        });
    });
});

router.post('/titles', checkAuth, checkAdmin, function (req, res) {
    let body = req.body;
    let fileObject;
    let fileBuffer;
    fileObject = req.files.titlePict;

    if (!fileObject) {
        res.status(404).send("problems with file");
    }
    fileBuffer = fileObject.data;

    cloudinaryUploadPromise(fileBuffer, {
        resource_type: 'raw'
    }).then(result => {
        body.image = result.url;
        return title.insert(body);
    }).then(finRes => {
        res.status(201).json(finRes);
    }).catch(err => {
        res.status(404).json({
            "err": err
        });
    });
});


router.put('/titles/:id', checkAuth, checkAdmin, function (req, res) {
    let id = req.params.id;
    let body = req.body;

    let fileObject;
    let fileBuffer;
    fileObject = req.files.titlePict;
    if (!fileObject) {
        res.status(404).send("problems with file");
    }
    fileBuffer = fileObject.data;

    cloudinaryUploadPromise(fileBuffer, {
        resource_type: 'raw'
    }).then(result => {
        body.image = result.url;
        return title.update(id, body);
    }).then(updatingResult => {
        res.json(updatingResult);
    }).catch(err => {
        res.status(404).json({
            "err": err
        });
    });
});
// @part ADMIN

router.post('/admin/title/deleteCharac/:characId', checkAuth, checkAdmin, function (req, res) {
    let titleId = req.headers.referer.split("/").pop();
    let characId = req.params.characId;

    let resCharac;
    character.getById(characId)
        .then((charac) => {
            charac.titles.splice(charac.titles.indexOf(titleId), 1);
            character.update(characId, charac)
                .then(() => {
                    title.getById(titleId)
                        .then(tit => {
                            tit.characters.splice(tit.characters.indexOf(characId), 1);
                            title.update(titleId, tit)
                                .then(() => res.status(200)).json(resCharac);
                        });
                });
        }).catch(err => {
            //  console.log(err);
            res.status(404).json({
                err: err
            });
        });
});

router.post('/admin/title/addCharac/:characId', checkAuth, checkAdmin, function (req, res) {
    let titleId = req.headers.referer.split("/").pop();
    let characId = req.params.characId;

    character.getById(characId).then((charac) => {
            charac.titles.push(titleId);
            return character.update(characId, charac);
        }).then((newCharac) => {
            return title.getById(titleId)
        }).then(tit => {
            tit.characters.push(characId);
            title.update(titleId, tit)

            res.status(200);
        })
        .catch(err => {
            //  console.log(err);
            res.status(404).json({
                err: err
            });
        });
});
// -----------------------------------------
module.exports = router;