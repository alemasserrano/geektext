
var util = require('util');
var express = require('express');
var app = express();
var router = express.Router();
var passport = require("passport");
var fs = require('fs');
const { Pool} = require('pg')
const bcrypt= require('bcrypt')
const LocalStrategy = require('passport-local').Strategy;
const host = 'cen4010dbinstance.cuo3jpom4wfm.us-east-1.rds.amazonaws.com';
const database = 'cen4010db';
const passworddb = 'cen4010password';


var pgp = require('pg-promise'); 

app.use(express.static('public'));


var currentAccountsData = [];

const pool = new Pool({
    user: 'cen4010master',
    password: passworddb,
	host: host,
	database: database,
	port: process.env.PGPORT
	
});

var db = pgp()

module.exports = function (app) {
	
	app.get('/user/signup', function (req, res, next) {
		try {
        res.render('user/signup', {
                    title: "Signup", 
                    userData: req.user, 
                    messages: {danger: req.flash('danger'), warning: req.flash('warning'), success: req.flash('success')}});
        }
        catch(e){
            throw(e)
        }
    });

    app.post('/user/signup', async function (req, res){


            try {
                const client = await pool.connect()
                await client.query('BEGIN')
                var pwd = await bcrypt.hash(req.body.password, 5);
                await JSON.stringify(client.query('SELECT customer_id FROM "customer" WHERE "cust_email" = $1', [req.body.username], function(err, result) {

                    if(result.rows[0]){
                        req.flash('warning', "This email address is already registered. <a href='/user/signin'>Log in!</a>");
                        res.redirect('/user/signup');
                    }
                    else{
                        client.query('INSERT INTO customer ("cust_name_first", "cust_name_last", cust_email, cust_login_password) VALUES ($1, $2, $3, $4)', [req.body.firstName, req.body.lastName, req.body.userName, pwd], function(err, result){
                            
                            if(err){
                                console.log(err);

                            }else{
                                client.query('COMMIT')
                                    console.log(result)
                                    req.flash('success', 'User created.')
                                    res.redirect('/user/signin');
                                    return;
                            }
                        });
                    }
                }));
                client.release();
            }
            catch(e){throw(e)}

    });

    app.get('/user/signin', function (req, res, next){
        try {
        if(req.isAuthenticated()){
            res.redirect('/books')
        }else{

            res.render('user/signin', 
                        {title: "Sign In", 
                        userData: req.user, 
                        messages: {danger: req.flash('danger'), warning: req.flash('warning'), success: req.flash('success')}});
            
        }
    }
    catch(e){throw(e)}
    });

    app.post('/user/signin', passport.authenticate('local', {


        successRedirect: '/books',
        failureRedirect: '/user/signin',
        failureFlash: true
    }), function(req, res){
        if(req.body.remember){
            req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
        } else{
            req.session.cookie.expires = false;
        }
        res.redirect('/user/signin')
    

    });
    
    return router;
   
}


passport.use('local', new LocalStrategy({passReqToCallback: true}, (req, userName, password, done) => {

    loginAttempt();
    async function loginAttempt(){


                const client = await pool.connect()

                try{
                    alert('inside try catch');
                    await client.query('BEGIN')
                    
                    var currentAccountsData = await JSON.stringify(client.query('SELECT customer_id, "cust_name_first", "cust_email", "password" from "customer" WHERE "email" = $1', [userName], function(err, result){
                    
                            if(err){
                                console.log('error');
                                return done(err)
                            }if(result.rows[0] == null) {
                                alert('error with password');
                                console.log("error with password");
                                req.flash('danger', "Oops, Incorrect login details");
                                return done(null, false);


                            }

                            else{
                                bcrypt.compare(password, result.rows[0].password, function(err, check){
                                    if(err){
                                        alert('error checking password');
                                        console.log('Error while checking password');
                                        return done();
                                    }else if (check){
                                        return done(null, [{email: result.rows[0].cust_email, firstName: result.rows[0].cust_name_first}]);
                                    }else{
                                        alert('error incorrect details.');
                                        req.flash('danger', "Oops. Incorrect login details");
                                        return done(null, false);

                                    }
                                });


                            }
                            


                    }))
                }


                catch(e) {throw (e);}
    };

}))

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});	