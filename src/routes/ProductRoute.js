const express = require("express");
const router = express.Router();
const {productController} = require("./../controllers");
const {getProducts, addProduct, editProduct, getProductById, deleteProduct, tesUpload, tesUploadOtherVer} = productController;
const {verifyTokenAccess} = require("./../helpers").verifyToken;
const uploader = require("../helpers/UploadFolder");

const uploadFile = uploader("/tes", "TEST").fields([
    {name: "tes", maxCount: 3},
]);

const uploadFileProd = uploader("/products", "PROD").fields([
    { name: "image", maxCount: 3 },
]);

router.get("/", getProducts);
router.post("/", uploadFileProd,addProduct);
router.patch("/:id", uploadFileProd,editProduct);
router.get("/:id", verifyTokenAccess, getProductById);
router.delete("/:id", deleteProduct);
router.post("/tesupload", uploadFile, tesUpload);
router.post("/tesupload2", tesUploadOtherVer);

module.exports = router;