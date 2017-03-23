var express = require('express');
var bodyParser = require('body-parser');
var massive = require('massive');
var cors = require('cors');
var config = require('./config.js');
var jwt = require('jsonwebtoken');

const stripe = require('stripe')(config.STRIPE_KEYS.secretKey);

const app =  module.exports = express();


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

  // *******************************************
  // *           Product Endpoints             *
  // *******************************************


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

  // *******************************************
  // *       Abolitionists Endpoint            *
  // *******************************************

app.get('/abolitionists', function (req, res, next) {
    db.getAbolitionists(function (err, response) {
        if (err) {
            res.send(err);
        } else {
            res.status(200).send(response)
        }
    })
});

  // *******************************************
  // *         Shopping Cart Endpoints         *
  // *******************************************


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

  // *******************************************
  // *             Address Endpoint            *
  // *******************************************

app.post('/api/address', (req, res) => {
    var params = [
        req.body.firstName,
        req.body.lastName, 
        req.body.emailAddress,
        req.body.address,
        req.body.city,
        req.body.zipcode
    ]
    db.address(params, function(err, response){
        if(!err){
            res.send('Yay');
        }
    })

})

  // *******************************************
  // *             Stripe Endpoints            *
  // *******************************************

// payment
app.post('/api/payment', function(req, res, next){
  console.log(req.body);

  const chargeAmt = req.body.amount.price;
   const amountArray = chargeAmt.toString().split('');
  const pennies = [];
  for (var i = 0; i < amountArray.length; i++) {
    if(amountArray[i] === ".") {
      if (typeof amountArray[i + 1] === "string") {
        pennies.push(amountArray[i + 1]);
      } else {
        pennies.push("0");
      }
      if (typeof amountArray[i + 2] === "string") {
        pennies.push(amountArray[i + 2]);
      } else {
        pennies.push("0");
      }
    	break;
    } else {
    	pennies.push(amountArray[i])
    }
  }
  const convertedAmt = parseInt(pennies.join(''));
  console.log("Pennies: ");
  console.log(convertedAmt);


  const charge = stripe.charges.create({
  amount: convertedAmt, // amount in cents, again
  currency: 'usd',
  source: req.body.payment.token,
  description: 'Test charge from ionic app'
}, function(err, charge) {
     res.sendStatus(200);
//   if (err && err.type === 'StripeCardError') {
//     // The card has been declined
//   }
});
});


app.listen(process.env.PORT || port, function () {
    console.log("Listening on port", this.address().port);
});