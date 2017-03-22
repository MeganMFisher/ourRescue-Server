var express = require('express');
var bodyParser = require('body-parser');
var massive = require('massive');
var cors = require('cors');
var config = require('./config.js');
var jwt = require('jsonwebtoken');


var app = module.exports = express();

app.use(bodyParser.json());
app.use(cors());


var port = 8100;


var db = massive.connect({
        connectionString: config.database
    },
    function (err, localdb) {
        db = localdb;
        app.set('db', db);
        db.schema(function (err, data) {
            if (err) {
                console.log(err);
            } else {
                console.log('All tables successfully reset');
            }
        });
    })


app.get('/products', function (req, res, next) {
    db.getAllProducts(function (err, response) {
        if (err) {
            res.send(err);
        } else {
            res.status(200).send(response)
        }
    })
});

app.get('/products/:id', function (req, res, next) {
    db.getOneProduct(req.params.id, function (err, response) {
        if (err) {
            res.status(500).json(err);
        } else {
            res.json(response)
        }
    })
});

app.get('/abolitionists', function (req, res, next) {
    db.getAbolitionists(function (err, response) {
        if (err) {
            res.send(err);
        } else {
            res.status(200).send(response)
        }
    })
});


app.post('/api/cart', (req, res) => {
    var token = req.headers['authorization']
    var verifiedToken = jwt.verify(token, config.secretToken); // here we are verifying the token
    let cart = verifiedToken.cart; //there is a cart array on the token 
    cart.push(req.body) // wer are pushing req.body to the cart array
    return res.json({
        token: {token: jwt.sign({cart: cart}, config.secretToken)},
        cart: cart
    })

})


app.get('/api/viewcart', (req, res) => {
    var token = req.headers['authorization']
    var verifiedToken = jwt.verify(token, config.secretToken);
    var cart = verifiedToken.cart;

    return res.json({
        token: {token: jwt.sign({cart: cart}, config.secretToken)},
        cart: cart
    })
})

app.post('/api/removecart', (req, res) => {
    var token = req.headers['authorization']
    var verifiedToken = jwt.verify(token, config.secretToken);
    var cart = verifiedToken.cart;
    for (var i = 0; i < cart.length; i++) {
        // console.log(cart[i].id, req.body.id)
        if (cart[i].id === req.body.id) {
            cart.splice(i, 1);
        }
    }
    return res.json({
        token: {token: jwt.sign({cart: cart}, config.secretToken)},
        cart: cart
    })
})

app.post('/api/update', (req, res) => {
    var token = req.headers['authorization']
    var verifiedToken = jwt.verify(token, config.secretToken);
    let cart = req.body;

    return res.json({
        token: {token: jwt.sign({cart: cart}, config.secretToken)},
        cart: cart
    })
})

app.post('/api/createToken', (req, res) => {
     return res.json({
        token: {token: jwt.sign({cart: []}, config.secretToken)},
        cart: []
    })
})


app.listen(process.env.PORT || port, function () {
    console.log("Listening on port", this.address().port);
});