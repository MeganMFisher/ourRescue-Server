var express = require('express');
var bodyParser = require('body-parser');
var massive = require('massive');
var cors = require('cors');

var app = module.exports = express();

app.use(bodyParser.json());
app.use('/', express.static(__dirname + '../app/dist'));

var port = 8100;

var config = require('./config.js');

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


var controller = require('./productsCtrl.js');
var db = app.get('db'); 



// app.get('/products', controller.getAll);
app.get('/products', function(req, res, next){
        db.getAllProducts(function(err, response){
            if(err) {
                res.send(err);
            } else {
                //res.json(response)
                res.status(200).send(response)
            }
        })
    });
// app.get('/products/:id', controller.getOne);

app.get('/products/:id', function(req, res, next){
    db.getOneProduct(req.params.id, function(err, response){
        if(err) {
            res.status(500).json(err);
        } else {
             res.json(response)
        }
    })
    });





  app.listen(process.env.PORT || port, function() {
    console.log("Listening on port", this.address().port);
});