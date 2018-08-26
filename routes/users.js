const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Tip = require('../models/tip');
const Match = require('../models/match')

/* GET users listing. */
router.get('/', requiresLogin, function(req, res, next) {
  Tip.get_all_tips(req.session.userID, function(callback) {
    User.get_info(req.session.userID, function(info) {
      if (info) {
        Match.get_all_results(function(results) {
          if (results) {
            callback["username"] = req.session.username;
            callback["points"] = info.points;
            callback["champion"] = info.champion;
            callback["results"] = results;
            res.render('profile', callback);
          }
        })
      }
    });
  });
});


router.put('/tip/:mID', requiresLogin, (req, res) => {
  let scoreTeam1 = req.body.scoreTeam1;
  let scoreTeam2 = req.body.scoreTeam2;
  let userID = req.session.userID;
  let matchID = req.params.mID;
  Tip.update_a_tip(scoreTeam1, scoreTeam2, userID, matchID, function(callback) {
    if (callback) {
      res.end();
    } else {
      res.end();
    }
  });
});

router.get('/tip/:mID', requiresLogin, (req, res) => {
  let matchID = req.params.mID;
  Tip.get_match_tips(matchID, function(callback) {
    if (callback) {
      res.send(callback);
    } else {
      res.end();
    }
  })
})

router.get('/leaderboard', (req, res) => {
  User.get_leaderbord(function(callback) {
    if (callback) {
      User.get_info(req.session.userID, function(info) {
        if (info) {
          res.render('leaderboard', {
            username: req.session.username,
            points: info.points,
            champion: info.champion,
            leaderboard: callback
          });
        }
      });
    }
  })
})

// router.put('/champion/:champion', (req, res) => {
//   let userID = req.session.userID;
//   let champion = req.params.champion;
//   User.update_champion(userID, champion, function(callback) {
//     if (callback) {
//       res.sendStatus(200)
//     }
//   })
// })


function requiresLogin(req, res, next) {
  if (req.session && req.session.userID) {
    return next();
  } else {
    var err = new Error("You are not logged in!");
    err.status = 401;
    return next(err);
  }
}
module.exports = router;