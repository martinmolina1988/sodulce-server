const { Schema, model } = require("mongoose");

const Sobremi = new Schema({
    nombre: String,
    sobremi: String
})

module.exports = model("Sobremi", Sobremi);