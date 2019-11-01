const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CharacSchema = new Schema({
    
    titles: {
        type: [mongoose.mongo.ObjectId],
        ref: "Title",
    },

    alias: {
        type: String,
        default: "-"
    },
    name: {
        type: String,
        default: "Charac"

    },
    fullname: {
        type: String,
        default: "-"

    },
    age: {
        type: Number,
        default: -1
    },
    image: {
        type: String,
        default: "-"
    },
    addedAt: {
        type: Date,
        default: Date.now
    }
});
const CharacModel = mongoose.model('Charac', CharacSchema);

// const fs = require("fs");
// TEST ONLY--------------------------------
// const dbUrl = 'mongodb://localhost:27017/lab5';
// const connectOptions = {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// };

// mongoose.connect(dbUrl, connectOptions)
//     .then(() => console.log('Mongo database connected'))
//     .catch(() => console.log('ERROR: Mongo database not connected'));
// F------------------------------------------


// const db = mongoose.connection;


// const charactersFilePath = "./data/characters.json";

class Character {
    constructor(id = -1, name = "", fullname = "", alias = "", titles = [], age = -1, addedAt = "", image = "") {
        this.id = id;
        this.name = name;
        this.alias = alias;
        this.fullname = fullname;
        this.titles = titles;
        this.age = age;
        this.addedAt = addedAt;
        this.image = image;
    }

    static insert(charac) {
        return new CharacModel(charac).save();
        // .catch((err) => console.log("erro in charac insert\n" + err));
    }
    static update(id, newObj) {
        return CharacModel.findByIdAndUpdate(id, newObj);
    }

    static getAll() {
        return CharacModel.find().sort({
            created: -1
        });
        // .catch((err) => console.log("err in getAll\n" + err));

    }

    static getById(id) {
        return CharacModel.findById(id);
    }

    static getAllByString(keyString) {
        return this.getAll().then(characs => {
            let stringsArray = keyString.split(" ");
            stringsArray.forEach(element => {
                element.trim();
                element.toLowerCase();
            });

            console.log(stringsArray);

            if (stringsArray.length === 1 && stringsArray[0] === "") {
                console.log("search string is empty");
                return characs;
            } else {
                let resultArray = new Array();

                for (let charac of characs) {
                    for (let keyword of stringsArray) {
                        let isName = charac.name.toLowerCase().includes(keyword);
                        let isFullname = charac.fullname.toLowerCase().includes(keyword);
                        let isAlias = charac.alias.toLowerCase().includes(keyword);
                        if (isName || isFullname || isAlias) {
                            // console.log(charac);
                            resultArray.push(charac);
                        }
                    }
                }
                // console.log("======================");
                // console.log(characs);
                return resultArray;
            }
        });
    }
    static deleteById(id) {
        return CharacModel.findByIdAndDelete(id);
    }
}
// ------------------------------------------------------------------
module.exports = Character;

// ADDING CHARACTERS
// const fs = require("fs");
// let tmpCharacs = JSON.parse(fs.readFileSync('../data/characters.json', "utf8")).characters;
// console.log(tmpCharacs);
// tmpCharacs.forEach(elem=>Character.insert(elem));

// Character.getAll().then(x =>console.log(x)).catch(x=>console.log(x));