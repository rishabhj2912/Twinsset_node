const express = require('express');
const { check, validationResult } = require("express-validator/check");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../../middleware/auth");
const User = require("../../models/User")

//@route   POST api/login
//@desc    Authenticate user and get token
//@access  Public
router.post(
    "/",
    [
 
      check("email", "Please fill in a valid email-id").isEmail(),
      check("password", 
            "Password is required").exists()
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email, password } = req.body;
  
      try {
        let user = await User.findOne({ email });
        //checks if user already exists
        if (!user) {
          res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
        }
        
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch)
        {
            res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
        }

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