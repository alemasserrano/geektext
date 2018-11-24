const express = require('express');
const bookRouter = express.Router();
const debug = require('debug')('app:bookRoutes');
const { Client } = require('pg');
const user = 'cen4010master';
const host = 'cen4010dbinstance.cuo3jpom4wfm.us-east-1.rds.amazonaws.com';
const database = 'cen4010db';
const password = 'cen4010password';
var csrf = require('csurf'); //Security of token
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var bodyParser = require('body-parser');
bookRouter.use(bodyParser.urlencoded({ extended: false }));
bookRouter.use(bodyParser.json());

//bookRouter.use(express.static(__dirname + '/userRegistrationForm'));

var client = new Client({
  user: user,
  host: host,
  database: database,
  password: password,
  port: 5432,
});

function router(nav) {

  //Security of token
  bookRouter.use(csrf()); // Security, has to be after cookie and session.
  bookRouter.use(function (req, res, next) {
    var token = req.csrfToken();
    res.cookie('XSRF-TOKEN', token);
    res.locals.csrfToken = token;
    next();
  });

  bookRouter.post("/newRegistration", multipartMiddleware, function (req, res, next) {

    console.log("Inserted!!!!!");
  });


  bookRouter.route('/')
    .get((req, res) => {
      (async function query() {
        res.render(
          'userRegistrationForm',
          {
            nav,
            title: 'User Regitration',
          }
        );
      }());
    });

 

  return bookRouter;
}
module.exports = router;