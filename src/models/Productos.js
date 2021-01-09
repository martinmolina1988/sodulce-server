const { Schema, model } = require("mongoose");

const Productos = new Schema({
    producto: String,
    precio: Number,
    principal: String,
    description: String,
    imageURL: String,
    public_id: String,
    fecha: { type: Date, default: Date.now }
})

module.exports = model("Productos", Productos);