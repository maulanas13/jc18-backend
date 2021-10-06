const express = require("express");
const app = express();
const PORT = 5100;
const { renderHtml } = require("./helpers");

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
    name: "pensil",
    keterangan: "untuk nulis",
  },
  {
    id: 2,
    name: "rautan",
    keterangan: "bikin pensil tajem",
  },
];
let id = 2;
const loggingFunc = (req, res, next) => { // Function utk record console log, guna utk troubleshoot backend ketika request user ada error
    console.log(req.method, req.url, new Date().toString());
    req.bambang = "namaku"; // nambah property bambang di object req
    next();
}

// Pasang middleware
app.use(express.json()); // Middleware global start
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
    console.log(req.bambang, "dari function sebelumnya");
    return res.status(200).send(products);
});

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