const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let UserSchema = new Schema({
    login: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: Number,
        default: 0

    },
    fullname: {
        type: String,
        default: "-"

    },
    image: {
        type: String,
        default: "-"
    },
    registeredAt: {
        type: Date,
        default: Date.now
    },
    tgLogin: {
        type: String,
        default: ""
    },
    chatId: {
        type: Number,
        default: 0
    },
    subscribes: {
        type: [mongoose.mongo.ObjectId],
        ref: "Character",
    },

});
const UserModel = mongoose.model('User', UserSchema);



class User {
    constructor(login, password, role = -1, fullname = "", image = "", tgLogin = "", subscribes =[], chatId = 0) {

        this.login = login;
        this.password = password;
        this.role = role;
        this.fullname = fullname;
        let dateTmp = new Date();
        this.registeredAt = dateTmp.toISOString();
        this.image = image;
        this.tgLogin = tgLogin;
        this.subscribes = subscribes;
        this.chatId = chatId;
    }
    isAdmin() {
        return this.role === 1;
    }
    static getAll() {
        return UserModel.find().sort({
                created: -1
            })
            .catch((err) => console.log("err in getAll\n" + err));

    }

    static getById(id) {
        return this.getAll()
            .then(charsJsonStr => {
                return charsJsonStr.find((element) => element.id === id);
            })
            .catch((err) => {
                console.log("Error while reading users");
                return err;

            });
    }
    static update(id, newObj) {
        return UserModel.findByIdAndUpdate(id, newObj);
    }
    static insert(user) {
        return new UserModel(user).save()
            .catch((err) => console.log("erro in user insert\n" + err));
    }
    static deleteById(id) {
        return UserModel.findByIdAndDelete(id);
    }
    static findManyById(idArray){
        let queryArray = idArray.map(el=>{
            return mongoose.Types.ObjectId(el);
        });
        return UserModel.find({
            '_id': { $in: queryArray }
        });
    }
    static findByLogin(login) {
        return UserModel.findOne({
            login: login
        });
    }
    static findByTgName(username) {
        return UserModel.findOne({
            tgLogin: username
        });
    }
    static tgUnsubscribe(username) {
        UserModel.updateOne({
            tgLogin: username
        }, {
            chatId: undefined,
            tgLogin: undefined,
            subscribes: []
        });
    }
    static addSubsription(userId, characId) {
        return this.getById(userId)
            .then(us => {
                if (!us.subscribes.includes(characId)) {
                    us.subscribes.push(characId);
                }
                return this.update(userId, us);
            })

    }
    static deleteSubsription(userId, characId) {
        return this.getById(userId)
            .then(us => {
                if (us.subscribes.includes(characId)) {
                    us.subscribes.splice(us.subscribes.indexOf(characId), 1)
                }
                return this.update(userId, us);
            })

    }

    static isAdminById(id) {
        return this.getById(id).then(us => {
            return new Promise.resolve(us.role === 1);
        }).catch(err => {
            return err;
        });
    }
    static aproveTgUser(username, chatId) {
        return UserModel.findOne({
            tgLogin: username
        }).then(result => {
            if (result) {
                if (result.chatId === chatId) {
                    return result
                }
                return UserModel.updateOne({
                    _id: result._id
                }, {
                    chatId: chatId
                });
            }
        })
    }
}

// ------------------------------------------------------------------
module.exports = User;
// ------------------------------------------------------------------