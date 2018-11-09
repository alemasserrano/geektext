const { Client } = require('pg');
const user = 'cen4010master';
const host = 'cen4010dbinstance.cuo3jpom4wfm.us-east-1.rds.amazonaws.com';
const database = 'cen4010db';
const password = 'cen4010password';

// function getIgnacioData(){
//     var client = new Client({
//         user: user,
//         host: host,
//         database: database,
//         password: password,
//         port: 5432,
//       })

//     client.connect();

//     // Do your queries here
//     var result = client.query('SELECT * FROM CUSTOMER', (err, res) => {
//         console.log(err, res)
//         client.end();
//     })

//     return result;
// }

// module.exports = getIgnacioData;

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
    var result = client.query('SELECT book.book_id, book.book_title, author.author_name_first, g.genre_name FROM book JOIN book_author ba ON book.book_id=ba.book_id INNER JOIN author ON author.author_id=ba.author_id JOIN book_genre bg ON book.book_id=bg.book_id JOIN genre g ON bg.genre_id=g.genre_id',
     (err, res) => {
        console.log(res)
        client.end();
    })

    return result;
}

getMoreData();