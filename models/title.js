// const myShemas = require("./mongoShemas");
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const fs = require("fs");
// // TEST ONLY--------------------------------
// const dbUrl = 'mongodb://localhost:27017/lab5';
// const connectOptions = {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// };

// mongoose.connect(dbUrl, connectOptions)
//     .then(() => console.log('Mongo database connected'))
//     .catch(() => console.log('ERROR: Mongo database not connected'));
// F------------------------------------------

let TitleSchema = new Schema({
    //this.titleId = titleId;
    characters: {
        type: [mongoose.mongo.ObjectId],
        ref: "Character",
    },
    authorAdmin: {
        type: mongoose.mongo.ObjectId,
        ref: "User",
    },
    name: {
        type: String,
        default: "Charac"

    },
    rating: {
        type: Number,
        default: -1,
    },
    yearOfPublishing: {
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
const TitleModel = mongoose.model('Title', TitleSchema);



// const db = mongoose.connection;


// const charactersFilePath = "./data/characters.json";

class Title {
    constructor(id = -1, name = "", authorAdmin = -1, characters = [], rating = -1, yearOfPublishing = -1, addedAt = "", image = "") {
        this.id = id;
        this.authorAdmin = authorAdmin ;
        this.name = name;
        this.rating = rating;
        this.characters = characters;
        this.yearOfPublishing = yearOfPublishing;
        this.addedAt = addedAt;
        this.image = image;
    }
    
    static insert(title) {
        return new TitleModel(title).save();
            // .catch((err) => console.log("erro in charac insert\n" + err));
    }
    static update(id, newObj){
        return TitleModel.findByIdAndUpdate(id, newObj);
    }

    static getAll() {
        return TitleModel.find().sort({created: -1});
            // .catch((err) => console.log("err in getAll\n" + err));

    }

    static getById(id) {
        return TitleModel.findById(id);
    }
    
    static getAllByString(keyString) {
        return this.getAll().then(titles => {
            let stringsArray = keyString.split(" ");
            stringsArray.forEach(element => {
                element.trim();
                element.toLowerCase();
            });
    
            console.log(stringsArray);
    
            if (stringsArray.length === 1 && stringsArray[0] === "") {
                console.log("search string is empty");
                return titles;
            } else {
                let resultArray = new Array();
    
                for (let tmpTitle of titles) {
                    for (let keyword of stringsArray) {
                        let isName = tmpTitle.name.toLowerCase().includes(keyword);
                        let isCharac = tmpTitle.characters.filter(elem=>{
                            return elem == keyword;
                        });
                        if (isName || isCharac) {
                            // console.log(charac);
                            resultArray.push(tmpTitle);
                        }
                    }
                }
                // console.log("======================");
                // console.log(characs);
                return resultArray;
            }
        });
    }
    static deleteById(id) {return TitleModel.findByIdAndDelete(id);}
}
// ------------------------------------------------------------------
module.exports = Title;

// ADDING Titles
// const fs = require("fs");
// let tmpCharacs = JSON.parse(fs.readFileSync('../data/titles.json', "utf8")).titles;
// console.log(tmpCharacs);
// tmpCharacs.forEach(elem=>Title.insert(elem));
