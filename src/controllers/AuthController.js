"use strict";
const { connection } = require("./../connections");
const {hashPass, createToken, transporter} = require("./../helpers");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const {createTokenAccess, createTokenEmailVerified} = createToken; // Destructuring createToken

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "tesproduk13@gmail.com", // generated ethereal user
//     pass: "wzyosyhlycnhyekb", // generated ethereal password
//   },
//   tls: {
//     rejectUnauthorized: false,
//   }
// });

module.exports = {
  login: (req, res) => {
    console.log("query user", req.query);
    const { username, email, password } = req.query;
    if (!username || !password) {
      return res.status(400).send({ message: "Kurang username or pass" });
    }

    // ? Cara secure 02
    let sql = "SELECT * FROM user WHERE username= ? AND password = ?";
    console.log(sql);

    connection.query(sql, [username, hashPass(password)], (err, results) => {
      if (err) {
        console.log("error : ", err);
        return res.status(500).send({ message: err.message });
      }
      if (!results.length) {
        return res.status(500).send({ message: "user tidak ditemukan" });
      }

      let dataToken = {
        id: results[0].id,
        role_id: results[0].role_id,
      };

      const tokenAccess = createTokenAccess(dataToken)

      return res.status(200).send({token: tokenAccess, data: results});
    });
  },
  register: async (req, res) => {
    // TODO:
    // cek username ada atau enggak
    // kalo ada return status 500 dan kasih message username telah ada
    // kalo tidak ada add data to user table
    // jika berhasil kirim email verifikasi
    // get lagi datanya kayak login
    // Rencana nya melakukan verifikasi email ditengah2 proses, dll

    const { username, email, password } = req.body;
    const connDb = connection.promise();
    try {
      // Cek username ada / tidak
      let sql = "SELECT * FROM user WHERE username = ?";
      let [dataUser] = await connDb.query(sql, [username]);
      if (dataUser.length) {
        throw { message: "username sudah ada" };
      }

      // Klo tdk ada, add data user to table
      sql = "INSERT INTO user SET ?";
      let dataInsert = {
        username,
        email,
        password: hashPass(password),
      };
      let [result] = await connDb.query(sql, [dataInsert]);
      console.log(result.insertId);
      // insertId adalah id yang baru dihasilkan dari insertData

      // Get data kyk login
      sql = "SELECT * FROM user WHERE id = ?";
      let [dataUserRes] = await connDb.query(sql, [result.insertId]);

      let dataToken = {
        id: dataUserRes[0].id,
        role_id: dataUserRes[0].role_id,
      };
      let tokenAccess = createTokenAccess(dataToken);
      let tokenEmailVerified = createTokenEmailVerified(dataToken);

      // Kirim email verifikasi
      let filepath = path.resolve(__dirname, "../template/EmailVerifikasi.html");
      let htmlString = fs.readFileSync(filepath, "utf-8");
      // console.log(htmlString);
      const template= handlebars.compile(htmlString);
      const htmlToEmail = template({
        nama: username, 
        token: tokenEmailVerified
      });
      console.log(htmlToEmail);
      await transporter.sendMail({
        from: "Commander Erwin <tesproduk13@gmail.com>",
        to: email,
        subject: "Verification Email From Commander",
        html: htmlToEmail,
      });

      // Send response
      return res.status(200).send({token: tokenAccess, data: dataUserRes[0]});
    } catch (err) {
      // Klo ada return status 500 & ksh message username telah ada
      console.log("error : ", err);
      return res.status(500).send({ message: err.message });
    }
  },
  hashingString: (req, res) => {
    const {kata} = req.query;
    const hasil = hashPass(kata);
    return res.status(200).send({kataAwal: kata, panjang: hasil.length, hasil: hasil});
  },
  kirimEmail: async (req, res) => {
    try {
      let filepath = path.resolve(__dirname, "../template/Email.html");
      // console.log(filepath);
      // Ubah html jadi string pake fs.readfile
      let htmlString = fs.readFileSync(filepath, "utf-8");
      console.log(htmlString);
      let template= handlebars.compile(htmlString);
      const htmlToEmail = template({nama: "Citizens!", text: "Get tons benefits by join survey corps now"});
      console.log(htmlToEmail);

      let result = await transporter.sendMail({
        from: "Commander Erwin <tesproduk13@gmail.com>",
        to: "projectcultus13@gmail.com",
        subject: "Invitation to Join Survey Corps",
        html: htmlToEmail,
      });
      console.log(result);
      res.send({message: "Berhasil kirim email"}); // Ini otomatis 200, express auto detect, karena ga ada error2
    } catch (err) {
      console.log("error : ", err);
      return res.status(500).send({ message: err.message });
    }
  },
  verified: async (req, res) => {
    const {id} = req.user;
    const connDb = connection.promise();
    try {
      let updateData = {
        isVerified: 1
      }
      let sql = "UPDATE user SET ? WHERE id = ?";
      await connDb.query(sql, [updateData, id]);
      sql = "SELECT * FROM user WHERE id = ?";
      let [dataUserRes] = await connDb.query(sql, [id]);
      return res.status(200).send(dataUserRes[0]);
    } catch (err) {
      console.log("error : ", err);
      return res.status(500).send({ message: err.message });
    };
  },
  sendVerifiedEmail: async (req, res) => {
    const {id_user} = req.params;
    const connDb = connection.promise();
    try {
      // Get userdata by id_user
      let sql = "SELECT * FROM user WHERE id ?"
      let [dataUserRes] = await connDb.query(sql, [id_user]);
      let dataToken = {
        id: dataUserRes[0].id,
        role_id: dataUserRes[0].role_id,
      };
      let tokenEmailVerified = createTokenEmailVerified(dataToken);

      // Kirim email verifikasi
      let filepath = path.resolve(__dirname, "../template/EmailVerifikasi.html");
      let htmlString = fs.readFileSync(filepath, "utf-8");
      const template= handlebars.compile(htmlString);
      const htmlToEmail = template({nama: username, token: tokenEmailVerified});
      await transporter.sendMail({
        from: "Commander Erwin <tesproduk13@gmail.com>",
        to: dataUserRes[0].email,
        subject: "Verification Email From Commander",
        html: htmlToEmail,
      });
      return res.status(200).send({message: "Berhasil kirim email verifikasi"});
    } catch (err) {
      console.log("error : ", err);
      return res.status(500).send({ message: err.message });
    };
  },
  keepLogin: async (req, res) => {
    // Nggak update tokennya
    const {id} = req.user;
    const connDb = connection.promise();
    try {
      let sql = "SELECT * FROM user WHERE id = ?";
      let [dataUserRes] = await connDb.query(sql, [id]);
      return res.status(200).send(dataUserRes[0]);
    } catch (err) {
      console.log("error : ", err);
      return res.status(500).send({ message: err.message });
    };
  }
};