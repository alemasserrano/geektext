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
  var result = client.query('SELECT book.book_id, book.book_title, author.author_name_first, g.genre_name, Count(r.review_rating), CAST(AVG(r.review_rating)AS DECIMAL(10,1)) FROM book JOIN book_author ba ON book.book_id=ba.book_id INNER JOIN author ON author.author_id=ba.author_id JOIN book_genre bg ON book.book_id=bg.book_id JOIN genre g ON bg.genre_id=g.genre_id LEFT Join review r ON book.book_id=r.book_id Group by book.book_id, book.book_title, author.author_name_first, g.genre_name',
    (err, res) => {
      for (i = 0; i < res.rows.length; i++) {
        books.push(
          {
            id: res.rows[i].book_id,
            title: res.rows[i].book_title,
            genre: res.rows[i].genre_name,
            ratingNumber: res.rows[i].count,
            ratingAverage: res.rows[i].avg,
            author: res.rows[i].author_name_first,
            read: false
          }
        );
      }
      //client.end();
    });

  // var commentsArray = [];

  // var resultComments = client.query('SELECT r.book_id, r.review_comment, r.review_rating FROM review r',
  //   (err, res) => {
  //     for (i = 0; i < res.rows.length; i++) {
  //       commentsArray.push(
  //         {
  //           idofCommentedBook: res.rows[i].book_id,
  //           comment: res.rows[i].review_comment,
  //           rating: res.rows[i].review_rating,
  //         });
  //     }
  //     //client.end();
  //   });

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


  var ratingNumber = [];
  reviewRouter.post('/:id', function (req, resp) {
    let orderId = req.body.orderId;
    let bookId = parseInt(req.params.id);
    let userRating = 5; //parseInt(req.body.clickedValue);
    let userReview = req.body.review;
    ratingNumber.push(userRating);

    console.log(orderId, bookId, userRating, userReview);
    var query = "INSERT INTO public.review(order_id, book_id, review_rating, review_comment) VALUES($1,$2,$3,$4)";
    return client.query(query, [orderId, bookId, userRating, userReview])
      .then((postResult) => {
        console.log('post Result: ', postResult);
        var commentsArray = [];
        return client.query('SELECT r.book_id, r.review_comment, r.review_rating FROM review r')
          .then((res1) => {
            console.log('res1: ', res1);
            for (i = 0; i < res1.rows.length; i++) {  
              commentsArray.push(
                {
                  idofCommentedBook: res1.rows[i].book_id,
                  comment: res1.rows[i].review_comment,
                  rating: res1.rows[i].review_rating,
                });
            }

            const specificBookReview = books[bookId - 1];
             console.log('render');
            return resp.render(
              'bookView',
              {
                nav,
                title: 'Library',
                book: specificBookReview,
                commentsArray: commentsArray
              }
            );
          })

      })
      .catch((error) => {
        console.log('error here: ', error);
      })
  });
  return reviewRouter;
}


module.exports = router;