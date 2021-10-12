const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 5100;
const { renderHtml } = require("./helpers");
require('dotenv').config();
// const mysql = require('mysql');
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

// Anggap database (users & products)
// let users = [
//   {
//     id: 1,
//     username: "admin",
//     password: "abce",
//   },
//   {
//     id: 2,
//     username: "user",
//     password: "1234",
//   },
// ];
// let products = [
//   {
//     id: 1,
//     name: "Pensil",
//     price: 5000,
//   },
//   {
//     id: 2,
//     name: "Rautan",
//     price: 13000,
//   },
//   {
//     id: 3,
//     name: "Papan Tulis",
//     price: 110000,
//   },
//   {
//     id: 4,
//     name: "Projector",
//     price: 1230000,
//   },
// ];
// let id = 4;

// Cara mysql, nnti ada cara mysql2
// const {promisify} = require("util");
// const connDb = promisify(connection.query).bind(connection); 
// Mengubah si connection menjadi promise

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

app.get("/users", async (req, res) => {
    // ? Cara mysql2
    let sql = "SELECT * FROM user LIMIT 10";
    let connMySql = connection.promise();
    try {
      let [results] = await connMySql.query(sql); // ConnMySql.query itu hasil promisenya adalah array dimana array 1 adlah result ,array 2 itu field
      console.log(results);
      return res.status(200).send(results);
    } catch (err) {
      console.log("error : ", err);
      return res.status(500).send({message: err.message})
    }

    // ? Cara promise promisify() mysql
    // let sql = "SELECT * FROM user LIMIT 10";
    // try {
    //   let results = await connDb(sql);
    //   return res.status(200).send(results);
    // } catch (err) {
    //   console.log("error : ", err);
    //   return res.status(500).send({message: err.message})
    // }
    
    // ? Old ways
    // console.log("query user", req.query);
    // const {username} = req.query;
    // let sql = "SELECT * FROM user "; // Jgn lupa spasi, karena nnti combine syntax query lain
    // if (username) {
    //   sql += `WHERE username = "${username}"`
    // }

    // // Cara query kasih string, parameter kedua callback
    // connection.query(sql, (err, results, fields) => {
    //   if (err) {
    //     console.log("error : ", err);
    //     return res.status(500).send({message: err.message})
    //   };
    //   console.log("results : ", results);
    //   console.log("fields : ", fields);
    //   return res.status(200).send(results);
    // });
});

// ENDPOINT LOGIN
app.get("/login", (req, res) => {
  console.log("query user", req.query);
  const {username, password} = req.query;
  if (!username || !password) {
    return res.status(400).send({message: "Kurang username or pass"});
  };

  // ? Cara TIDAK secure 01
  // let sql = `SELECT * FROM user WHERE username= "${username}" AND password = "${password}"`;
  
  // ? Cara secure 01
  // let sql = `SELECT * FROM user WHERE username= ${connection.escape(username)} AND password = ${connection.escape(password)}`;

  // ? Cara secure 02
  let sql = "SELECT * FROM user WHERE username= ? AND password = ?";
  console.log(sql);

  connection.query(sql, [username, password], (err, results) => {
    if (err) {
      console.log("error : ", err);
      return res.status(500).send({message: err.message});
    };
    return res.status(200).send(results);
  });
});

// ADD USER
app.post("/users", async (req, res) => {
  const {username, password, address} = req.body;
  if (!username || !password || !address) {
    return res.status(400).send({message: "Kurang username or pass"});
  }
  // ? Cara mysql2 promise
  let sql = "INSERT INTO user SET ?";
  try {
    let dataInsert = {
      username: username,
      password,
      address,
    };
    const [results] = await connection.promise().query(sql, dataInsert);
    console.log(results);
    sql = "SELECT * FROM user"
    const [userData] = await connection.promise().query(sql);
    return res.status(200).send(userData);
  } catch (err) {
    console.log("error : ", err);
    return res.status(500).send({message: err.message});
  };

  // ? Cara mysql
  // let sql = "INSERT INTO user SET ?";
  // let dataInsert = {
  //   username: username,
  //   password,
  //   address,
  // };
  // connection.query(sql, dataInsert, (err, results) => {
  //   if (err) {
  //     console.log("error : ", err);
  //     return res.status(500).send({message: err.message});
  //   };
  //   console.log(results); // Resultsnya insert itu object, property indertId lumayan penting, penanda baru insert data
  //   sql = "SELECT * FROM user"
  //   connection.query(sql, (err, userData) => { // userData sbnrnys results, tp biar beda aja
  //     if (err) {
  //       console.log("error : ", err);
  //       return res.status(500).send({message: err.message});
  //     };
  //     return res.status(200).send(userData);
  //   });
  // });
});

// DELETE USER
app.delete("/users/:iduser", (req, res) => {
  const {iduser} = req.params;

  let sql = `SELECT id FROM user WHERE id = ?`;
  connection.query(sql, [iduser], (err, results) => {
    if (err) {
      console.log("error :", err);
      return res.status(500).send({ message: err.message });
    }
    if (!results.length) {
      //kalo length false/0 maka masuk sini
      return res.status(500).send({ message: "id tidak ditemukan" });
    }
  });
  let sql = "DELETE FROM user WHERE id = ?";
  connection.query(sql, [iduser], (err, results1) => {
    if (err) {
      console.log("error : ", err);
      return res.status(500).send({message: err.message});
    };
    console.log(results1)
    // GET DATA ULANG
    sql = "SELECT * FROM user"
    connection.query(sql, (err, userData) => {
      if (err) {
        console.log("error : ", err);
        return res.status(500).send({message: err.message});
      };
      return res.status(200).send(userData);
    });
  });
});

// EDIT USER
app.put("/users/:iduser", (req, res) => {
  const {username, password, address} = req.body;
  const {iduser} = req.params;
  // Ambil data berdasarkan id ada atau tidak
  let sql = "SELECT id FROM user WHERE id = ?";
  connection.query(sql, [iduser], (err, results) => {
    if (err) {
      console.log("error : ", err);
      return res.status(500).send({message: err.message});
    };
    if (!results.length) {
      // Kalo data dgn id yg diinput tdk ada, maka masuk sini
      // Klo length false/0 masuk sini
      return res.status(500).send({message: "id tidak ditemukan"});
    }
    let dataUpdate = {
      username,
      password,
      address,
    };
    sql = "UPDATE USER SET ? WHERE ID = ?"
    connection.query(sql, [dataUpdate, iduser], (err, results1) => {
      if (err) {
        console.log("error : ", err);
        return res.status(500).send({message: err.message});
      };
      console.log(results1); // Data udh pasti ter-edit klo console.log terbaca
      // GET DATA ULANG
      sql = "SELECT * FROM user"
      connection.query(sql, (err, userData) => {
        if (err) {
          console.log("error : ", err);
          return res.status(500).send({message: err.message});
        };
        return res.status(200).send(userData);
      });
    });
  });
});

app.post("/products", (req, res) => {
    console.log(req.body);
    let data = req.body;
    data.id = ++id;
    products.push(data); // Push data to database
    return res.status(200).send(products);
});

app.post("/products", async (req, res) => {
  const {username, password, address} = req.body;
  if (!username || !password || !address) {
    return res.status(400).send({message: "Kurang username or pass"});
  }
  // ? Cara mysql2 promise
  let sql = "INSERT INTO user SET ?";
  try {
    let dataInsert = {
      username: username,
      password,
      address,
    };
    const [results] = await connection.promise().query(sql, dataInsert);
    console.log(results);
    sql = "SELECT * FROM user"
    const [userData] = await connection.promise().query(sql);
    return res.status(200).send(userData);
  } catch (err) {
    console.log("error : ", err);
    return res.status(500).send({message: err.message});
  };
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