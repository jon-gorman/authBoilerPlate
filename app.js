const express = require('express');

const app = express();

//Index Route
app.get('/', function(req, res){
  res.send('INDEX');
});

//About Route
app.get('/about', function(req, res){
  res.send('ABOUT');
})

const port = 5000;

app.listen(port, function(){
  console.log(`the boilerPlate server is listening on port ${port}`)
})