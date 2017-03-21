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
    function(err, localdb) {
        db = localdb;
        app.set('db', db);
        db.schema(function(err, data) {
      if (err) {
          console.log(err);
      } else { 
          console.log('All tables successfully reset');
      }
    });
  })


app.get('/products', function(req, res, next){
        db.getAllProducts(function(err, response){
            if(err) {
                res.send(err);
            } else {
                console.log('success')
                res.status(200).send(response)
            }
        })
});

app.get('/products/:id', function(req, res, next){
    db.getOneProduct(req.params.id, function(err, response){
        if(err) {
            res.status(500).json(err);
        } else {
            console.log('success')
             res.json(response)
        }
    })
});

app.get('/abolitionists', function(req, res, next){
        db.getAbolitionists(function(err, response){
            if(err) {
                res.send(err);
            } else {
                console.log('success')
                res.status(200).send(response)
            }
        })
});


app.post('/api/cart', (req, res) => {
    var token = req.headers['authorization']


    if(req.headers['authorization']){ //I dont know if this is actually testing anything
        var verifiedToken = jwt.verify(token, config.secretToken); // here we are verifying the token
        let cart = verifiedToken.cart; //there is a cart array on the token 
        cart.push(req.body) // wer are pushing req.body to the cart array
        res.json({token: jwt.sign({cart: cart}, config.secretToken)}) //finally we sign & send a new copy of the cart in a brand new token that will get saved on the front end 
    } 
    // else {
    //     console.log(req.body)
    //     let myCart = [req.body]
    //     token = jwt.sign({cart: myCart}, config.secretToken);
    // }   




    res.json({token: token})
})


app.get('/api/viewcart', (req, res) => {
    var token = req.headers['authorization']
    var verifiedToken = jwt.verify(token, config.secretToken);
    //cart[0] // some product;

    res.send(verifiedToken);
})

app.post('/api/removecart', (req, res) => {
    var token = req.headers['authorization']
    var verifiedToken = jwt.verify(token, config.secretToken);
    var cart = verifiedToken.cart;
    console.log(req.body)
        for(var i = 0; i < cart.length; i++) {
            // console.log(cart[i].id, req.body.id)
            if(cart[i].id === req.body.id) {
                cart.splice(i, 1);
                console.log('step2')
            } 
        }
    res.json({token: jwt.sign({cart: cart}, config.secretToken)})
})


  app.listen(process.env.PORT || port, function() {
    console.log("Listening on port", this.address().port);
});