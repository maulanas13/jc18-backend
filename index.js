const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 5100;
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

// Untuk proses multiform data (upload file), library multer
app.use(express.urlencoded({extended: false}));

app.use(express.static("public"));

// Socket IO set up
const http = require("http");
const server = http.createServer(app);
const socketio = require("socket.io");
const io = socketio(server, {
  cors: "*",
});

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

// Integrasi MongoDB
const { MongoClient } = require('mongodb');
const { ObjectID } = require("bson");
const uri = "mongodb+srv://tesproduk:admin@cluster0.gxfdc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect()
  .then(() => {
    console.log("mongoDb Connected");
  }).catch((error) => {
    console.log(error);
  });

app.get("/search/movies", async (req, res) => {
  // req.query
  const {title} = req.query;
  console.log(req.query);
  const query = {};
  if (title) {
    query.title = new RegExp(`${title}`, "i")
  }

  // Cara looping klo males pake if2, misal banyak yg harus di if
  // for (const key in req.query) {
  //   if (Object.hasOwnProperty.call(req.query, key)) {
  //     const element = req.query[key];
  //     query[key] = element;
  //   }
  // }

  const collection = client.db("belajar_mongo").collection("movies");

  try {
    // const moviesData = await collection.find({}).toArray();
    // MongoDB itu BSON, klo ga toArray nnti outputnya string --> buffer, nah kita ga bs baca bahasa binary

    // Setara sql: SELECT title FROM WHERE title LIKE %title%
    // Klo paje projection: {title: 1}
    // const moviesData = await collection
    //   .find({}, {projection: {title: 1, genres: 1, year: 1}}).skip(3)
    //   .toArray();
    // Kasih projection klo cuma mau ambil bbrp properties, kecuali id (dia khusus ttp dapet, klo ttp ga mau ada id ksh aja _id: 0)
    // Klo limit kasih skip

    // req.query
    // Setara sql: SELECT * FROM WHERE title LIKE %title%
    // const moviesData = await collection
    //   .find(query)
    //   .toArray();

    // Pake sorting
    const moviesData = await collection
      .find(query)
      // .find(query, {projection: {title: 1}}) Klo mau yg tampil hanya title
      .collation({locale: "en"}) // Biar sorting tidak case sensitive
      .sort({title: 1}) // Sorting asc
      // .sort({title: -1}) Sorting desc
      .toArray();

    return res.status(200).send(moviesData);
  } catch (error) {
    console.log(error);
    return res.status(500).send({message: error.message});
  };
});

app.get("/initData", async (req, res) => {
  const collection = client.db("belajar_mongo").collection("movies");
  await collection.insertMany([
    {
       title: 'Titanic',
       year: 1997,
       genres: [ 'Drama', 'Romance' ],
       rated: 'PG-13',
       languages: [ 'English', 'French', 'German', 'Swedish', 'Italian', 'Russian' ],
       released: new Date("1997-12-19T00:00:00.000Z"),
       awards: {
          wins: 127,
          nominations: 63,
          text: 'Won 11 Oscars. Another 116 wins & 63 nominations.'
       },
       cast: [ 'Leonardo DiCaprio', 'Kate Winslet', 'Billy Zane', 'Kathy Bates' ],
       directors: [ 'James Cameron' ]
    },
    {
       title: 'The Dark Knight',
       year: 2008,
       genres: [ 'Action', 'Crime', 'Drama' ],
       rated: 'PG-13',
       languages: [ 'English', 'Mandarin' ],
       released: new Date("2008-07-18T00:00:00.000Z"),
       awards: {
          wins: 144,
          nominations: 106,
          text: 'Won 2 Oscars. Another 142 wins & 106 nominations.'
       },
       cast: [ 'Christian Bale', 'Heath Ledger', 'Aaron Eckhart', 'Michael Caine' ],
       directors: [ 'Christopher Nolan' ]
    },
    {
       title: 'Spirited Away',
       year: 2001,
       genres: [ 'Animation', 'Adventure', 'Family' ],
       rated: 'PG',
       languages: [ 'Japanese' ],
       released: new Date("2003-03-28T00:00:00.000Z"),
       awards: {
          wins: 52,
          nominations: 22,
          text: 'Won 1 Oscar. Another 51 wins & 22 nominations.'
       },
       cast: [ 'Rumi Hiiragi', 'Miyu Irino', 'Mari Natsuki', 'Takashi Naitè' ],
       directors: [ 'Hayao Miyazaki' ]
    },
    {
       title: 'Casablanca',
       genres: [ 'Drama', 'Romance', 'War' ],
       rated: 'PG',
       cast: [ 'Humphrey Bogart', 'Ingrid Bergman', 'Paul Henreid', 'Claude Rains' ],
       languages: [ 'English', 'French', 'German', 'Italian' ],
       released: new Date("1943-01-23T00:00:00.000Z"),
       directors: [ 'Michael Curtiz' ],
       awards: {
          wins: 9,
          nominations: 6,
          text: 'Won 3 Oscars. Another 6 wins & 6 nominations.'
       },
       lastupdated: '2015-09-04 00:22:54.600000000',
       year: 1942
    }
 ])
 return res.status(200).send({message: "Berhasil insert"})
});

// Delete (Mongo DB)
app.delete("/movies/:id", async (req, res) => {
  const collection = client.db("belajar_mongo").collection("movies");
  let {id} = req.params;
  try {
    await collection.deleteMany({_id: new ObjectID(id)});
    return res.send({message: "Berhasil delete data movies"});
  } catch (error) {
    console.log(error);
    return res.status(500).send({message: error.message});
  }
});

// Edit (Mongo DB)
app.put("/movies/:id", async (req, res) => {
  const collection = client.db("belajar_mongo").collection("movies");
  let {id} = req.params;
  // let {title, genres} = req.body;
  // req.body expect {titles: "ubah title", genres:["dasdad]}
  // Minusnya javascript nih ga bisa tau data types, klo Typescript bisa (klo udh jago JS, coba pake TS)
  // $unset gunanya utk menghapus field (misal mau hapus year dri banyak properties si data movies)
  // Contoh penggunaan bgini {$set:{...req.body}, $unset:{year:""}});
  try {
    await collection.updateOne({_id: new ObjectID(id)}, {$set:{...req.body}});
    return res.send({message: "Berhasil update data movies"});
  } catch (error) {
    console.log(error);
    return res.status(500).send({message: error.message});
  }
});

// Agregat (Mongo DB)
app.get("/hitungGenre", async (req, res) => {
  const collection = client.db("belajar_mongo").collection("movies");
  try {
    let data = await collection.aggregate([
      {$unwind: "$genres"}, // Guna unwind, genres itu array, MongoDb hebatnya bisa ngitung satu2 string nya
      {
        $group: {
          _id: "$genres",
          genreCount: {$sum: 1}, // Count biasa sum 1 kyk gini di MongoDb, jd walaupun array ttp bisa ngitung brp
        },
      },
      {$sort: {genreCount: -1}}, // Sorting dri genres count terbesar hingga terkecil

      // Contoh lain, ngitung total win
      // {
      //   $group: {
      //     _id: null,
      //     totalWins: {$sum: "$awards.wins"},
      //   },
      // }

    ])
    .toArray(); //Aggregate atau get bbiasa harus ada to array diakhir
    console.log(data)
    return res.send(data);
  } catch (error) {
    console.log(error);
    return res.status(500).send({message: error.message});
  }
});

// IO SET
let users = 0;
let messages = [];
let messageCnl = [];
let userRoom = [];
let chatRoom2 = [];
let chatRoom = [];

app.get("/mess", (req, res) => {
  const { nsp } = req.query;

  if (nsp === "/channel") {
    return res.status(200).send(messagescnl);
  }
  return res.status(200).send(messages);
});

app.post("/sendmess", (req, res) => {
  const {cnl} = req.query;
  console.log(cnl);
  if (cnl === "/channel") {
    messageCnl.push(req.body);
    console.log(req.body)
    io.of("/channel").emit("message", messageCnl);
    return res.status(200).send({messages: "Berhasil kirim message"});
  } else {
    if (req.body.room) {
      // ada room
      chatRoom.push(req.body);
      // proses ini bisa digabungkan dengan sql atau mongodb
      io.to(req.body.room).emit("messageRoom", chatRoom);

      return res.status(200).send({ messages: "berhasil kirim message" });
    } else {
      messages.push(req.body);
      console.log(messages);
      io.emit("message", messages);
      return res.status(200).send({messages: "Berhasil kirim message"});
    };
  };
});

// io global connect --namespace=default
io.on('connection', (socket) => {
  users++;
  console.log("Isi socket: ", socket.id);
  console.log('a user connected: ', users);

  socket.on("bebas", (data) => { // Si bebas ngikutin emit yg di front end
    users++;
    console.log(data.name);
    io.emit("bales", `${data.name} telah join chat`);
  });

  socket.on("joinRoom", (data) => {
    socket.join(data.room); // Buat subscribe ke room
    console.log(socket.rooms); // Utk lihat list room yg terdaftar
    userRoom.push({...data, id: socket.id});
    io.emit("respond", `${data.name} telah join room chat`)
  });

  socket.on("leaveRoom", (data) => {
    socket.leave(data.room); 
    console.log(socket.rooms); 
    io.emit("respond", `${data.name} telah leave room chat`)
  });

  socket.on("disconnect", (reason) => {
    console.log(reason);
    console.log("user disconnected");
    users--;
    console.log("total connected :", users);

    // io.emit("user connected", userCount);
  })
});

io.of("/channel").on('connection', (socket) => {
  console.log("Isi socket namespace: ", socket.id);

  socket.on("bebas", (data) => {
    console.log("di namespace ", data.name);
    // cara emit di namespace
    io.of("/channel").emit("bales", `${data.name} telah join chat`);
  });

  socket.on("disconnect", (reason) => {
    console.log("user disconnected");
  });
});

// 'event emitter'=> 'on emit'

// KLO SALAH PATH/ALAMAT (ANYTHING SELAIN YG DIATAS)
app.all("*", (req, res) => {
  return res.status(404).send({message: "Not Found"});
});

server.listen(PORT, () => console.log("API Jalan di PORT" + PORT));