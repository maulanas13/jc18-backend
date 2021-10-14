const { connection } = require("./../connections");

module.exports = {
    getProducts: async (req, res) => {
        // console.log("Line 68, req.query products", req.query);
        const {namaProd, hargaMin, hargaMax, pages = 1, limit = 2} = req.query; // Cara ksh default value pd destructuring
        console.log(req.query);
        console.log(limit);
        let offset = (pages - 1) * limit; // Buat bikin paging
        // offset mulai dari row berapa di sql, jika offset 0 maka row 1 sebanyak "limit" akan diambil,
        // jika offset 10 maka row 11 sebanyak "limit" akan diambil
        const connDb = connection.promise();
        let querySql = "WHERE true";
        // if (!namaProd && !hargaMin && !hargaMax) {
        //     return res.status(200).send(products);
        // }
        if (namaProd) {
            querySql += ` AND name LIKE ${connection.escape("%" + namaProd + "%")}`;
        }
        if (hargaMin) {
            querySql += ` AND price >= ${connection.escape(parseInt(hargaMin))}`;
        }
        if (hargaMax) {
            querySql += ` AND price <= ${connection.escape(parseInt(hargaMax))}`;
        };
        // try {
        //   let sql = `SELECT * FROM products ${querySql} LIMIT ?,? `; // Cara baca ?, ? pertama diisi si offset pada 204, ? kedua diisi parseInt(limit)
        //   const [prodData] = await connDb.query(sql, [offset, parseInt(limit)]);
        //   sql = `SELECT COUNT(*) AS total_data FROM products ${querySql}`; // Hasil dari sql akan selalu menghasilkan array of object
        //   const [totalData] = await connDb.query(sql);
        //   return res.status(200).send({pages: parseInt(pages), total: totalData[0].total_data, data: prodData});
        // } catch (err) {
        //   console.log("error : ", err);
        //   return res.status(500).send({message: err.message});
        // };
    
        // ? Buat besok
        try {
          let sql = `SELECT * FROM products`
          const [prodData] = await connDb.query(sql, [offset, parseInt(limit)]);
          return res.status(200).send(prodData);
        } catch (err) {
          console.log("error : ", err);
          return res.status(500).send({message: err.message});
        };
    },
    addProduct: async (req, res) => {
        const {name, price} = req.body;
        if (!name || !price) {
          return res.status(400).send({message: "Kurang name or price"});
        }
        // Add data product to table products (cara mysql2)
        let sql = "INSERT INTO products SET ?";
        try {
          let dataInsert = {
            name,
            price
          };
          const [results] = await connection.promise().query(sql, dataInsert);
          console.log(results);
          // Get all data products
          sql = "SELECT * FROM products"
          const [prodData] = await connection.promise().query(sql);
          return res.status(200).send(prodData);
        } catch (err) {
          console.log("error : ", err);
          return res.status(500).send({message: err.message});
        };
      },
      editProduct: async (req, res) => {
        const {id} = req.params;
        const connDb = connection.promise();
        try {
          // Cek product by id
          let sql = "SELECT * FROM products WHERE id = ?";
          let [dataProd] = await connDb.query(sql, [id]);
          if (!dataProd.length) {
          // Kalo kosong/data tidak ada
          return res.status(500).send({message: "id tidak ditemukan"});
          }
          let dataUpdate = req.body;
          sql = "UPDATE products SET ? WHERE id = ?";
          await connDb.query(sql, [dataUpdate, id]);
          sql = "SELECT * FROM products";
          const [prodData] = await connection.promise().query(sql);
          return res.status(200).send(prodData);
        } catch (err) {
          console.log("error : ", err);
          return res.status(500).send({message: err.message});
        };
      },
      getProductById: async (req,res) => {
        const {id} = req.params;
        const connDb = connection.promise();
        try {
          let sql = "SELECT * FROM products WHERE id = ?";
          const [prodData] = await connDb.query(sql, [id]);
          return res.status(200).send(prodData[0]);
        } catch (err) {
          console.log("error : ", err);
          return res.status(500).send({message: err.message});
        };
      },
      deleteProduct: async (req, res) => {
        let id = req.params.id; // cari index
        const connDb = connection.promise();
        try {
          let sql = "SELECT * FROM products WHERE id = ?";
          const [prodData] = await connDb.query(sql, [id]);
          if (!prodData.length) {
            throw {message: "Produk tidak ditemukan"}
          }
          sql = "DELETE FROM products WHERE id = ?";
          await connDb(sql, [id]);
          sql = "SELECT * FROM products"
          return res.status(200).send(prodData);
        } catch (err) {
          console.log("error : ", err);
          return res.status(500).send({message: err.message});
        };
      }
}