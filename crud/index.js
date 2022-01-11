const bodyparser = require('body-parser');
const flash = require("connect-flash");
const express = require('express');
const session = require('express-session');
const path = require('path');
const routes = require('./routes');
const app = express();
const nodemailer = require('nodemailer');
const port = process.env.PORT || 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(session({
    name: 'session',
    secret: 'my_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 3600 * 1000, // 1hr
    }
}));
app.use(flash());

app.use(express.static(path.join(__dirname, 'public')));
app.use(routes);

app.use((err, req, res, next) => {
    console.log(err);
    return res.send('Internal Server Error');
});

app.listen(port, () => {
    console.log(`Server is runngin on port ${port}`);
});