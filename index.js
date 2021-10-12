const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 5100;
const { renderHtml } = require("./helpers");
require('dotenv').config();
const mysql = require('mysql');
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

// Anggap database (users & products)
let users = [
  {
    id: 1,
    username: "admin",
    password: "abce",
  },
  {
    id: 2,
    username: "user",
    password: "1234",
  },
];
let products = [
  {
    id: 1,
    name: "Pensil",
    price: 5000,
  },
  {
    id: 2,
    name: "Rautan",
    price: 13000,
  },
  {
    id: 3,
    name: "Papan Tulis",
    price: 110000,
  },
  {
    id: 4,
    name: "Projector",
    price: 1230000,
  },
];
let id = 4;
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

// middleware end
// middleware bisa ditengah endpoint ini atau di app.use agar menjadi middleware global
// app.get("/", loggingFunc,async (req, res) => {
//   console.log(req.dino, "dari function sebelumnya");
//   let tampilanWelcome = await tampilakanHtml("./index.html");
//   return res.status(200).send(tampilanWelcome);
// });

app.get("/", async (req, res) => {
    console.log(req.bambang, "dari function sebelumnya");
    let tampilanWelcome = await renderHtml("./index.html");
    return res.status(200).send(tampilanWelcome);
});

app.get("/products", (req, res) => {
    console.log("Line 68, req.query products", req.query);
    const {namaProd, hargaMin, hargaMax} = req.query;
    console.log(Boolean(namaProd), "hasil");
    let newFilterProd = products;
    if (!namaProd && !hargaMin && !hargaMax) {
        return res.status(200).send(products);
    }
    if (namaProd) {
        newFilterProd = newFilterProd.filter((val) => 
            val.name.toLowerCase().includes(namaProd.toLowerCase())
        );
    }
    if (hargaMin) {
        newFilterProd = newFilterProd.filter((val) => val.price >= hargaMin);
    }
    if (hargaMax) {
        newFilterProd = newFilterProd.filter((val) => val.price >= hargaMax);
    }
    return res.status(200).send(newFilterProd);
});

app.get("/products/:id", (req,res) => {
    const {id} = req.params;
    let indexProd = products.findIndex((val) => val.id == id);
    return res.status(200).send(products[indexProd]);
})

app.get("/users", (req, res) => {
    console.log("query user", req.query);
    return res.status(200).send(users);
});

app.post("/products", (req, res) => {
    console.log(req.body);
    let data = req.body;
    data.id = ++id;
    products.push(data); // Push data to database
    return res.status(200).send(products);
});

app.patch("/products/:id", (req, res) => {
    const {id} = req.params;
    let indexEdit = products.findIndex((val) => val.id == id);

    if (indexEdit >= 0) {
        const {name, price} = req.body;
        if (name) {
            products[indexEdit].name = name;
        }
        if (price) {
            products[indexEdit].price = price;
        }
        return res.status(200).send()
    } else {
        let obj = {
            message: "tidak ada id",
        };
        return res.status(400).send(obj);
    }
});

app.delete("/products/:id", (req, res) => { // Bisa terima params kyk react router dom
    let id = req.params.id; // cari index
    let indexDelete = products.findIndex((val) => val.id == id);
  
    if (indexDelete >= 0) { // delete data in array
      products.splice(indexDelete, 1);
      return res.status(200).send(products);
    } else {
      let obj = {
        message: "tidak ada id",
      };
      return res.status(400).send(obj);
    }
  });

app.listen(PORT, () => console.log("API Jalan di PORT" + PORT));