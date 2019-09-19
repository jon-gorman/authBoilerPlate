//Here is the strategy for passport

const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt  = require('bcryptjs');

//Load User model
const User = mongoose.model('user');

module.exports = function(passport){
  passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
    //Check for user
    User.findOne({
      email: email
    }).then(user =>{
      if(!user){
        //error as first param, so say null, second takes user, so no user say false, third will be the message,
        //so say
        return done(null, false, {message: 'No User Found'})
      }
      //Match Password
      //the user here in .compare is coming from the .then(user) above which is encrypted so its comparing the
      //non hashed password to the hashed password.
      bcrypt.compare(password, user.password, function(err, isMatch){
        if(isMatch){
          return done(null, user);
        }else {
          return done(null, false, {message: 'Password Incorrect'})
        }
      })
    })
    }));
  //this is straight from the passport docs
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};