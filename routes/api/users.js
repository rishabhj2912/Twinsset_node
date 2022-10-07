const express = require("express");
const { check, validationResult } = require("express-validator/check");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

const User = require("../../models/User");

//@route   POST api/users
//@desc    Register user route
//@access  Public
router.post(
  "/",
  [
    check("first_name", "Name is required").not().isEmpty(),
    check("last_name", "Name is required").not().isEmpty(),
    check("email", "Please fill in a valid email-id").isEmail(),
    check("password", "Please enter a password with minimum length 6").isLength(
      {
        min: 6,
      }
    ),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { first_name, last_name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      //checks if user already exists
      if (user) {
        return res.status(400).json({ errors: [{ msg: "User already exists!!" }] });
      }
      user = new User({
        first_name,
        last_name,
        email,
        password,
      });
      //encrypting the password
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error!");
    }
  }
);

module.exports = router;