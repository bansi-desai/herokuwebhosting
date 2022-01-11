const { validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const path = require('path');
var dbPath = path.join(__dirname, '.', '', 'dbConnection');
console.log("--- mylog ---")
console.log(__dirname)
console.log(dbPath)
const dbConnection = require("../lib/dbconnection");

const nodemailer = require('nodemailer');
const flash = require("connect-flash");
const session = require("express-session");
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'bansipatel7395@gmail.com',
        pass: 'banu@7395'
    }
});

// launch Page
exports.launchPage = async (req, res, next) => {
    const [row] = await dbConnection.execute("SELECT * FROM `users` WHERE `id`=?", [req.session.userID]);
    const [rows] = await dbConnection.execute("SELECT * FROM emp_data");
    if (row.length !== 1) {
        return res.redirect('/logout');
    }
    res.render('user_index', {
        user: row[0],
        data: rows,
        message: req.flash('message'),             
    });
};
// emp_add page
exports.emp_addPage= (req, res, next) => {    
    res.render("emp_add", {rdata: req});
};
//save 
exports.save = async (req, res, next) => {         
    const errors = validationResult(req);
    const { body } = req;     
     console.log(errors) 
    if (!errors.isEmpty()) {          
       return res.render('emp_add', {
            rdata: body,
            error: errors.array()[0].msg,
        });                 
    }   
    try {                      
        const [rows] = await dbConnection.execute(
            "INSERT INTO `emp_data`(`name`,`position`,`office`,`salary`,`phone`,`email`) VALUES(?,?,?,?,?,?)",
            [body.name, body.position, body.office, body.salary, body.phone, body.email]
        );               
        console.log(rows); 
        if (rows.affectedRows !== 1) {
            return res.render('emp_add', {              
                error: 'Your Record has failed To Insert.'
            });           
        }   
        else{ 
            req.flash('message', 'Record Inserted Successfully');
            res.redirect('/');  
        }
      
    } catch (e) {
        console.log(e);
        next(e);
    }
};
//emp_updatePage
exports.emp_updatePage= async (req, res, next) => {        
    const [rows] = await dbConnection.execute(`SELECT * FROM emp_data WHERE id =?`, [req.params.id]);    
    res.render("emp_update",{row:rows[0]});
};

// update
exports.update = async (req, res, next) => { 
    console.log('i m here update');    
    const errors = validationResult(req);
    const { body } = req;
     console.log(errors) 
    if (!errors.isEmpty()) {
        return res.render('emp_update', {
            row: body,
            error: errors.array()[0].msg,
           // error: errors.array()[0].msg                       
        });       
    }   
    try {           
        const [update] = await dbConnection.execute(
             "UPDATE emp_data SET name ='" + req.body.name + "' ,position = '" + req.body.position + "' ,office ='" + req.body.office + "',salary ='" + req.body.salary + "',phone ='" + req.body.phone + "', email ='" + req.body.email + "' WHERE id = "+req.body.id);              
            // "UPDATE `emp_data` SET `name`=?,`position`=?,`office`=?,`salary`=?,`phone`=?, `email`=? WHERE `id`=?",
            // [body.name,body.position,body.office,body.salary,body.phone, body.email, req.params.id]);
        console.log(update);
        req.flash('message', 'Record Updated Successfully');                        
        res.redirect('/');
    } catch (e) {
        console.log(e);
        next(e);
    }
};
//delete
exports.deleteemp = async (req, res, next) => {   
    try {  
      const [rows] = await dbConnection.execute(
        "DELETE FROM `emp_data` WHERE `id`=?",
        [req.params.id] 
      );
  
      if (rows.affectedRows === 0) {
        return res.status(404).json({
          message: "Invalid user ID (No User Found!)",
        });
      } 
      req.flash('message', 'Record Has Been Deleted Successfully');
      res.redirect('/');
      console.log("hey i m here delete ");            
      
    } catch (err) {
      next(err);
    }
  
  };


//about us Page
exports.aboutusPage =  (req, res, next) => {  
    res.render('about_us');
};

//contact us Page
exports.contactusPage =  (req, res, next) => {  
    res.render('contact_us');
};
//contact
exports.contact = async (req, res, next) => {  
    const errors = validationResult(req);
    const { body } = req;
    if (!errors.isEmpty()) {
        return res.render('contact_us', {
            error: errors.array()[0].msg
        });
    }          
    try {

        const [rows] = await dbConnection.execute(
            "INSERT INTO `contact`(`name`,`email`,`message`) VALUES(?,?,?)",
            [body.name, body.email, body.msg]
        );

        if (rows.affectedRows !== 1) {
            return res.render('contactus', {
                error: 'Your request has failed.'
            });
        }
        
        if (rows.affectedRows > 0) {
            //the code for affirmation
            var mailOptions = {
                from:'bansipatel7395@gmail.com',
                to: [body.email],
                subject: 'Message From Employee Management System',
                text: ` Hello ${body.name},Thank You So much for reaching out! Just Confirming that we've received your Message and will be in touch within few hours with a more complete response.`
            }

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    //Handle error here
                    res.send('Please try again!');
                } else {
                    console.log('Email sent: ' + info.response);
                    res.send('Thanks for Contact Us!');
                }
            });    
        }
        res.render("contact_us");
    }catch (e) {
        next(e);
    }
    }
     

// Register Page
exports.registerPage = (req, res, next) => {
    res.render("register");
};

// User Registration
exports.register = async (req, res, next) => {
    const errors = validationResult(req);
    const { body } = req;

    if (!errors.isEmpty()) {
        return res.render('register', {
            error: errors.array()[0].msg
        });
    }

    try {

        const [row] = await dbConnection.execute(
            "SELECT * FROM `users` WHERE `email`=?",
            [body._email]
        );

        if (row.length >= 1) {
            return res.render('register', {
                error: 'This email already in use.'
            });
        }

        const hashPass = await bcrypt.hash(body._password, 12);

        const [rows] = await dbConnection.execute(
            "INSERT INTO `users`(`name`,`email`,`password`) VALUES(?,?,?)",
            [body._name, body._email, hashPass]
        );

        if (rows.affectedRows !== 1) {
            return res.render('register', {
                error: 'Your registration has failed.'
            });
        }

        if (rows.affectedRows > 0) {
            //the code for affirmation
            var mailOptions = {
                from: 'bansipatel7395@gmail.com',
                to: [body._email],
                subject: 'Sending Email using Node.js',
                text: 'You Have Successfully Registered!'
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    //Handle error here
                    res.send('Please try again!');
                } else {
                    console.log('Email sent: ' + info.response);
                    res.send('Thanks for registering!');
                }
            });
        }

        res.render("register", {
            msg: 'You have successfully registered.'
        });

    } catch (e) {
        next(e);
    }
};

// Login Page
exports.loginPage = (req, res, next) => {
    res.render("login");
};

// Login User
exports.login = async (req, res, next) => {

    const errors = validationResult(req);
    const { body } = req;

    if (!errors.isEmpty()) {
        return res.render('login', {
            error: errors.array()[0].msg
        });
    }

    try {

        const [row] = await dbConnection.execute('SELECT * FROM `users` WHERE `email`=?', [body._email]);

        if (row.length != 1) {
            return res.render('login', {
                error: 'Invalid email address.'
            });
        }

        const checkPass = await bcrypt.compare(body._password, row[0].password);

        if (checkPass === true) {
            req.session.userID = row[0].id;
            return res.redirect('/');
        }
        else{
            res.render('login', {
                error: 'Invalid Password.'
            });
        }
    }
    catch (e) {
        next(e);
    }

}