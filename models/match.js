const connection = require('./sql');
const date = require('date-and-time');

exports.update_a_match = function update_a_match(matchID, scoreTeam1, scoreTeam2, callback) {
  let difference = scoreTeam1 - scoreTeam2;
  let result;
  if (scoreTeam1 > scoreTeam2) {
    result = 1
  } else if (scoreTeam1 == scoreTeam2) {
    result = 0;
  } else if (scoreTeam1 < scoreTeam2) {
    result = -1;
  }
  connection.query("UPDATE Matches SET scoreTeam1 = " + scoreTeam1 + ", scoreTeam2 = " + scoreTeam2 + ", result =" + result + ", difference = " + difference + " WHERE matchID = " + matchID + "", (err, result, fields) => {
    if (err) {
      console.error('Query connection failed: ' + err.stack);
      return;
    }
    callback(result);

  });
}

exports.get_all_results = function get_all_results(callback) {
  connection.query("SELECT matchID, scoreTeam1, scoreTeam2, startTime FROM Matches", (err, result, fields) => {
    if (err) {
      console.error('Query connection failed: ' + err.stack);
      return;
    }
    let matchResults = {};
    let Now = new Date();
    Now = date.addHours(Now, 2);
    result.forEach(function(element) {
      let startingTime = date.parse(element.startTime, 'YYYY-DD-MM HH:mm:ss');
      if (Now > startingTime) {
        if (element.scoreTeam1 != null) {
          matchResults["result" + element.matchID] = element.scoreTeam1 + " : " + element.scoreTeam2;
        } else {
          matchResults["result" + element.matchID] = "running";
        }
      }
    })
    callback(matchResults);
  });
}

exports.get_last_match = function get_last_match(callback) {
  connection.query("SELECT MAX(matchID) AS matchID FROM MATCHES WHERE scoreTeam1 IS NOT NULL", (err, result, fields) => {
    if (err) {
      console.console.error(err.stack);
      return;
    } else {
      callback(parseInt(result[0]["matchID"]) + 1);
    }
  })
}