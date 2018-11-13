//var async = require('async');
const express = require('express');
const reviewRouter = express.Router();
const { Client } = require('pg');
const user = 'cen4010master';
const host = 'cen4010dbinstance.cuo3jpom4wfm.us-east-1.rds.amazonaws.com';
const database = 'cen4010db';
const password = 'cen4010password';


function router(nav) {
  var client = new Client({
    user: user,
    host: host,
    database: database,
    password: password,
    port: 5432,
  });

  client.connect();

  // var bookReview = [];
  // //Do your queries here
  // var postresult = client.query("INSERT INTO public.review(order_id, book_id, review_rating, review_comment) VALUES(" + "2" + "," + res.body.book_id + "," + res.body.clickedValue + "," + res.body.review + ");",
  //   (req, res) => {
  //     bookReview.push(
  //       {
  //         orderId: 2,
  //         bookIdtoReview: res.body.book_id,
  //         rating: res.body.clickedValue,
  //         review: res.body.review,
  //       });
  //     //client.end();
  //   });

  var books = [];
  // Do your queries here
  var result = client.query('SELECT book.book_id, book.book_title, author.author_name_first, g.genre_name FROM book JOIN book_author ba ON book.book_id=ba.book_id INNER JOIN author ON author.author_id=ba.author_id JOIN book_genre bg ON book.book_id=bg.book_id JOIN genre g ON bg.genre_id=g.genre_id',
    (err, res) => {
      for (i = 0; i < res.rows.length; i++) {
        books.push(
          {
            id: res.rows[i].book_id,
            title: res.rows[i].book_title,
            genre: res.rows[i].genre_name,
            author: res.rows[i].author_name_first,
            read: false
          }
        );
      }
      //client.end();
    });

  reviewRouter.route('/:id')
    .get((req, res) => {
      const { id } = req.params;
      const specificBook = books[id - 1];

      res.render(
        'review',
        {
          nav,
          title: 'Library',
          book: specificBook
        }
      );
    });


  reviewRouter.post('/:id', function (req, res) {
    let orderId = req.body.orderId;
    let bookId = req.params.id;
    let userRating = req.body.clickedValue;
    let userReview = req.body.review;


    var bookReview = [];
    //Do your queries here
    var postresult = client.query("INSERT INTO public.review(order_id, book_id, review_rating, review_comment) VALUES($1,$2,$3,$4)", [orderId, bookId, userRating, userReview]);
    
    const specificBookReview = books[bookId - 1];

      res.render(
        'bookView',
        {
          nav,
          title: 'Library',
          book: specificBookReview
        }
      );
    //client.end();
  });
  return reviewRouter;
}


module.exports = router;