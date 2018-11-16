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
  var result = client.query('SELECT book.book_id, book.book_title, author.author_name_first, g.genre_name, Count(r.review_rating), CAST(AVG(r.review_rating)AS DECIMAL(10,1)) FROM book JOIN book_author ba ON book.book_id=ba.book_id INNER JOIN author ON author.author_id=ba.author_id JOIN book_genre bg ON book.book_id=bg.book_id JOIN genre g ON bg.genre_id=g.genre_id LEFT Join review r ON book.book_id=r.book_id Group by book.book_id, book.book_title, author.author_name_first, g.genre_name',
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
            read: false
          });
        ratingArray.push(
          {
            ratingValue: ratingNumber,
          });
      }

      client.end();
    });

  // const books = [
  //   {
  //     id: 1,
  //     title: 'War and Peace',
  //     genre: 'Historical Fiction',
  //     author: 'Lev Nikolayevich Tolstoy',
  //     read: false
  //   },
  //   {
  //     id: 2,
  //     title: 'Les Misérables',
  //     genre: 'Historical Fiction',
  //     author: 'Victor Hugo',
  //     read: false
  //   },
  //   {
  //     id: 3,
  //     title: 'The Time Machine',
  //     genre: 'Science Fiction',
  //     author: 'H. G. Wells',
  //     read: false
  //   },
  //   {
  //     id: 4,
  //     title: 'A Journey into the Center of the Earth',
  //     genre: 'Science Fiction',
  //     author: 'Jules Verne',
  //     read: false
  //   },
  //   {
  //     id: 5,
  //     title: 'The Dark World',
  //     genre: 'Fantansy',
  //     author: 'Henry Kuttner',
  //     read: false
  //   },
  //   {
  //     id: 6,
  //     title: 'Thw Wind in the Willows',
  //     genre: 'Fantasy',
  //     author: 'Kenneth Grahame',
  //     read: false
  //   },
  //   {
  //     id: 7,
  //     title: 'Life On The Mississippi',
  //     genre: 'History',
  //     author: 'Mark Twain',
  //     read: false
  //   },
  //   {
  //     id: 8,
  //     title: 'Childhood',
  //     genre: 'Biography',
  //     author: 'Lev Nikolayevich',
  //     read: false
  //   }
  // ];

  bookRouter.route('/')
    .get((req, res) => {
      (async function query() {
        //const request = new sql.Request();
        // const { recordset } = await request.query('SELECT * FROM books');
        // debug(result);
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

  /*
  .all((req, res, next) => {
      (async function query() {
        const { id } = req.params;
        const request = new sql.Request();
        const { recordset } =
          await request.input('id', sql.Int, id)
            .query('SELECT * FROM books WHERE id = @id');
        [req.book] = recordset;
        next();

      }());
    })
  */

  bookRouter.route('/:id')
    .get((req, res) => {
      const { id } = req.params;
      const specificBook = books[id - 1];
      res.render(
        'bookView',
        {
          nav,
          title: 'Library',
          book: specificBook,
          books: books
        }
      );
    });
  return bookRouter;
}

module.exports = router;