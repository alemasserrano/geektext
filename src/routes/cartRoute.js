const express = require('express');
const cartRouter = express.Router();
const { Client } = require('pg');
const user = 'cen4010master';
const host = 'cen4010dbinstance.cuo3jpom4wfm.us-east-1.rds.amazonaws.com';
const database = 'cen4010db';
const password = 'cen4010password';

function router(nav){

    cartRouter.route('/')
        .get((req, res) => {

               res.render(
                   'cartView',
                   {
                       nav,
                       title: 'Cart'
                   }
               ); 

        });
    return cartRouter;

}

module.exports = router;