// ? http
var users = [
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
  var products = [
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
  const http = require("http");
  const { createReadStream, readFile } = require("fs");
  const url = require("url");
  const querystring = require("querystring");
  
  const tampilkanHtml = (pathToFile) => {
    return new Promise((resolve, reject) => {
      readFile(pathToFile, "utf-8", (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  };
  
  const server = http.createServer((req, res) => {
    //proses mengubah data bahasa pemrograman menjadi json disebut serialisasi
  
    //? url
    // http://localhost:5002/products?namaProd=penggaris&hargamin=20000
    const myurl = url.parse(req.url);
  
    //? /products url pathanme
    console.log(myurl.pathname);
  
    //? /namaProd=penggaris&hargamin=20000
    console.log(myurl.query);
  
    //? hasil qs { namaProd: "penggaris, hargamin: "20000" }
    console.log(querystring.parse(myurl.query)); // query menjadi object
    // console.log(req)
    // izin akses dari luar
  
    res.setHeader("Access-Control-Allow-Origin", "*");
    // izin method yang digunakan
  
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, OPTIONS, POST, PUT, DELETE, PATCH"
    );
    res.setHeader("Access-Control-Allow-Headers", "content-type");
  
    if (myurl.pathname === "/products" && req.method === "GET") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(products));
    } else if (myurl.pathname === "/users" && req.method === "GET") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(users));
    } else if (myurl.pathname === "/text" && req.method === "GET") {
      //? Header utk bikin link download
      res.writeHead(200, {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": "attachment; filename=download.txt",
      });
  
      let readStream = createReadStream("./text/test.txt");
      // readStream.on("open", () => {
      //   console.log(data);
      //   readStream.pipe(res);
      // });
  
      readStream.on("data", (data) => {
        console.log(data);
        readStream.pipe(res);
      });
      // This catches any errors that happen while creating the readable stream (usually invalid names)
      readStream.on("error", function (err) {
        res.end(err);
      });
    } else if (myurl.pathname === "/products" && req.method === "POST") {
      req.on("data", (body) => { // body adalah data yang dikirimkan
        console.log(body);
        let data = JSON.parse(body); // deserialasi
        data.id = ++id;
        console.log("hasil parsing", data);
        products.push(data); // push data to database
        res.writeHead(200, {"Content-type": "application/json"}); // send all data product to response
        res.end(JSON.stringify(products));
      })
    } else if (myurl.pathname.includes("/products") && req.method === "DELETE") {
      let paramProd = myurl.pathname.split("/")[2]; // Cari param | id
      let indexDelete = products.findIndex((val) => val.id == paramProd); // Cari index
      res.writeHead(200, {"Content-type": "application/json"});
      if (indexDelete >= 0) {
        products.splice(indexDelete, 1); // Delete data di array
        res.end(JSON.stringify(products));
      } else {
        let obj = {
          message: "Tidak ada id"
        };
        res.end(JSON.stringify(obj));
      }
    } else if (myurl.pathname === "/") {
      tampilkanHtml("./index.html")
      .then((dataHTML) => {
        res.writeHead(200, {"Content-type": "text/html"});
        console.log(dataHTML);
        res.end(dataHTML);
      }).catch((err) => {
        console.log(err);
      })
    } else {
      res.writeHead(404, { "Content-type": "text/plain" });
      res.end("not found");
    }
  });
  
  server.listen(5100, () => console.log("Server jalan di port 5100"));