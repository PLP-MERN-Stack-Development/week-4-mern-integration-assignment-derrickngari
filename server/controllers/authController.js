const User = require('../models/userModel')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) =>{
  return jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '30d'})
}

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Please fill in all fields" })
    }

    const checkUser = await User.findOne({ email})
    if (checkUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({ name, email, password: hashedPassword });
    res.status(201).json({ 
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email })

    if (!user) return res.status(400).json({ message: "User not found" })

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid password" })

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    })
}

exports.getUserProfile = async (req, res) => {
  const user = await User.findById(req.user.id)

  if (!user) return res.status(404).json({ message: "User not found" })

  res.status(200).json({
    id: user._id,
    name: user.name,
    email: user.email,
  })
}