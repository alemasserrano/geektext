const express = require('express');
const authRouter = express.Router();
const { Client } = require('pg');
const user = 'cen4010master';
const host = 'cen4010dbinstance.cuo3jpom4wfm.us-east-1.rds.amazonaws.com';
const database = 'cen4010db';
const password = 'cen4010password';

function router() {

    authRouter.route('/')
        .get((req, res) => {

            res.render(
                'user/signup',

                {

                    Title: req.title()


                }
            );
        });

    authRouter.post((req, res) => {
        res.redirect('/books');
    });


    return authRouter;
}

module.exports = router;



