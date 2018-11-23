var promise = require('bluebird');
var options = {
    // Initialization Options
    promiseLib: promise
  };
var pgp = require('pg-promise')(options);
var connectionString = 'postgres://cen4010master:cen4010password@localhost:5432/cen4010db';
var db = pgp({
    host: 'cen4010dbinstance.cuo3jpom4wfm.us-east-1.rds.amazonaws.com',
    port: 5432,
    database: 'cen4010db',
    password: 'cen4010password',
    user: 'cen4010master'
});

module.exports = {
    getCustomer: getCustomer,
    getSingleCustomer: getSingleCustomer,
    createCart: createCart,
    db: db
    // updatePuppy: updatePuppy,
    // removePuppy: removePuppy
  };


function getCustomer(req, res, next){
    db.any('select * from customer')
        .then(function(data){
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'All Customers'
                });

        })
        .catch(function(err){
            return next(err);
        });
}

function getSingleCustomer(req, res, next) {
    var custID = parseInt(req.params.id);
    db.one('select * from customer where customer_id = $1', custID)
      .then(function (data) {
        res.status(200)
          .json({
            status: 'success',
            data: data,
            message: 'Retrieved ONE cust'
          });
      })
      .catch(function (err) {
        return next(err);
      });
  }

  function createCart(req, res, next) {
    req.body.age = parseInt(req.body.age);
    db.none('insert into shopping_cart_item (shopping_cart_id, book_id, cartitem_quantity, cartitem_buy_now)' +
        'values(${shopping_cart_id}, ${book_id}, ${cartitem_quantity}, ${cartitem_buy_now})',
      req.body)
      .then(function () {
        res.status(200)
          .json({
            status: 'success',
            message: 'Inserted one item'
          });
      })
      .catch(function (err) {
        return next(err);
      });
  }