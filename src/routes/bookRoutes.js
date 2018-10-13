const express = require('express');
const bookRouter = express.Router();
const sql = require('mssql');
const debug = require('debug')('app:bookRoutes');

function router(nav) {
  const books = [
    {
      id: 1,
      title: 'War and Peace',
      genre: 'Historical Fiction',
      author: 'Lev Nikolayevich Tolstoy',
      read: false
    },
    {
      id: 2,
      title: 'Les Misérables',
      genre: 'Historical Fiction',
      author: 'Victor Hugo',
      read: false
    },
    {
      id: 3,
      title: 'The Time Machine',
      genre: 'Science Fiction',
      author: 'H. G. Wells',
      read: false
    },
    {
      id: 4,
      title: 'A Journey into the Center of the Earth',
      genre: 'Science Fiction',
      author: 'Jules Verne',
      read: false
    },
    {
      id: 5,
      title: 'The Dark World',
      genre: 'Fantansy',
      author: 'Henry Kuttner',
      read: false
    },
    {
      id: 6,
      title: 'Thw Wind in the Willows',
      genre: 'Fantasy',
      author: 'Kenneth Grahame',
      read: false
    },
    {
      id: 7,
      title: 'Life On The Mississippi',
      genre: 'History',
      author: 'Mark Twain',
      read: false
    },
    {
      id: 8,
      title: 'Childhood',
      genre: 'Biography',
      author: 'Lev Nikolayevich',
      read: false
    }
  ];

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
          book: specificBook
        }
      );
    });
  return bookRouter;
}

module.exports = router;