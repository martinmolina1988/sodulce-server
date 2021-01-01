const { Schema, model } = require("mongoose");

const Banner = new Schema({
    nombre: String,
    public_id: String,
    secure_url: String
})

module.exports = model("Banner", Banner);