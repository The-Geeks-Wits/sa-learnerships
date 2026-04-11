const express = require("express");
const router = express.Router();
const passport = require("passport");

//importing the controllers
const controller = require("./controller");
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("./controller");

// auth
router.post("/register", controller.register);
router.post("/login", controller.login);

// google auth
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

router.get('/google/callback', 
    passport.authenticate('google', { session: false, failureRedirect: '/' }),
    (req, res) => {
        const token = req.user.token;
        res.redirect(`http://localhost:3000/adminDash.html?token=${token}`);
    }
);

router.post("/registerGoogle", controller.register);

//user CRUD routes
router.route("/")
  .get(getUsers);

router.route("/:id")
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;