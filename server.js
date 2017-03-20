var express = require('express');
// var session = require('express-session')
var bodyParser = require('body-parser');
var massive = require('massive');
var cors = require('cors');
var config = require('./config.js');


var app = module.exports = express();

app.use(bodyParser.json());
app.use('/', express.static(__dirname + '../app/dist'));
app.use(cors());
// app.use(session({
//   secret: config.secret,
//   resave: true,
//   saveUninitialized: true
// }));

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
let fakeSession = [];
app.post('/api/cart', function(req, res, next){

    fakeSession.push(req.body);

    res.status(200).send('ok');


    // if(Array.isArray(req.session.cart)) {
    //     req.session.cart.push(req.body)
    // } else {
    //     req.session.cart = [req.body]
    // }
    // res.status(200).send('ok');
})

app.get('/api/cart', function(req, res, next){


    res.status(200).json(fakeSession);
})




  app.listen(process.env.PORT || port, function() {
    console.log("Listening on port", this.address().port);
});