const express = require('express');
const bookRouter = express.Router();
const debug = require('debug')('app:bookRoutes');
const { Client } = require('pg');
const user = 'cen4010master';
const host = 'cen4010dbinstance.cuo3jpom4wfm.us-east-1.rds.amazonaws.com';
const database = 'cen4010db';
const password = 'cen4010password';

function getBooksFromDb(sortBy, direction) {
  var client = new Client({
    user: user,
    host: host,
    database: database,
    password: password,
    port: 5432,
  });
  client.connect();

  return new Promise((resolve, reject) => {
    let bookQuery = 'SELECT book.book_id, book.book_title, book.book_description , book.book_price, book.book_release_date,author.author_name_first, g.genre_name, Count(r.review_rating), CAST(AVG(r.review_rating)AS DECIMAL(10,1)) FROM book JOIN book_author ba ON book.book_id=ba.book_id INNER JOIN author ON author.author_id=ba.author_id JOIN book_genre bg ON book.book_id=bg.book_id JOIN genre g ON bg.genre_id=g.genre_id LEFT Join review r ON book.book_id=r.book_id Group by book.book_id, book.book_title, author.author_name_first, g.genre_name';
    let realDirection = direction;
    if (realDirection != 'desc' && realDirection != 'asc') {
      realDirection = 'asc';
    }
    if (sortBy) {
      if (!['book_title', 'book_id', 'author_name_first', 'book_price', 'book_release_date'].includes(sortBy)) {
        sortBy = 'book_title'
      }
      bookQuery = `SELECT * FROM (${bookQuery}) AS inner_query ORDER BY ${sortBy} ${realDirection}`;
    }

    var books = [];
    var result = client.query(
      bookQuery,
      (err, res) => {
        if (err) {
          reject(err);
        }

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
              read: false
            });
        }
        resolve(books);

        client.end();
      });
  });
}

function router(nav) {
  bookRouter.route('/')
    .get(async (req, res) => {
        const sortBy = req.query.sort_by;
        const direction = req.query.direction;
        res.render(
          'bookListView',
          {
            nav,
            title: 'Library',
            books: await getBooksFromDb(sortBy, direction)
          }
        );
    });

  bookRouter.route('/:id')
    .get(async (req, res) => {
        const { id } = req.params;
        const books = await getBooksFromDb();
        // [{id, title, genre, author, ...}]
        const specificBook = books.filter(({book_id}) => {
          return book_id == id;
        });

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