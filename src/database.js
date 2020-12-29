const mongoose = require("mongoose")
mongoose.connect("mongodb+srv://martin:dodoria@cluster0-gdxja.mongodb.net/sodulce?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(db => console.log("Conectado a la base de datos")).catch(err => console.error(err));
