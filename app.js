const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const app = express();

//Map global promise - get rid of warning
mongoose.Promise = global.Promise;

// Connect to mongoose here
mongoose.connect('mongodb://localhost/auth-boiler', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(function() {
  console.log('Mongodb Connected')
}).catch(err => console.log(err));

//Load idea Model
require('./models/Idea');
const Idea = mongoose.model('ideas')


//Express handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

//Method override MiddleWare
app.use(methodOverride('_method'));


//Express Session Middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));


//Flash middleware
app.use(flash())

//Global variable
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
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


//Idea Index Page
app.get('/ideas', function(req, res){
  //Bring in the data from mongodb
  Idea.find({})
    .sort({date: 'desc'})
    .then(function(ideas){
      res.render('ideas/index', {
        ideas: ideas
      })
    })
});

//Add idea form
app.get('/ideas/add', function(req, res){
  res.render('ideas/add')
});

//Edit idea form
app.get('/ideas/edit/:id', function(req, res){
  Idea.findOne({
    // req.params.id returns only the id value. req.params will return key value pair i.e. "id: 123455..."
    _id: req.params.id
  })
    .then(function(idea){
      res.render('ideas/edit', {
        idea: idea
      })
    })
});


//Process Form
app.post('/ideas', function(req, res){
  //Server side validation
  let errors = [];
  if(!req.body.title){
    errors.push({text: "Please add a Title"})
  }
  if(!req.body.details){
    errors.push({text: "Please add some Details"})
  }
  if(errors.length > 0){
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    })
    //end of validation
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details
    };
    new Idea(newUser)
      .save()
      .then(function(idea) {
        req.flash('success_msg', 'idea has been added');

        res.redirect('/ideas');
      })
  }
  // console.log(req.body);
  // res.send('ok')
});

//Edit Form Process

app.put('/ideas/:id', function(req, res){
  Idea.findOne({
    _id: req.params.id
  })
    .then(function(idea){
      //new values
      idea.title = req.body.title;
      idea.details = req.body.details;
      idea.save()
        .then(function(idea){
          req.flash('success_msg', 'idea has been updated');
          res.redirect('/ideas')
        })
    })
});

//Delete Idea
app.delete('/ideas/:id', function(req, res){
  Idea.deleteOne({_id: req.params.id})
    .then(function(){
      req.flash('success_msg', 'idea has been removed');
      res.redirect('/ideas')
    });
});

const port = 5010;

app.listen(port, function(){
  console.log(`the boilerPlate server is listening on port ${port}`)
})