const saltRounds = 10;
const connection = require('./sql');
const date = require('date-and-time');

exports.create_tips = function create_tips(userID, callback) {
  if (userID != null) {
    let query = "";
    for (i = 0; i < 48; i++) {
      query += "('0', '0', '0', '0','" + userID + "', '" + i + "'),"
    }
    query = query.slice(0, -1);
    connection.query("INSERT INTO TIPS(scoreTeam1, scoreTeam2, result, difference, userID, matchID) VALUES " + query + "", (err, result) => {
      if (err) {
        console.error('Query connection failed: ' + err.stack);
        return;
      } else {
        callback(result);
      }
    });
  }
}

exports.update_a_tip = function update_a_tip(scoreTeam1, scoreTeam2, userID, matchID, callback) {
  if (scoreTeam1 != null && scoreTeam2 != null && userID != null && matchID != null) {
    connection.query("SELECT startTime FROM Matches WHERE matchID = '" + matchID + "'", (err, startTime, fields) => {
      if (err) {
        console.error('Query connection failed: ' + err.stack);
        return;
      } else {
        let startingTime = date.parse(startTime[0].startTime, 'YYYY-DD-MM HH:mm:ss');
        let Now = new Date();
        Now = date.addHours(Now, 2);
        if (Now < startingTime) {
          let difference = scoreTeam1 - scoreTeam2;
          let result;
          if (scoreTeam1 > scoreTeam2) {
            result = 1
          } else if (scoreTeam1 == scoreTeam2) {
            result = 0;
          } else if (scoreTeam1 < scoreTeam2) {
            result = -1;
          }
          connection.query("REPLACE into Tips(scoreTeam1, scoreTeam2, result, difference, userID, matchID) VALUES ('" + scoreTeam1 + "','" + scoreTeam2 + "','" + result + "','" + difference + "','" + userID + "','" + matchID + "')", (err, result, fields) => {
            if (err) {
              console.error('Query connection failed: ' + err.stack);
              return;
            }
            callback(result);
          });
        } else {
          callback("to late");
        }
      }
    });
  }
}

exports.get_all_tips = function get_all_tips(userID, callback) {
  if (userID != null) {
    connection.query("SELECT scoreTeam1, scoreTeam2, matchID FROM Tips WHERE userID = '" + userID + "'", (err, result, fields) => {
      if (err) {
        console.error('Query connection failed: ' + err.stack);
        return;
      } else {
        let tips = {}
        result.forEach(function(element) {
          let match1 = "a" + element.matchID + "0";
          let match2 = "a" + element.matchID + "1";
          tips[match1] = element.scoreTeam1;
          tips[match2] = element.scoreTeam2;
        });
        callback(tips);
      }
    })
  }
}

exports.get_match_tips = function get_match_tips(matchID, callback) {
  if (matchID != null) {
    connection.query("SELECT scoreTeam1, scoreTeam2 from MATCHES WHERE matchID ='" + matchID + "'", (err, scores, fields) => {
      if (err) {
        console.error('Query connection failed: ' + err.stack);
        return;
      } else {
        let mscoreTeam1 = scores[0].scoreTeam1;
        let mscoreTeam2 = scores[0].scoreTeam2;
        connection.query("SELECT t.scoreTeam1, t.scoreTeam2, u.username FROM Tips t JOIN USERS u ON t.userID = u.userID WHERE t.matchID ='" + matchID + "'", (err, result, fields) => {
          if (err) {
            console.error('Query connection failed: ' + err.stack);
            return;
          } else {
            result.forEach(function(element) {
              let points = 0;
              if (mscoreTeam1 == element.scoreTeam1 && mscoreTeam2 == element.scoreTeam2) {
                points = 3;
              } else if (mscoreTeam1 - mscoreTeam2 == element.scoreTeam1 - element.scoreTeam2) {
                points = 2;
              } else if (Math.sign(mscoreTeam1 - mscoreTeam2) === Math.sign(element.scoreTeam1 - element.scoreTeam2)) {
                points = 1;
              }
              //  console.log(element);
              element["points"] = points;
              result.element = element
            });
            callback(result);
          }
        })
      }
    })

  }
}

// exports.create_new_tips = function create_new_tips(callback) {
//   console.log("looo");
//   let query = "";
//   for (j = 1; j < 13; j++) {
//     for (i = 48; i < 64; i++) {
//       query += "('0', '0', '0', '0','" + j + "', '" + i + "'),"
//     }
//   }
//   query = query.slice(0, -1);
//   console.log(query);
//   connection.query("INSERT INTO TIPS(scoreTeam1, scoreTeam2, result, difference, userID, matchID) VALUES " + query + "", (err, result) => {
//     if (err) {
//       console.error('Query connection failed: ' + err.stack);
//       return;
//     } else {
//       callback(result);
//     }
//   });
//
// };