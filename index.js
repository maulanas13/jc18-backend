const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 5100;
const { renderHtml } = require("./src/helpers");
require('dotenv').config();
const morgan = require("morgan");
const path = require("path");
const fs = require('fs');
const bearerToken = require('express-bearer-token');

morgan.token("date", function (req, res) {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }
  return new Date().toLocaleString("id-ID", options);
});

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  {
    flags: "a",
  }
);

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :date", {stream: accessLogStream}));

// Pasang middleware
app.use(express.json()); // Middleware global start
app.use(cors()); // Klo kyk gini, semua backend bs keakses, kita bisa ksh whitelist sendiri
// ini midlleware untuk nampung data body untuk method post,put,patch

// Untuk membuat token masuk kedalam req.token (mempermudah pemanggilan)
app.use(bearerToken());

// Bagian ini jgn sampe ngeduluin semua syntax yg diatas
const { authRoute, productRoute, userRoute } = require("./src/routes");

// RENDERING HTML HOMEPAGE
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