const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const { body, validationResult } = require("express-validator");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var fetchuser = require("../middleware/fetchuser");

const JWT_secret = "this_is_siddharthather";

// Create a user using: post"/api/auth/createuser". Doesn't require Auth
router.post(
  "/createuser",
  [
    body("name", "enter a valid name").isLength({ min: 3 }),
    body("email", "enter a valid emil").isEmail(),
    body("password", "enter a valid passcode").isLength({ min: 4 }),
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user !== null) {
        res.status(400).json({ error: "Email is already in use." });
      }

      const salt = await bcrypt.genSalt(10);
      const securepass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securepass,
      });
      const data = {
        user: {
          id: user.id,
        },
      };

      const token = jwt.sign(data, JWT_secret);
      res.json(token);

      // .then(user=> res.json(user)).catch(err=>res.status(400).json("please enter a unique value"));
    } catch (error) {
      console.log("Error at creating the user", error);
      res.status(500).json("Internal Error");
    }
  }
);

// Create a user using: post"/api/auth/login". Doesn't require Auth
router.post(
  "/login",
  [
    body("email", "enter a valid emil").isEmail(),
    body("password", "please enter the [passcode").exists(),
  ],
  async (req, res) => {
    try {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
      }

      const { email, password } = req.body;
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json("Invalid Email or Password");
      }
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(400).json("Invalid Email or Password");
      }

      const payload = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(payload, JWT_secret /*,{ expiresIn:'1h'}*/);
      res.json(token);
    } catch (error) {
      console.log("Error at creating the user", error);
      res.status(500).json("Internal Error");
    }
  }
);

// Create a user using: post"/api/auth/getuser". Doesn't require Auth
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    userid = req.user.id;
    console.log(userid);
    const user = await User.findById(userid).select("-password");
    res.send(user);
  } catch (error) {
    console.log("Error at creating the user", error);
    res.status(500).json("Internal Error");
  }
});
module.exports = router;

//   //gptcode
//   const express= require("express");
// const router= express.Router();
// const User = require("../Models/User")
// const { body, validationResult } = require('express-validator');

// // // Create a user using: post"/api/auth/createuser". Doesn't require Auth
//   router.post('/createuser',[
//     body("name", "Enter a valid name").isLength({ min: 3 }),
//     body("email", "Enter a valid email").isEmail(),
//     body("password", "Enter a valid password").isLength({ min: 4 })
// ], async (req, res) => {
//     try {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }

//         let user = await User.findOne({ email: req.body.email });
//         if (user) {
//             return res.status(400).json({ error: "Email is already in use." });
//         }

//         user = await User.create({
//             name: req.body.name,
//             email: req.body.email,
//             password: req.body.password
//         });

//         return res.json(user);
//     } catch (error) {
//         console.error("Error at creating the user", error);
//         return res.status(500).json("Internal Error");
//     }
// });
// module.exports = router
