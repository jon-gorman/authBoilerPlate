const express = require('express');
const exphbs = require('express-handlebars');
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

//Add idea form
app.get('/ideas/add', function(req, res){
  res.render('ideas/add')
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
        res.redirect('/ideas');
      })
  }
  // console.log(req.body);
  // res.send('ok')
});

const port = 5000;

app.listen(port, function(){
  console.log(`the boilerPlate server is listening on port ${port}`)
})