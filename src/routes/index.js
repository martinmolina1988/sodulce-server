const { Router } = require("express");
const router = Router();

var cors = require('cors')
var corsOptions = {
    origin: 'https://martinmolina1988.github.io',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
const Sobremi = require("../models/Sobremi");
const Photo = require("../models/Photo");
const Products = require("../models/Products");
const Banner = require("../models/Banner");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINATY_CLOUD_NAME,
    api_key: process.env.CLOUDINATY_API_KEY,
    api_secret: process.env.CLOUDINATY_API_SECRET
})
const fs = require("fs-extra");
const Productos = require("../models/Productos");


const User = require('../models/User');
const verifyToken = require('./verifyToken')

const jwt = require('jsonwebtoken');


router.get('/', async (req, res) => {
    const photos = await Photo.find().lean();
    res.send("Hello")
});




router.post("/uploadimage", async (req, res) => {
    console.log(req.body.producto);
    const { producto, principal, secure_url, public_id } = req.body;
    const newPhoto = new Photo({

        producto,
        imageURL: secure_url,
        public_id: public_id

    })
    await newPhoto.save();
})
router.post("/editimage", async (req, res) => {
    const { _id, producto, secure_url, public_id } = req.body;
    console.log(req.body);
    const newPhoto = new Photo({

        producto,
        imageURL: secure_url,
        public_id: public_id

    })
    Productos.updateOne(
        { "_id": _id },
        { $set: { principal: secure_url } },
        function (err, result) {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        }
    );
    await newPhoto.save();
})

router.post("/insertoProducto", async (req, res, next) => {
    try {
        const { description, producto, precio, secure_url, public_id } = req.body;
        console.log(req.body)
        const nuevoProducto = new Productos({
            producto,
            precio,
            description,
            principal: secure_url,
            imageURL: secure_url,
            public_id: public_id

        })

        const newPhoto = new Photo({
            producto,
            imageURL: secure_url,
            public_id: public_id

        })

        await nuevoProducto.save();
        await newPhoto.save();
        res.send("OK");
    } catch (err) {
        next(err);
    }

})

router.post("/agregoProducto", cors(corsOptions), async (req, res) => {
    const { producto } = req.body;
    Products.updateOne(
        { "nombre": "sodulce" },
        { $addToSet: { producto: producto } },
        function (err, result) {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        }
    );
})


router.post("/editoProducto", cors(corsOptions), async (req, res) => {
    const { _id, producto, description, precio } = req.body;
    Productos.updateOne(
        { "_id": _id },
        { $set: { producto, description, precio } },
        function (err, result) {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        }
    );
})
router.post("/editoBanner", cors(corsOptions), async (req, res) => {
    const { public_id, secure_url } = req.body;

    try {
        const result = await Banner.find({ "_id": "5fee65440ac577207cb855ca" });
        const cloud = await cloudinary.uploader.destroy(result[0].public_id)

        await Banner.update(
            { "_id": "5fee65440ac577207cb855ca" },
            {
                $set: {
                    secure_url: secure_url,
                    public_id: public_id
                }
            },
            function (err, result) {
                if (err) {
                    res.send(err);
                } else {
                    res.send(result);
                }
            }
        );
    } catch (e) {
        console.log(e)
        res.status(500).send('There was a problem registering your user');
    }

})
router.post("/editoSobreMi", cors(corsOptions), async (req, res) => {
    console.log(req.body)
    const { sobremi } = req.body;

    try {

        await Sobremi.findByIdAndUpdate(
            "5fef1151c6f99602e840665d", { "sobremi": sobremi }, { new: true, useFindAndModify: false },
            function (err, result) {
                if (err) {
                    res.send(err);
                    console.log(err)
                } else {
                    console.log(result)
                    res.send(result);
                }
            }
        );
    } catch (e) {
        console.log(e)
        res.status(500).send('There was a problem registering your user');
    }

})





router.get("/buscoproducto", async (req, res) => {
    const { query } = req;
    const result = await Products.find(query,

        function (err, result) {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        }
    );
}),

    router.get("/buscobanner", async (req, res) => {
        const result = await Banner.find({ "nombre": "sodulce" },

            function (err, result) {
                if (err) {
                    res.send(err);
                } else {
                    res.send(result);
                }
            }
        );
        console.log(result)
    }),
    router.get("/buscoSobremi", async (req, res) => {
        const result = await Sobremi.find({ "nombre": "sodulce" },

            function (err, result) {
                if (err) {
                    res.send(err);
                } else {
                    res.send(result);
                }
            }
        );
        console.log(result)
    }),


    router.get("/listaproductos", async (req, res) => {
        const result = await Productos.find({},
            function (err, result) {
                if (err) {
                    res.send(err);
                } else {
                    res.send(JSON.stringify(result, null, '\t'));

                }
            }
        );
    }),
    router.get("/listafotos", async (req, res) => {
        const result = await Photo.find(req.query,
            function (err, result) {
                if (err) {
                    res.send(err);
                } else {
                    res.send(JSON.stringify(result, null, '\t'));

                }
            }
        );
    }),



    router.get("/delete", async (req, res) => {
        console.log(req.query._id)
        const photo = await Photo.findByIdAndDelete(req.query._id);
        const result = await cloudinary.uploader.destroy(photo.public_id,
            function (err, result) {
                if (err) {
                    res.send(err);
                } else {
                    res.send(result);
                }
            });
        console.log(result);
    })
router.get("/deleteall", async (req, res) => {

    const result = await Photo.find(req.query)

    await Promise.all(result.map(async (item) => {
        console.log(item)
        await Photo.deleteOne({ "_id": item._id });
        await cloudinary.uploader.destroy(item.public_id);
    }));

    await Productos.deleteOne(req.query);
    res.send(result);
})

router.post("/signup", async (req, res) => {
    console.log(req.body)
    try {
        // Receiving Data
        const { username, email, password } = req.body;
        // Creating a new User
        const user = new User({
            username,
            email,
            password
        });
        user.password = await user.encryptPassword(password);
        await user.save();
        // Create a Token
        const token = jwt.sign({ id: user.id }, process.env.SECRET, {
            expiresIn: 60 * 60 * 24 // expires in 24 hours
        });

        res.json({ auth: true, token });

    } catch (e) {
        console.log(e)
        res.status(500).send('There was a problem registering your user');
    }
})


router.get('/me', verifyToken, async (req, res) => {
    const user = await User.findById(req.userId, { password: 0 });
    if (!user) {
        return res.status(404).send("No user found.");
    }
    res.status(200).json(user);
});


router.post('/signin', async (req, res) => {
    console.log(req.body)
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(404).send("The email doesn't exists")
    }
    const validPassword = await user.comparePassword(req.body.password, user.password);
    if (!validPassword) {
        return res.status(401).send({ auth: false, token: null });
    }
    const token = jwt.sign({ id: user._id }, process.env.SECRET, {
        expiresIn: 60 * 60 * 24
    });
    res.status(200).json({ auth: true, token });
});
router.get('/logout', function (req, res) {
    res.status(200).send({ auth: false, token: null });
});
module.exports = router;