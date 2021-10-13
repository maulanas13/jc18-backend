const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 5100;
const { renderHtml } = require("./src/helpers");
require('dotenv').config();
const mysql = require('mysql2');
const connection = mysql.createConnection({
  port: 3306, // Biasanya ini default MySql
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

const loggingFunc = (req, res, next) => { // Function utk record console log, guna utk troubleshoot backend ketika request user ada error
    console.log(req.method, req.url, new Date().toString());
    req.bambang = "namaku"; // nambah property bambang di object req
    next();
}

// Pasang middleware
app.use(express.json()); // Middleware global start
app.use(cors()); // Klo kyk gini, semua backend bs keakses, kita bisa ksh whitelist sendiri
app.use(loggingFunc);
// ini midlleware untuk nampung data body untuk method post,put,patch

// Bagian ini jgn sampe ngeduluin semua syntax yg diatas
const { authRoute, productRoute, userRoute } = require("./src/routes");

// GENERAL REQUEST
app.get("/", async (req, res) => {
  console.log(req.bambang, "dari function sebelumnya");
  let tampilanWelcome = await renderHtml("./index.html");
  return res.status(200).send(tampilanWelcome);
});

// AUTHENTICATION RELATED REQUEST
app.use("/auth", authRoute); // Jadi controller ini bisa dilewating klo path nya ada /auth (ex: /auth/login)

// USERS RELATED REQUEST
app.use("/users", userRoute);

// PRODUCTS RELATED REQUEST
app.use("/products", productRoute);

// KLO SALAH PATH/ALAMAT (ANYTHING SELAIN YG DIATAS)
app.all("*", (req, res) => {
  return res.status(404).send({message: "Not Found"});
});

app.listen(PORT, () => console.log("API Jalan di PORT" + PORT));