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

  var books = [];
  // Do your queries here
  var result = client.query('SELECT book.book_id, book.book_title, author.author_name_first, g.genre_name FROM book JOIN book_author ba ON book.book_id=ba.book_id INNER JOIN author ON author.author_id=ba.author_id JOIN book_genre bg ON book.book_id=bg.book_id JOIN genre g ON bg.genre_id=g.genre_id',
    (err, res) => {
      for(i = 0; i < res.rows.length; i ++){
        books.push(
          {
            id: res.rows[i].book_id,
            title: res.rows[i].book_title,
            genre: res.rows[i].genre_name,
            author: res.rows[i].author_name_first,
            read: false
          });
      }
     
      client.end();
    });

  // const books = result;
  // const books = [
  //     {
  //       id: 1,
  //       title: 'War and Peace',
  //       genre: 'Historical Fiction',
  //       author: 'Lev Nikolayevich Tolstoy',
  //       read: false
  //     },
  //     {
  //       id: 2,
  //       title: 'Les Misérables',
  //       genre: 'Historical Fiction',
  //       author: 'Victor Hugo',
  //       read: false
  //     },
  //     {
  //       id: 3,
  //       title: 'The Time Machine',
  //       genre: 'Science Fiction',
  //       author: 'H. G. Wells',
  //       read: false
  //     },
  //     {
  //       id: 4,
  //       title: 'A Journey into the Center of the Earth',
  //       genre: 'Science Fiction',
  //       author: 'Jules Verne',
  //       read: false
  //     },
  //     {
  //       id: 5,
  //       title: 'The Dark World',
  //       genre: 'Fantansy',
  //       author: 'Henry Kuttner',
  //       read: false
  //     },
  //     {
  //       id: 6,
  //       title: 'Thw Wind in the Willows',
  //       genre: 'Fantasy',
  //       author: 'Kenneth Grahame',
  //       read: false
  //     },
  //     {
  //       id: 7,
  //       title: 'Life On The Mississippi',
  //       genre: 'History',
  //       author: 'Mark Twain',
  //       read: false
  //     },
  //     {
  //       id: 8,
  //       title: 'Childhood',
  //       genre: 'Biography',
  //       author: 'Lev Nikolayevich',
  //       read: false
  //     }
  //   ];

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
  return reviewRouter;

}


module.exports = router;