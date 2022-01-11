const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyparser = require('body-parser');
const mysql = require('mysql');
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const { check, validationResult } = require('express-validator');
const { urlencoded } = require('body-parser');
const urlencodedparser = urlencoded({ extended: false });


const connection = mysql.createConnection({
    host: "localhost",
    user: "bansi",
    password: "mysqlserver2021",
    database: "employee"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Database Connected!");
});
//set view file
app.set('views', path.join(__dirname, 'views'));

//set view engine
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(session({
    secret: "secret",
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

app.get("/", (req, res) => {
    let sql = "SELECT * FROM emp_data";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        //console.log(rows);
        res.render('user_index', { data: rows, message: req.flash('message') });
    });
});

app.get("/add", (req, res) => {
    res.render("emp_add");

});
app.post("/save", urlencodedparser, [
    check('email', 'Invalid Email Address').isEmail(),
    check('salary', 'Numbers Only').isNumeric(),
    check('phone', 'Enter valid Phone Number').isMobilePhone()
], (req, res) => {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
        return res.status(422).json(errors.array());
       //var alert = errors.array();
       // return res.send({ alert }); 
    }
    else{
    let data = { name: req.body.name, position: req.body.position, office: req.body.office, salary: req.body.salary, phone: req.body.phone, email: req.body.email }
    let sql = "INSERT INTO emp_data SET ?";
    let query = connection.query(sql, data, (err, results) => {
        if (err) throw err;
        req.flash('message', 'Record Inserted Successfully');
       // res.render('user_index',{alert})
        res.redirect("/");
    });
    }
});

app.get("/update/:rowid", (req, res) => {
    const rowid = req.params.rowid;
    let sql = `SELECT * FROM emp_data WHERE id =${rowid}`;
    let query = connection.query(sql, (err, result) => {
        if (err) throw err;
        //console.log(result);
        req.flash('message', 'Record Updated Successfully');
        res.render("emp_update", { row: result[0] });
    });
});

app.post("/update", (req, res) => {
    const rowid = req.body.id;
    let sql = "UPDATE emp_data SET name ='" + req.body.name + "' ,position = '" + req.body.position + "' ,office ='" + req.body.office + "',salary ='" + req.body.salary + "',phone ='" + req.body.phone + "', email ='" + req.body.email + "' WHERE id = " + rowid;
    let query = connection.query(sql, (err, results) => {
        if (err) throw err;
        res.redirect("/");
    });
});

app.get("/delete/:rowid", (req, res) => {
    const rowid = req.params.rowid;
    let sql = `DELETE  FROM emp_data WHERE id =${rowid}`;
    let query = connection.query(sql, (err, result) => {
        if (err) throw err;
        req.flash('message', 'Record Deleted Successfully');
        res.redirect("/");
    });
});



app.listen(5000, () => {
    console.log("server is listing at port 5000");
});

