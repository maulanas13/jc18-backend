// const bebas = require("./name");
// import bebas from "./name";
// const { nama, kelas, listName, kalimat } = require("./name");
// destructuring karena export di name adalah object
// import {nama} from './name'
// let sentece = kalimat(nama, kelas, listName[1]);
// console.log(sentece);
// console.log(nama, kelas, listName[0]);
// let tepati = true;

// const janji = () =>
//   new Promise((resolve, reject) => {
//     if (tepati) {
//       resolve("terima");
//     } else {
//       reject("kemana aja eror");
//     }
//   });

// janji()
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.log("err =>", err);
//   });

// setTimeout(() => {
//   console.log(1);
//   setTimeout(() => {
//     console.log(2);
//     setTimeout(() => {
//       console.log(3);
//     }, 2000);
//   }, 2000);
// }, 2000);

// const tesPromise = (detik) => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve("selesai");
//     }, detik * 1000);
//   });
// };

// tesPromise(2).then(() => {
//   console.log(1);
//   tesPromise(2).then(() => {
//     console.log(2);
//     tesPromise(2).then(() => {
//       console.log(3);
//     });
//   });
// });

// tesPromise(2)
//   .then(() => {
//     console.log(1);
//     return tesPromise(2);
//   })
//   .then(() => {
//     console.log(2);
//     return tesPromise(2);
//   })
//   .then(() => {
//     console.log(3);
//   });
// ? module os
// const os = require("os");

// console.log(os.userInfo());

// let compObj = {
//   name: os.type(),
//   release: os.release(),
//   totalMem: os.totalmem(),
//   freeMem: os.freemem(),
// };

// console.log(compObj);

// ? module path
// const path = require("path");
// console.log(__dirname);

// const filePath = path.join(__dirname, "text", "test.txt");
// console.log(filePath);

// const fileResolvePath = path.resolve(__dirname, "./text/test.txt");
// console.log(fileResolvePath);
// const dir = require("./tes");

// console.log(dir);

// ? module fs (file system)  async / sync
// const {
//   readFileSync,
//   writeFileSync,
//   appendFileSync,
//   writeFile,
//   appendFile,
//   readFile,

// } = require("fs");

// writeFile("./tes/listname.csv", "dino blabla", (err) => {
//   if (err) {
//     return console.log(err);
//   }
//   console.log("berhasil");
// });
// console.log("iya");
// // const { writeFile, mkdir } = require("fs").promises;
// readFile("./text/test.txt", (err, data) => {
//   if (err) {
//     return err;
//   }
//   console.log(data);
// });

// const hasil = readFileSync("./index.html", "utf-8");
// var arr = [
//   {
//     username: "tes",
//     password: "abce",
//   },
//   {
//     username: "tes",
//     password: "abce",
//   },
// ];

////? buat file csv dan tambahin username password
// writeFileSync("./text/coba.csv", `username,password\n`);

// arr.forEach((val) => {
//?   edit file atau tambah isi dari csv
//   appendFileSync("./text/coba.csv", `${val.username},${val.password}\n`);
// });

// writeFile("/etc/dasdasdad", `username,password\n`)
//   .then(() => {
//     console.log("berhasil");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// ? buat folder
// mkdir("./public/user", { recursive: true }).then(() => {
//   console.log("berhasil buat folder");
// });

// console.log(hasil);

// ? http
// var users = [
//   {
//     username: "tes",
//     password: "abce",
//   },
//   {
//     username: "tes",
//     password: "abce",
//   },
// ];
// var products = [
//   {
//     name: "tes1",
//     keterangan: "abce",
//   },
//   {
//     name: "tes2",
//     keterangan: "abce",
//   },
// ];
const http = require("http");
const { createReadStream } = require("fs");
// // const url = require("url");

const server = http.createServer((req, res) => {
  //proses mengubah data bahasa pemrograman menjadi json disebut serialisasi
  //   console.log(req.url);
  if (req.url === "/products" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(products));
  } else if (req.url === "/users" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(users));
  } else if (req.url === "/text" && req.method === "GET") {
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
  } else {
    let obj = {
      message: "selamat datang",
    };
    res.end(JSON.stringify(obj));
  }
});

server.listen(5000, () => console.log("Server jalan di port 5000"));

// const { isSatorSun } = require("./helpers");

// console.log(isSatorSun()); //false
// console.log(isSatorSun("2021-10-03")); //true
