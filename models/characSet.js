const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CharacSetSchema = new Schema({
    
    characs: {
        type: [mongoose.mongo.ObjectId],
        ref: "Character",
    },
    name: {
        type: String,
        default: "Charac"
    },
    description: {
        type: String,
        default: "Charac"
    },
    addedAt: {
        type: Date,
        default: Date.now
    }, 
});
const CharacSetModel = mongoose.model('CharacSet', CharacSetSchema);

class CharacterSet {
    constructor(name = "", characs = [], description ="lorem") {
        this.description  = description;
        this.name = name;
        this.description = description;
        this.characs = characs;
        let dateTmp = new Date();
        this.addedAt = dateTmp.toISOString();
    }

    static insert(charac) {
        return new CharacSetModel(charac).save();
    }
    static update(id, newObj) {
        return CharacSetModel.findByIdAndUpdate(id, newObj);
    }

    static getAll() {
        return CharacSetModel.find().sort({
            created: -1
        });
    }

    static getById(id) {
        return CharacSetModel.findById(id);
    }
    static deleteById(id) {
        return CharacSetModel.findByIdAndDelete(id);
    }
}
// ------------------------------------------------------------------


module.exports = CharacterSet;
