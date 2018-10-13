const express = require('express');
const reviewRouter = express.Router();

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