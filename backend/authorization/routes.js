const express = require("express");
const router = express.Router();
const passport = require("passport");

//importing the controllers
const controller = require("./controller"); // for register
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../authorization/controller");

//authentication routes
router.post("/register", controller.register);
router.post("/login", controller.login);

//login with google
router.get('/google', 
    passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'login' })
);

router.get('/google/callback', 
    passport.authenticate('google', { session: false, failureRedirect: '/' }),
    (req, res) => {
        const token = req.user.token;
        res.redirect(`http://localhost:3000/adminDash.html?token=${token}`);
    }
);

router.post("/registerGoogle", controller.registerGoogle);

//user CRUD routes
router.route("/")
  //.post(createUser)
  .get(getUsers);

router.route("/:id")
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
//merge issues are resolved....when coding check if your code aligns....this is a combo of routes.js from me and D_Precious