const express = require('express');
//path is for connecting files in public folder
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');



const app = express();

// Load Routes from Routes file
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//Passport config
require('./config/passport')(passport);

//Map global promise - get rid of warning
mongoose.Promise = global.Promise;

// Connect to mongoose here
mongoose.connect('mongodb://localhost/auth-boiler', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(function() {
  console.log('Mongodb Connected')
}).catch(err => console.log(err));


//Express handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());


//Static folder brings in the public folder and joins it
//express folder to the static folder
app.use(express.static(path.join(__dirname, 'public')))

//Method override MiddleWare
app.use(methodOverride('_method'));


//Express Session Middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));

//Passport middleware
//this needs to go after express session
//Straight form docs
app.use(passport.initialize());
app.use(passport.session());

//Flash middleware
app.use(flash())

//Global variable
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  //this is for only logged in!
  res.locals.user = req.user || null;
  next();
});

//Index Route
app.get('/', function(req, res){
  const title = "Welcome today";
  //Pass results into the view
  res.render('index', {
    title: title
  });
});

//About Route
app.get('/about', function(req, res){
  res.render('about');
});




//Use routes
app.use('/ideas', ideas);
app.use('/users', users);

const port = 5010;

app.listen(port, function(){
  console.log(`the boilerPlate server is listening on port ${port}`)
})