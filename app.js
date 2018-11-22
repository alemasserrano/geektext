const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const pgStore = require('connect-pg-simple')(session);
const { Pool, Client } = require('pg');
const p = require('./queries');
var expressSession = require('express-session');




const app = express();
const port = process.env.PORT || 3000;
//var pgSession = require('connect-pg-simple')(session);

app.use(morgan('tiny'));


app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


// sessionStorage = new pgSession({
//   conString: config.db.connection,
//   tableName: config.session.tableName
// });
app.use(session({ 
  secret: 'keyboard cat',
  saveUninitialized: false,
  resave: false,
  cookie: {maxAge: 180 * 60 * 1000 }
  // store: new pgStore(p.db)
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(expressSession({secret: 'keyboard cat'}))
app.use(bodyParser());
app.set('views', './src/views');
app.set('view engine', 'ejs');
// require('./src/config/passport.js')(app);
app.use(express.static(path.join(__dirname, '/public/')));
app.use((req, res, next) => {
  debug('my middleware');
  next();
});


app.use(express.static(path.join(__dirname, '/public/')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));



app.use(function(req, res, next){
   res.locals.login = req.isAuthenticated();
    res.locals.session = req.session;
    delete req.session.user;

    next();
})

const nav = [
  { link: '/books', title: 'Book' },
  { link: '/authors', title: 'Author' },
  { link: '/cart', title: 'Cart'},
];

const bookRouter = require('./src/routes/bookRoutes')(nav);
// const adminRouter = require('./src/routes/adminRoutes')(nav);
// const authRouter = require('./src/routes/authRoutes')(nav);
const authRouter = require('./src/routes/userAuth')(app);
const reviewRouter = require('./src/routes/review')(nav);
const cartRouter = require('./src/routes/cartRoute')(nav);

app.use('/books', bookRouter);
// app.use('/admin', adminRouter);
app.use('/user/signin', authRouter);
app.use('/review', reviewRouter);
app.use('/cart', cartRouter);

app.get('/', (req, res) => {
  res.render(
    'user/signin',
    {
      nav: [{ link: '/books', title: 'Books' },
      { link: '/authors', title: 'Authors' },
        { link: '/cart', title: 'Cart'}],
      title: 'Library',
      messages: {danger: req.flash('danger'), warning: req.flash('warning'), success: req.flash('success')}

    }
  );
});

app.listen(port, () => {
  debug(`listening at port ${chalk.green(port)}`);
});

