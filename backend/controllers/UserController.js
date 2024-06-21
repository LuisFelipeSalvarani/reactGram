const User = require("../models/User")

const bcrypt = require("bcryptjs")
const jws = require("jsonwebtoken")

const jwsSecret = process.env.JWT_SECRET

// Generate user token
const generateToken = (id) => {
    return jwt.sign({id}, jwsSecret, {
        expiresIn: "7d",
    })
}

// Register user and sign in
const register = async(req, res) => {
    res.send("Registro")
}

module.exports = {
    register,
}