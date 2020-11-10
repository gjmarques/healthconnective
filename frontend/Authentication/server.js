const express = require('express')
const app = express()
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "ES",
    password: "12345678",
    database: "ES"
  });


con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to DATABASE!");
});


// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.get("/verify", (req, res, next) => {

        var sql = "Select * From User where email='"+req.query.email+"'";
        con.query(sql, function (err, result) {
          if (err) throw err;
          if(result.length > 0){
            res.json({valid : 1, result:result});
          }else{
            res.json({valid : 0});

          }
          con.end;
        });
   
});



app.get("/add", (req, res, next) => {

    var sql = "INSERT INTO User (email,utente, medico) VALUES ('"+req.query.e+"', "+ req.query.u+"," + req.query.m +"); ";
    con.query(sql, function (err, result) {
      if (err) throw err;
      res.json({valid : 1, result:result});
    });

});


app.listen(3001)
