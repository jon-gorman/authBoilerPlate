const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

//Load User Model
require('../models/Users');
const User = mongoose.model('user')


//Authentication start
//User Login
router.get('/login', function(req, res){
  res.render('users/login')
});
//User Register
router.get('/register', function(req, res){
  res.render('users/register')
});

//Login Form POST
router.post('/login', function(req, res, next){
  passport.authenticate('local', {
    successRedirect: '/ideas',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next)
});


//Register Form POST
router.post('/register', function(req, res){
  let errors = [];
  if(req.body.password != req.body.password2){
    errors.push({text: "Passwords do not match"});
  }
  if(req.body.password.length < 4){
    errors.push({text: "Passwords must be at least 4 characters"});
  }
  //Pass these back in so the form doesnt have to clear if something is wrong
  if(errors.length > 0){
    res.render('users/register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  }
else{
  //Check for double users
  User.findOne({email: req.body.email})
    .then(function(user){
      if(user){
        req.flash('error_msg', 'Email is already registered');
        res.redirect('/users/register')
      }else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        });
        bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(newUser.password, salt, function(err, hash){
            if(err) throw err;
            newUser.password = hash;
            newUser.save()
              .then(function(user){
                req.flash('success_msg', 'You are now registered and can log in');
                res.redirect('/users/login')
              })
              .catch(function(err){
                console.log(err);
                return
              })
          })
        })
      }
    });
  }
});
//Logout user
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success_msg', 'You have logged out')
  res.redirect('/users/login')
})


module.exports = router;