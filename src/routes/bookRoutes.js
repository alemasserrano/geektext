const express = require('express');
const bookRouter = express.Router();
const debug = require('debug')('app:bookRoutes');
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

  var ratingArray = [];


  var ratingNumber = 0;
  var books = [];
  // Do your queries here
  var result = client.query('SELECT book.book_id, book.book_title, book.book_description , book.book_price, author.author_name_first, author.author_name_last, author.author_biography, author.author_id, book.book_image, g.genre_name, p.publisher_name, book.book_release_date, Count(r.review_rating), CAST(AVG(r.review_rating)AS DECIMAL(10,1)) FROM book JOIN book_author ba ON book.book_id=ba.book_id INNER JOIN author ON author.author_id=ba.author_id JOIN book_genre bg ON book.book_id=bg.book_id JOIN genre g ON bg.genre_id=g.genre_id LEFT Join review r ON book.book_id=r.book_id JOIN publisher p ON book.publisher_id=p.publisher_id Group by book.book_id, book.book_title, author.author_name_first, author.author_name_last, author.author_biography, author.author_id, g.genre_name, p.publisher_name, book.book_release_date',
    (err, res) => {
      for (i = 0; i < res.rows.length; i++) {
        books.push(
          {
            id: res.rows[i].book_id,
            img: res.rows[i].book_image,
            title: res.rows[i].book_title,
            genre: res.rows[i].genre_name,
            author_id: res.rows[i].author_id,
            author_name: res.rows[i].author_name_first + " " + res.rows[i].author_name_last,
            author_bio: res.rows[i].author_biography,
            ratingNumber: res.rows[i].count,
            ratingAverage: res.rows[i].avg,
            description: res.rows[i].book_description,
            price: res.rows[i].book_price,
            publisher_name: res.rows[i].publisher_name,
            release_date: res.rows[i].book_release_date,
            read: false
          });
      }
    });

  var commentsArray = [];
  var resultComments = client.query('SELECT r.book_id, r.review_comment, r.review_rating, c.cust_name_first FROM review r JOIN "order" o ON r.order_id=o.order_id JOIN customer c ON o.customer_id=c.customer_id Group by r.book_id, r.review_comment, r.review_rating, c.cust_name_first',
    (err, res) => {
      for (i = 0; i < res.rows.length; i++) {
        commentsArray.push(
          {
            idofCommentedBook: res.rows[i].book_id,
            comment: res.rows[i].review_comment,
            rating: res.rows[i].review_rating,
            customerName: res.rows[i].cust_name_first,
          });
      }
      //client.end();
    });

  // const books = [
  //   {
  //     id: 1,
  //     title: 'War and Peace',
  //     genre: 'Historical Fiction',
  //     author: 'Lev Nikolayevich Tolstoy',
  //     read: false
  //   },
  // ];

  bookRouter.route('/')
    .get((req, res) => {
      (async function query() {
        res.render(
          'bookListView',
          {
            nav,
            title: 'Library',
            books: books
          }
        );
      }());
    });


  bookRouter.route('/:id').get((req, res) => {
      const { id } = req.params;
      const specificBook = books[id-1];

      res.render(
        'bookView',
        {
          nav,
          title: 'Library',
          book: specificBook,
          books: books,
          commentsArray: commentsArray,
        }
      );
    });

  return bookRouter;
}
module.exports = router;