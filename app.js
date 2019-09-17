const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');

const app = express();

//Map global promise - get rid of warning
mongoose.Promise = global.Promise;

// Connect to mongoose
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
})

const port = 5000;

app.listen(port, function(){
  console.log(`the boilerPlate server is listening on port ${port}`)
})