var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Tip = require('../models/tip');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'WM Tipico',
    message: req.flash('loginMessage'),
  });
});

router.post('/register', function(req, res, next) {
  if (req.body.password != req.body.passwordConf) {
    var err = "Passwords do not match.";
    req.flash('loginMessage', err);
    res.redirect('/');
  } else if (req.body.username && req.body.password && req.body.passwordConf) {
    let username = req.body.username;
    let password = req.body.password;
    User.create_a_user(username, password, function(insertId) {
      if (insertId === "Error") {
        req.flash('loginMessage', "Fehler");
        res.redirect('/');
      } else {
        Tip.create_tips(insertId, function(callback) {
          if (callback) {
            req.session.userID = insertId;
            req.session.username = req.body.username;
            return res.redirect('/users');
          }
        });

      }
    })
  } else {
    let error = "All fields are required";
    req.flash('loginMessage', error);
    res.redirect('/');
  }
});

router.post('/login', function(req, res, next) {
  if (req.body.username && req.body.password) {
    User.authenticate(req.body.username, req.body.password, function(error, user) {
      if (error || !user) {
        console.log("Error");
        console.log(error);
        req.flash('loginMessage', error);
        res.redirect('/');
      } else {
        req.session.userID = user;
        req.session.username = req.body.username;
        return res.redirect('/users')
      }
    })
  } else {
    var err = 'All fields are required';
    req.flash('loginMessage', err);
    res.redirect('/');
  }
})

router.get('/logout', function(req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

module.exports = router;