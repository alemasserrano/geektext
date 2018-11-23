const express = require('express');
const cartRouter = express.Router();
const { Client } = require('pg');
const user = 'cen4010master';
const host = 'cen4010dbinstance.cuo3jpom4wfm.us-east-1.rds.amazonaws.com';
const database = 'cen4010db';
const password = 'cen4010password';

function router(nav){

    var client = new Client({
        user: user,
        host: host,
        database: database,
        password: password,
        port: 5432,
      });
    
      client.connect();

      var books = [];
  // Do your queries here
  var result = client.query('SELECT book.book_id, book.book_image, book.book_title, book.book_description , book.book_price,author.author_name_first, g.genre_name, Count(r.review_rating), CAST(AVG(r.review_rating)AS DECIMAL(10,1)) FROM book JOIN book_author ba ON book.book_id=ba.book_id INNER JOIN author ON author.author_id=ba.author_id JOIN book_genre bg ON book.book_id=bg.book_id JOIN genre g ON bg.genre_id=g.genre_id LEFT Join review r ON book.book_id=r.book_id Group by book.book_id, book.book_title, author.author_name_first, g.genre_name',
    (err, res) => {
      for (i = 0; i < res.rows.length; i++) {
        books.push(
          {
            id: res.rows[i].book_id,
            title: res.rows[i].book_title,
            genre: res.rows[i].genre_name,
            author: res.rows[i].author_name_first,
            ratingNumber: res.rows[i].count,
            ratingAverage: res.rows[i].avg,
            description: res.rows[i].book_description,
            price: res.rows[i].book_price,
            image: res.rows[i].book_image,
            read: false
          });
      
      }

      client.end();
    });

    cartRouter.route('/')
        .get((req, res) => {

               res.render(
                   'cartView',
                   {
                       nav,
                       title: 'Cart',
                       books: books
                   }
               ); 

        });
    
    return cartRouter;

}

module.exports = router;