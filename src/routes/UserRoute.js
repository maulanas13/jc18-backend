const express = require("express");
const router = express.Router();
const {userController} = require("./../controllers");
const {getUsers, editUser, addUser, deleteUser} = userController;

router.get("/", getUsers);
router.post("/", addUser);
router.delete("/:iduser", deleteUser);
router.put("/:iduser", editUser);

module.exports = router;