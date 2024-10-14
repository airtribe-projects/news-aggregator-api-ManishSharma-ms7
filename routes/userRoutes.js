const express = require("express");
const usersController = require("./../controllers/usersController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.route("/register").post(authController.register);

router.route("/login").post(authController.login);

router.route("/preferences").get(authController.protect, usersController.getPreferences);

// router.route("/:id").get(usersController.getUser).patch(usersController.updateUser).delete(usersController.deleteUser);

module.exports = router;
