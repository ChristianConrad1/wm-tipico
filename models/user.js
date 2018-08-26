var bcrypt = require('bcryptjs');
const saltRounds = 10;
const connection = require('./sql');

exports.authenticate = function authenticate(username, password, callback) {
  if (username != null && username.length > 2 && password != null && password.length > 2) {
    connection.query("SELECT * FROM Users WHERE username = '" + username + "'", (err, result, fields) => {
      if (err) {
        console.error(err);
        callback(err);
      } else {
        if (result.length == 0) {
          console.error("User not Found");
          callback("User not Found");
        } else {
          let user = result[0];
          let hashed_password = user.password;
          if (bcrypt.compareSync(password, hashed_password)) {
            callback(null, user.userID);
          } else {
            console.error("Password Wrong");
            callback("Password Wrong");
          }
        }
      }
    });
  }
}

exports.create_a_user = function create_a_user(username, password, callback) {
  if (username != null && username.length > 2 && password != null && password.length > 2) {
    bcrypt.hash(password, saltRounds, function(err, hash) {
      connection.query("insert into Users(username, password) values('" + username + "', '" + hash + "')", (err, results, fields) => {
        if (err) {
          console.error('Query connection failed: ' + err.stack);
          callback("Error")
        } else {
          callback(results.insertId);
        }
      });
    });
  }
}

exports.get_info = function get_info(userID, callback) {
  if (userID != null) {
    let query = "SELECT points, champion FROM Users WHERE userID = " + userID;
    connection.query(query, (err, result) => {
      if (err) {
        console.error('Query connection failed: ' + err.stack);
        return;
      } else {
        callback(result[0]);
      }
    });
  }
}

exports.update_all_points = function get_all_points(callback) {
  connection.query("SELECT COUNT(userID) AS users FROM USERS", (err, results, fields) => {
    if (err) {
      console.error('Query connection failed: ' + err.stack);
      return;
    } else {
      connection.query("SELECT * FROM Matches", (err, matches, fields) => {
        if (err) {
          console.error('Query connection failed: ' + err.stack);
          return;
        } else {
          for (let i = 1; i <= results[0].users; i++) {
            connection.query("SELECT * FROM Tips WHERE userID = " + i + "", (err, tips, fields) => {
              if (err) {
                console.error('Query connection failed: ' + err.stack);
                return;
              } else {
                let points = 0;
                for (let j = 0; j < matches.length; j++) {
                  let mscoreTeam1 = matches[j].scoreTeam1;
                  let mscoreTeam2 = matches[j].scoreTeam2;
                  let mresult = matches[j].result;
                  let mdifference = matches[j].difference;
                  let tscoreTeam1 = tips[j].scoreTeam1;
                  let tscoreTeam2 = tips[j].scoreTeam2;
                  let tresult = tips[j].result;
                  let tdifference = tips[j].difference;
                  if (mscoreTeam1 === tscoreTeam1 && mscoreTeam2 === tscoreTeam2) {
                    points += 3;
                  } else if (mdifference === tdifference && tdifference != null) {
                    points += 2;
                  } else if (mresult === tresult && tresult != null) {
                    points += 1;
                  }
                }
                let query = "UPDATE Users SET points = " + points + " WHERE userID = " + i + "";
                connection.query(query, (err, result) => {
                  if (err) {
                    console.error('Query connection failed: ' + err.stack);
                    return;
                  }
                });
              }
            });
          }
        }
      });
    }
  });
}

exports.get_leaderbord = function get_leaderbord(callback) {
  let query = "SELECT username, points, champion FROM Users ORDER BY points DESC";
  connection.query(query, (err, result) => {
    if (err) {
      console.error('Query connection failed: ' + err.stack);
      return;
    } else {
      callback(result);
    }
  });
}

// exports.update_champion = function update_champion(userID, champion, callback) {
//   let query = "UPDATE Users SET champion = '" + champion + "' WHERE userID = " + userID + "";
//   connection.query(query, (err, result) => {
//     if (err) {
//       console.error('Query connection failed: ' + err.stack);
//       return;
//     } else {
//       callback(result);
//     }
//   });
// }