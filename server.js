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


// var controller = require('./productsCtrl.js');
var db = app.get('db'); 


// PRODUCTS IN STORE //

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

app.get('/products/:id', function(req, res, next){
    db.getOneProduct(req.params.id, function(err, response){
        if(err) {
            res.status(500).json(err);
        } else {
             res.json(response)
        }
    })
});

// USER //

app.post('/user', function(req, res, next){
    var user = req.body;
		db.user_create([user.name, user.email], function(err, user) {
			if (err) {
				return res.status(500)
					.send(err);
			}

			user = user[0];
			db.order_create([user.id], function(err, order) {
				if (err) {
					return res.status(500)
						.send(err);
				}
				res.status(200)
					.send('User and Order created successfully');
			});
		});
});

app.get('/user', function(req, res, next){
    db.users(function(err, users) {
			if (err) {
				return res.status(500)
					.send(err);
			}
			res.status(200)
				.send(users);
		});
})

// ORDER //

app.post('/order/:userid', function(req, res, next){
    db.order_create([req.params.userid], function(err, order) {
			if (err) {
				return res.status(500)
					.send(err);
			}
			res.status(200)
				.send('Order created successfully');
		});
});

app.put('/orders/complete/:orderid/:userid', function(req, res,next){
    db.order_complete([req.params.orderid], function(err, order) {
			if (err) {
				return res.status(500)
					.send(err);
			}
			next();
		});
});

app.get('/order/:userid', function(req, res, next){
    var completeOrder = {};
		db.order_by_user([req.params.userid], function(err, order) {
			if (err) {
				return res.status(500)
					.send(err);
			}

			completeOrder.order = order[0];
			db.product_cart_find([completeOrder.order.id], function(err, products) {
				if (err) {
					return res.status(500)
						.send(err);
				}

				completeOrder.products = products;
				res.status(200)
					.send(completeOrder);
			});
		});
});

app.get('/order/completed/:userid', function(req, res, next){
    db.order_history_by_user([req.params.userid], function(err, orders) {
			if (err) {
				return res.status(500)
					.send(err);
			}
			res.status(200)
				.send(orders);
		});
});

// PRODUCTS IN CART //

app.get('/products', function(req, res, next){
    	db.products(function(err, products) {
			if (err) {
				return res.status(500)
					.send(err);
			}
			res.status(200)
				.send(products);
		});
});

app.get('/in/cart/:cartid', function(req, res, next){
    db.product_cart_find([req.params.cartid], function(err, products) {
			if (err) {
				return res.status(500)
					.send(err);
			}
			res.status(200)
				.send(products);
		});
});

app.post('/add/item/cart/:cartid', function(req, res, next){
    var product = req.body;

		db.product_cart_insert([req.params.cartid, product.id, product.qty], function(err, productInCart) {
			if (err) {
				return res.status(500)
					.send(err);
			}
			res.status(200)
				.send('Item added successfully');
		});
});

app.put('/update/qty/:productid', function(req, res, next){
    db.product_cart_update([req.body.qty, req.params.productid], function(err, productInCart) {
			if (err) {
				return res.status(500)
					.send(err);
			}
			res.status(200)
				.send('Item updated successfully');
		});
});

app.delete('/delete/item/cart/:productid', function(req, res, next){
    db.product_cart_remove([req.params.productid], function(err, product) {
			if (err) {
				return res.status(500)
					.send(err);
			}
			res.status(200)
				.send('Item removed successfully');
		});
})


  app.listen(process.env.PORT || port, function() {
    console.log("Listening on port", this.address().port);
});