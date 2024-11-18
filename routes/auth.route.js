const express = require(`express`)
const app = express()
app.use(express.json())
const authController = 
require(`../controllers/auth.controller`)
app.post(`/auth`,authController.authentication)
module.exports = app