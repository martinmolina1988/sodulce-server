const { Schema, model } = require("mongoose");

const Productos = new Schema({
    producto: String,
    precio: Number,
    principal: String,
    description: String,
    imageURL: String,
    public_id: String
})

module.exports = model("Productos", Productos);