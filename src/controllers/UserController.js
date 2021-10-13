const {connection} = require("../connections")

module.exports = {
    getUsers: async (req, res) => {
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
        };
      },
      addUser: async (req, res) => {
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
      },
      editUser: (req, res) => {
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
      },
      deleteUser: (req, res) => {
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
        sql = "DELETE FROM user WHERE id = ?";
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
      }
};