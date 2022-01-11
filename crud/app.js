const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyparser = require('body-parser');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
var i1 = [];
const connection = mysql.createConnection({
    host: "localhost",
    user: "bansi",
    password: "mysqlserver2021",
    database: "todolistdb"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Database Connected!");
});
//set view file
app.set('views', path.join(__dirname, 'views'));

//set view engine
app.set('view engine', 'ejs');
//app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.get("/", (req, res) => {
    let sql = "SELECT * FROM todo";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        //console.log(rows);                
        res.render('list', { item: rows });
    });
});

app.get("/",(req,res)=>{
    res.render("list");

});

app.post("/", (req, res) => {     
    let newListItem ={n:req.body.n} ;
    console.log(newListItem);
    let sql ="INSERT INTO todo SET ?";
    let query = connection.query(sql,newListItem, (err,results)=>{
        if(err) throw err;
        //res.redirect("/");
    });   
});

app.listen(4200, () => {
    console.log("server is listing at port 4200");
});
