import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

//signup user || register user

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    //checking is user already exists
    const existUser = await userModel.findOne({ email });
    if (existUser) {
      return res.json({ success: false, massage: "User already exists" });
    }
    //validating email format & strong password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        massage: "Please enter a valid email",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        massage: "Please enter a strong password",
      });
    }
    //hash user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });
    const user = await newUser.save();

    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, massage: "Error" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, massage: "User Dosen't exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, massage: "Invalid credetials" });
    }
    const token = createToken(user._id);
    return res.json({ success: true, token });
  } catch (error) {
    console.log(error);

    return res.json({ success: false, massage: "Error" });
  }
};
