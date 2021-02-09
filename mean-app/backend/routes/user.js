const express = require("express");
const router = express.Router();

const UserController = require("../controllers/user");

const User = require("../models/user");

router.post("/signup", UserController.createUser);

router.post("/login", UserController.userLogin);

module.exports = router;
