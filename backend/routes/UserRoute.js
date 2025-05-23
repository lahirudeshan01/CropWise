const express = require("express");
const router = express.Router();
const UserController = require("./UserControllers");

router.get("/", UserController.getAllUsers);
router.post("/", UserController.addUsers);
router.post("/login", UserController.loginUser); // Add login route
router.get("/:id", UserController.getById);
router.put("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

module.exports = router;