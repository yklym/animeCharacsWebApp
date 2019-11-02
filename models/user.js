const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let UserSchema = new Schema({
    login: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        default: 0

    },
    fullname: {
        type: String,
        default: "-"

    },
    avaUrl: {
        type: String,
        default: "-"
    },
    registeredAt: {
        type: Date,
        default: Date.now
    }
});
const UserModel = mongoose.model('User', UserSchema);

// FOR TESTING ONLY--------------------------

// const dbUrl = 'mongodb://localhost:27017/lab5';
// const connectOptions = {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// };

// mongoose.connect(dbUrl, connectOptions)
//     .then(() => console.log('Mongo database connected'))
//     .catch(() => console.log('ERROR: Mongo database not connected'));
// F------------------------------------------

class User {
    constructor(id = -1, login = "", role = -1, fullname = "", registeredAt = "", avaUrl = "", isDisabled = false) {
        this.id = id;
        this.login = login;
        this.role = role;
        this.fullname = fullname;
        this.registeredAt = registeredAt;
        this.avaUrl = avaUrl;
        this.isDisabled = isDisabled;
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

    static insert(user) {
        return new UserModel(user).save()
            .catch((err) => console.log("erro in user insert\n" + err));
    }
}

// ------------------------------------------------------------------
module.exports = User;
// ------------------------------------------------------------------