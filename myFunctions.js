const Config = require("./config");
const crypto = require("crypto");


const cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name:Config.cloud_name,
  api_key:Config.api_key,
  api_secret: Config.api_secret,
});

module.exports = {
    cloudinaryUploadPromise: (fileBuffer, ...args) => {
        return new Promise((resolve, reject) => {
            cloudinary.v2.uploader.upload_stream(...args, (err, data) => {
                if (err) return reject(err);
                resolve(data);
            }).end(fileBuffer);;
        });
    },
    resAuthParams: function (user, resParams) {
        // console.log(user);
        if (user) {
            resParams.isAuthorized = true;
            resParams.isAdmin = user.role === 1;
            resParams.userLogin = user.login;
        } else {
            resParams.isAuthorized = false;
            resParams.isAdmin = false;
        }
        return resParams;
    },
    sha512: function(password, salt) {
        const hash = crypto.createHmac('sha512', salt);
        hash.update(password);
        const value = hash.digest('hex');
        return {
          salt: salt,
          passwordHash: value
        };
      },
       checkAuth: function(req, res, next) {
        if (!req.user) return res.sendStatus(401); // 'Not authorized'
        next(); // пропускати далі тільки аутентифікованих
      },
      
       checkAdmin: function(req, res, next) {
        if (!req.user) res.sendStatus(401); // 'Not authorized'
        else if (req.user.role !== 1) res.sendStatus(403); // 'Forbidden'
        else next(); // пропускати далі тільки аутентифікованих із роллю 'admin'
      }
};