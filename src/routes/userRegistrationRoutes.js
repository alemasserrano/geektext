const express = require('express');
const userregistrationRouter = express.Router();
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
userregistrationRouter.use(bodyParser.urlencoded({ extended: false }));
userregistrationRouter.use(bodyParser.json({type: 'application/json'}));

userregistrationRouter.use(express.static(__dirname + '/userRegistrationForm'));

var client = new Client({
  user: user,
  host: host,
  database: database,
  password: password,
  port: 5432,
});


function router(nav) {

  //Security of token
  userregistrationRouter.use(csrf()); // Security, has to be after cookie and session.
  userregistrationRouter.use(function (req, res, next) {
    var token = req.csrfToken();
    res.cookie('XSRF-TOKEN', token);
    res.locals.csrfToken = token;
    next();
  });

  userregistrationRouter.route("/newRegistration").all((req, res) => {
      console.log("Inserted!!!!!");
  }); 


  userregistrationRouter.route('/')
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



  return userregistrationRouter;
}
module.exports = router;