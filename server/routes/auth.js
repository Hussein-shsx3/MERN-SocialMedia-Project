import express from "express";
import User from "../models/Users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    //* find User
    const findUser = await User.findOne({ email });
    if (!findUser) {
      return res.status(400).send("User not found!");
    }
    const passwordMatch = await bcrypt.compare(password, findUser.password);
    if (passwordMatch) {
      const token = jwt.sign({ id: findUser._id }, process.env.TOKEN_KAY, {
        expiresIn: "1d",
      });
      res.status(200).json({
        userDetails: {
          id: findUser._id,
          name: findUser.name,
          email: findUser.email,
          role: findUser.role,
        },
        token,
      });
    } else {
      res.status(400).send("Your password was wrong!");
    }
  } catch (err) {
    next(err);
  }
});

export default router;
