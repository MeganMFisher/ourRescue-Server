var app = require('./server.js');
var db = app.get('db');

module.exports = {

    getAll: function(req, res){
        db.getAllProducts(function(err, response){
            if(err) {
                res.status(500).json(err);
            } else {
                console.log(response);
                res.json(response)
            }
        })
    },

    getOne: function(req, res){
    db.getOneProduct(req.params.id, function(err, products){
        if(!err){
            res.send(products);
        }
    })
    } 


}