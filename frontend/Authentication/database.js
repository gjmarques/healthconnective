var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "ES",
  password: "12345678",
  database: "ES"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "CREATE TABLE if not exists User (id int primary key auto_increment, email VARCHAR(255), utente int, medico int)";
  con.query(sql, function (err, result) {
    if (err) throw err;
    var sql = "CREATE TABLE if not exists Consultas (id int primary key auto_increment, email VARCHAR(255), medico VARCHAR(255), date VARCHAR(255))";
      con.query(sql, function (err, result) {
        if (err) throw err;
        
      });
    con.end;
   });
  con.end;
});



