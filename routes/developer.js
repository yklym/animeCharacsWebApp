const express = require("express");
const router = express.Router();
const auth = require('basic-auth');

const passport = require('passport');
const consolidate = require('consolidate');
const path = require('path');

//
// view engine setup



router.get('/', function (req, res) {
    console.log(`/developer/v1 send`);
    // console.log(errorMessage);
    res.render("v1");
});

module.exports = router;