var express = require('express');
var bodyParser = require('body-parser');
var massive = require('massive');
var cors = require('cors');
var config = require('./config.js');
// var jwt = require('jsonwebtoken');
// var cookieParser = require('cookie-parser');


var app = module.exports = express();

app.use(bodyParser.json());
app.use('/', express.static(__dirname + '../app/dist'));
app.use(cors());

// app.use(cors({
//     origin: 'http://192.168.3.104:8100'
// }));
// app.use(cookieParser());

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

})

app.get('/api/cart', function(req, res, next){
    res.status(200).json(fakeSession);
})

// app.post('/api/cart', function(req, res) {
//    if(Array.isArray(req.session.cart)) {
//         req.session.cart.push(req.body)
//     } else {
//         req.session.cart = [req.body]
//     }
//     res.status(200).send('ok');
// })

// app.get('/api/cart', function(req, res) {
//   res.status(200).json(req.session.cart);
// })


// app.post('/api/cart', function(req, res, next){
//     var token = jwt.sign({cart: 'mycart'}, config.secretToken);

//     res.cookie('my-cookie', token, {maxAge: 100000000, httpOnly: true})
//     // res.cookie('my-cookie', token, req.body)

//     res.send('ok')
// })


// app.get('/api/cart', function(req, res, next) {
//     var cart = jwt.verify(req.cookies['my-cookie'], config.secretToken);

//     cart[0] // some product;

//     res.send(cart);
// })


  app.listen(process.env.PORT || port, function() {
    console.log("Listening on port", this.address().port);
});