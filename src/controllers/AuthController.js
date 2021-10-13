const { connection } = require("./../connections");
const {hashPass} = require("./../helpers")

module.exports = {
  login: (req, res) => {
    console.log("query user", req.query);
    const { username, password } = req.query;
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
      return res.status(200).send(results);
    });
  },
  register: async (req, res) => {
    // TODO:
    // Rencana nya melakukan verifikasi email ditengah2 proses, dll

    const { username, password } = req.body;
    const connDb = connection.promise();
    try {
      let sql = "SELECT * FROM user WHERE username = ?";
      // Cek username ada / tidak
      let [dataUser] = await connDb.query(sql, [username]);
      if (dataUser.length) {
        throw { message: "username sudah ada" };
      }
      // Klo tdk ada, add data user to table
      sql = "INSERT INTO user SET ?";
      let dataInsert = {
        username,
        password: hashPass(password),
      };
      let [result] = await connDb.query(sql, [dataInsert]);
      console.log(result.insertId);
      // Get lagi data kyk login
      sql = "SELECT * FROM user WHERE id = ?";
      let [dataUserRes] = await connDb.query(sql, [result.insertId]);
      // Send response
      return res.status(200).send(dataUserRes);
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
  }
};