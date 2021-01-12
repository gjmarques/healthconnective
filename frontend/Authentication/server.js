const express = require('express')
const app = express()
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "ES",
    password: "12345678",
    database: "ES"
  });


//Create DB if not exists  
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "CREATE TABLE if not exists User (id int primary key auto_increment, email VARCHAR(255), utente int, medico int)";
  con.query(sql, function (err, result) {
    if (err) throw err;
    var sql = "CREATE TABLE if not exists Consultas (id int primary key auto_increment, email VARCHAR(255), medico VARCHAR(255), date VARCHAR(255), downloadid VARCHAR(255))";
      con.query(sql, function (err, result) {
        if (err) throw err;
        var sql = "CREATE TABLE if not exists Receitas (id int primary key auto_increment, email VARCHAR(255), receita VARCHAR(255), image VARCHAR(5000))";
        con.query(sql, function (err, result) {
          if (err) throw err;
        });
      });
   });
  con.end;
});

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

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
    var http = require('https');
    var sql = "INSERT INTO User (email,utente, medico) VALUES ('"+req.query.e+"', "+ req.query.u+"," + req.query.m +"); ";
    con.query(sql, function (err, result) {
      if (err) throw err;
      res.json({valid : 1, result:result});
    });

    if (req.query.m === "1"){
      var jwt = require('jsonwebtoken');
      var toke = jwt.sign({iat: Math.floor(Date.now() / 1000) - 60 , email: req.query.e }, 'calendar');
      http.get('https://2a819c504f32.ngrok.io/register?token=' + toke, (resp) => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
          data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          console.log("");
        });

      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
    }

});


app.get("/jwt", (req, res, next) => {
  var jwt = require('jsonwebtoken');
  var toke = jwt.sign({iat: Math.floor(Date.now() / 1000) - 60 , email: req.query.e }, 'calendar',);
  res.json({token : toke})
  
});


app.get("/addConsulta", (req, res, next) => {
  var sql = "INSERT INTO Consultas (email, medico, date, downloadid) VALUES ('"+req.query.e+ "', '" + req.query.m +"', '"+ req.query.d +"', '"+ req.query.i + "'); ";
  con.query(sql, function (err, result) {
    if (err) throw err;
          res.json({valid : 0});
          con.end;
  });
});


app.get("/remConsulta", (req, res, next) => {
  var sql = "Delete from Consultas where email='"+req.query.e+ "'AND date= '" + req.query.d  + "'; ";
  con.query(sql, function (err, result) {
    if (err) throw err;
          res.json({valid : 1});
          con.end;
  });
});

app.get("/getConsultas", (req, res, next) => {
  var sql = "Select * From Consultas where email='"+req.query.e+"'";
        con.query(sql, function (err, result) {
          if (err) throw err;
          if(result.length > 0){
            res.json({valid : 1, result:result.sort((a, b) => new Date(a.date) - new Date(b.date))});
          }else{
            res.json({valid : 0});
          }
          con.end;
        });
});

app.get("/temConsulta", (req, res, next) => {
  var sql = "Select * From Consultas where email='"+req.query.e+"' and date='" + req.query.d + "';";
        con.query(sql, function (err, result) {
          if (err) throw err;
          if(result.length > 0){
            res.json({valid : 1});
          }else{
            res.json({valid : 0});
          }
          con.end;
        });
});

app.get("/getUserByEmail", (req, res, next) => {
  var sql = "Select * From user where email='"+req.query.e+ "';";
        con.query(sql, function (err, result) {
          if (err) throw err;
          if(result.length > 0){
            res.json({valid : 1,  result:result});
          }else{
            res.json({valid : 0});
          }
          con.end;
        });
});


app.get("/getUserReceitas", (req, res, next) => {
  var sql = "Select * From Receitas where email='"+req.query.e+ "';";
        con.query(sql, function (err, result) {
          if (err) throw err;
          if(result.length > 0){
            res.json({valid : 1,  result:result});
          }else{
            res.json({valid : 0});
          }
          con.end;
        });
});

app.get("/addReceita", (req, res, next) => {
  var sql = "INSERT INTO Receitas (email, receita, image) VALUES ('"+req.query.e+ "', '" + req.query.r +"', '"+ req.query.i + "'); ";
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.json({valid : 1});
    con.end;
  });
});


app.listen(3001)
