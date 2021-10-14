const express = require("express");
const router = express.Router();
const {productController} = require("./../controllers");
const {getProducts, addProduct, editProduct, getProductById, deleteProduct} = productController;
const {verifyTokenAccess} = require("./../helpers").verifyToken;

router.get("/", getProducts);
router.post("/", addProduct);
router.patch("/:id", editProduct);
router.get("/:id", verifyTokenAccess, getProductById);
router.delete("/:id", deleteProduct);

module.exports = router;