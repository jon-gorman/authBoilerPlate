const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const IdeaSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  details:{
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Ideas', IdeaSchema);

//Now bring into app.js
//Attention*** make sure that all references to the model are consistent with punctuation
//as in never say ideas or idea if the file name is Idea or Ideas always keep like file name....