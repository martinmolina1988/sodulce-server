const { Schema, model } = require("mongoose");

const Products = new Schema({
    producto: [String]
})

module.exports = model("Products", Products);