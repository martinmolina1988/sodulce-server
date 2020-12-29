


require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const multer = require("multer");
const path = require("path");


//Inicializando nuestros modulos

const app = express();
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
require("./database");

//Settings

app.set("port", process.env.PORT || 3000);



app.use(express.static(path.join(__dirname, '/assets/')))
//Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const storage = multer.diskStorage({
    destination: path.join(__dirname, "public/uploads"),
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + path.extname(file.originalname));
    }

})
app.use(multer({ storage }).single('file'));

const upload = multer({ storage });
//Routes
app.use(require("./routes"));



app.listen(app.get("port"), () => {
    console.log("Server on port: " + app.get("port"))
})