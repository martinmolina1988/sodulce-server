const { Schema, model } = require("mongoose");

const Logo = new Schema({
    nombre: String,
    public_id: String,
    secure_url: String
})

module.exports = model("Logo", Logo);