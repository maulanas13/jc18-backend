const { uploader } = require("../helpers");
const { connection } = require("./../connections");
const fs = require("fs");

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
        // isi path itu sama dengan parameter pertama function uploader di route
        let path = "/products";
        console.log(req.files);
        console.log(req.body);
        const {image} = req.files;
        // req.body klo kirim file itu masih json, harus kita parse
        const data = JSON.parse(req.body.data);

        // imagepath adalah tempat foto disimpan
        let imagePath = image ? `${path}/${image[0].filename}` : null;

        const {name, price} = data;

        // kalo mau buat proteksi
        if (!name || !price) {
          if (imagePath) {
            // Hapus file jika error
            fs.unlinkSync("./public" + imagePath);
          }
          return res.status(400).send({message: "Kurang name or price"});
        }

        // Add data product to table products (cara mysql2)
        let sql = "INSERT INTO products SET ?";
        try {
          let dataInsert = {
            name,
            price,
            image: imagePath,
          };
          const [results] = await connection.promise().query(sql, dataInsert);
          console.log(results); // resultsnya insert itu object, property insertId lumayan penting

          // Get all data products
          sql = "SELECT * FROM products"
          const [prodData] = await connection.promise().query(sql);
          return res.status(200).send(prodData);
        } catch (err) {
          if (imagePath) {
            // Hapus file jika error
            fs.unlinkSync("./public" + imagePath);
          }
          console.log("error : ", err);
          return res.status(500).send({message: err.message});
        };
      },
      editProduct: async (req, res) => {
        const {id} = req.params;
        const connDb = connection.promise();
        let path = "/products";
        console.log(req.files);
        console.log(req.body);
        const { image } = req.files;
        const data = JSON.parse(req.body.data);
        // imagepath null bisa disebabkan karena file memang tidak dikirimkan
        let imagePath = image ? `${path}/${image[0].filename}` : null;

        try {
          // Cek product by id
          let sql = "SELECT id, image FROM products WHERE id = ?";
          let [dataProd] = await connDb.query(sql, [id]);
          if (!dataProd.length) {
            // Kalo kosong/data tidak ada
            return res.status(500).send({message: "id tidak ditemukan"});
          }
          let dataUpdate = {
            name: data.name,
            price: data.price,
          };
          if (imagePath) {
            // klo imagepath tidak null maka masukkan path foto ke dalam database
            dataUpdate.image = imagePath;
          }
          console.log("DATA UPDATE :", dataUpdate);

          // Update product
          sql = "UPDATE products SET ? WHERE id = ?";
          await connDb.query(sql, [dataUpdate, id]);
          // kalo berhasil update
          // hapus foto lama

          if (imagePath) {
            // Jika imagePath ada
            if(dataProd[0].image) {
              // Jika data image di dataprod tidak null/false
              // Hapus filenya jika error
              fs.unlinkSync("./public" + dataProd[0].image);
            }
          }

          sql = "SELECT * FROM products";
          const [prodData] = await connection.promise().query(sql);
          return res.status(200).send(prodData);
        } catch (err) {
          if (imagePath) {
            // hapus filenya jika error
            fs.unlinkSync("./public" + imagePath);
          }
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
          const [prodData01] = await connDb.query(sql, [id]);
          if (!prodData01.length) {
            throw {message: "Produk tidak ditemukan"}
          }
          sql = "DELETE FROM products WHERE id = ?";
          await connDb.query(sql, [id]);
          // kalau delete sudah berhasil di sql
          // maka hapus image jika image ada
          if (prodData01[0].image) {
            // memastikan image ada di path ini dengan existSync
            if (fs.existsSync("./public" + prodData01[0].image)) {
              // hapus filenya jika error
              fs.unlinkSync("./public" + prodData01[0].image);
            }
          }
          
          // Bikin prodData lagi
          sql = "SELECT * FROM products"
          const [prodData02] = await connDb.query(sql);
          return res.status(200).send(prodData02);
        } catch (err) {
          console.log("error : ", err);
          return res.status(500).send({message: err.message});
        };
      },
      tesUpload: (req, res) => {
        console.log("Ini req file: ", req.files); // Dapetin data file
        console.log("Ini req file: ", req.body); // Dapetin data text

        return res.status(200).send({
          message: "Berhasil upload",
          isiReqFile: req.files
        });
      },
      tesUploadOtherVer: (req, res) => {
        const path = "/tes";
        const uploadFile = uploader(path, "TES").fields([
          {name: "image", maxCount: 3},
        ]);
        uploadFile(req, res, (err) => {
          if (err) {
            console.log(err);
            return res
              .status(500)
              .json({message: "Upload picture failed! ", error: err.message});
          }
          console.log("Isi req files : ", req.files);

          return res.status(200).send({
            message: "Berhasil upload",
            isiReqFile: req.files,
          });
        });
      }
}