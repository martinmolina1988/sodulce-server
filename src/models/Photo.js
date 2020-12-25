const { Schema, model } = require("mongoose");

const Photo = new Schema({
    imageURL: String,
    producto: String,
    public_id: String
})

module.exports = model("Photo", Photo);