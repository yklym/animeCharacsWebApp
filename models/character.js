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
    description: {
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
    }, 
    subscribers:{
        type: [mongoose.mongo.ObjectId],
        ref: "User",
    }
});
const CharacModel = mongoose.model('Charac', CharacSchema);

class Character {
    constructor(id = -1, name = "", fullname = "", alias = "", titles = [], age = -1, description ="lorem",image = "") {
        this.id = id;
        this.description  = description;
        this.name = name;
        this.alias = alias;
        this.fullname = fullname;
        this.titles = titles;
        this.age = age;
        let dateTmp = new Date();
        this.addedAt = dateTmp.toISOString();
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
            // console.log(stringsArray);

            if (stringsArray.length === 1 && stringsArray[0] === "") {
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
                return resultArray;
            }
        });
    }
    static findManyById(idArray){
        let queryArray = idArray.map(el=>{
            return mongoose.Types.ObjectId(el);
        });
        return CharacModel.find({
            '_id': { $in: queryArray }
        });
    }
    static addSubsription(userId,characId){
        return this.getById(characId)
        .then(char=>{
            if(!char.subscribers.includes(userId)){
                char.subscribers.push(userId);
            }
            return this.update(characId, char);
        })
    }
    static deleteSubsription(userId, characId) {
        return this.getById(characId)
            .then(char => {
                if (char.subscribers.includes(userId)) {
                    char.subscribers.splice(char.subscribers.indexOf(userId), 1)
                }
                return this.update(characId, char);
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