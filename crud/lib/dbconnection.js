const mysql = require('mysql2');

const dbConnection = mysql.createPool({
    host: 'localhost',
    user: "bansi",
    password: "mysqlserver2021",
    database: 'nodejs_login'
});

module.exports = dbConnection.promise();
