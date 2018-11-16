const express = require('express');
const debug = require('debug')('app:authRoutes');

const authRouter = express.Router();

function router() {
  authRouter.route('/signUp')
    .post((req, res) => {
      const { username, password } = req.body;

      // START tutorial uses MongoDB
      (async function addUser() {
        const request = new sql.Request();
        const { recordset } = await request.query('SELECT * FROM books');
        // debug(result);
        res.render(
          'bookListView',
          {
            nav,
            title: 'Library',
            books: recordset
          }
        );
      }());
      // END tutorial uses MongoDB

      debug(req.body);
      req.login(req.body, () => {
        res.redirect('/auth/profile');
      });
    });
  authRouter.route('/profile')
    .get((req, res) => {
      res.json(req.user);
    });
  return authRouter;
}

module.exports = router;