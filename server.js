var express = require('express');
var bodyParser = require('body-parser');
var massive = require('massive');
var cors = require('cors');
// var morgan = require('morgan');
// var jwt = require('jwt-simple');
// var  moment = require('moment');

var app = module.exports = express();


app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());
app.use('/', express.static(__dirname + '../app/dist'));
// app.use(morgan('dev'))

var port = 8100;

var config = require('./config.js');
var controller = require('./serverCtrl.js');

// let ensureAuthenticated = (req, res, next) => { 
//   if (!req.header('Authorization')) {
//     return res.status(401).send({
//       message: 'Please make sure your request has an Authorization header'
//     });
//   }
//   let token = req.header('Authorization').split(' ')[1];
//   let payload = null;
//   try {
//     payload = jwt.decode(token, config.TOKEN_SECRET);
//   } catch (err) {
//     return res.status(401).send({
//       message: err.message
//     });
//   }
//   if (payload.exp <= moment().unix()) {
//     return res.status(401).send({
//       message: 'Token has expired'
//     });
//   }
//   req.user = payload.sub;
//   next();
// }


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

var db = app.get('db'); 


app.get('/products', function(req, res, next){
        db.getAllProducts(function(err, response){
            if(err) {
                res.send(err);
            } else {
                res.status(200).send(response)
            }
        })
});

app.get('/products/:id', function(req, res, next){
    db.getOneProduct(req.params.id, function(err, response){
        if(err) {
            res.status(500).json(err);
        } else {
             res.json(response)
        }
    })
});


// app.post('/auth/login', controller.login)
// app.post('/auth/signup', controller.signup)
app.get('/api/get-all', controller.getAll)
app.post('/add-to-cart', controller.addToCart)
app.post('/check-out', controller.checkOut)


app.listen(process.env.PORT || port, function() {
    console.log("Listening on port", this.address().port);
});