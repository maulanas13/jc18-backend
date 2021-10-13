const mysql = require('mysql2');

const connection = mysql.createConnection({
    port: 3306,
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'belajar_mysql_01'
  });

  connection.connect((err) => {
    if (err) {
      console.error("error connecting: " + err.stack);
      return;
    }
    console.log("connected as id " + connection.threadId);
  });

  module.exports = connection;