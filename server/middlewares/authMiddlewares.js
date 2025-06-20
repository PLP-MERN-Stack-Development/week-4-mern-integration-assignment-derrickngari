const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

exports.authMiddleware = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
      try{
        token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET)

        req.user = await User.findById(decoded.id).select('-password')
        next();
      } catch (error) {
        res.status(401).json({ message: 'Unauthorized, Token Failed' })
      }
    }

    if (!token) return res.status(401).json({message: "Unauthorized, No Token"});
}

exports.isAdmin = async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(401).json({ message: 'Unauthorized, Admin Access Required' })
  }
  next();
}