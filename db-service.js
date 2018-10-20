const { Client } = require('pg');
const user = 'cen4010master';
const host = 'cen4010dbinstance.cuo3jpom4wfm.us-east-1.rds.amazonaws.com';
const database = 'cen4010db';
const password = 'cen4010password';

function getIgnacioData(){
    var client = new Client({
        user: user,
        host: host,
        database: database,
        password: password,
        port: 5432,
      })

    client.connect();

    // Do your queries here
    var result = client.query('SELECT * FROM CUSTOMER', (err, res) => {
        console.log(err, res)
        client.end();
    })

    return result;
}

module.exports = getIgnacioData;

function getMoreData(){
    var client = new Client({
        user: user,
        host: host,
        database: database,
        password: password,
        port: 5432,
      })

    client.connect();

    // Do your queries here
    var result = client.query('SELECT * FROM CUSTOMER', (err, res) => {
        console.log(res)
        client.end();
    })

    return result;
}

getMoreData();