const mongoose = require("mongoose")
mongoose.connect(process.env.MongoAtlasUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(db => console.log("Conectado a la base de datos")).catch(err => console.error(err));

