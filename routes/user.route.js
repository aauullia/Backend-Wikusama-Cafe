/** load express library */
const express = require(`express`)
const app = express()
/** create object of express */

/** allow to read a request from body with json format  */
app.use(express.json());

/** load auth function */
const { authorization } = require(`../controllers/auth.controller`)
/** load controller of user */
const userController = require(`../controllers/user.controller`)

app.post(`/users`, userController.addUser) /** create route for add user */
app.get(`/users`, userController.getUser) /** create route for get all user */
app.get(`/users/find`, authorization(["admin","kasir","manajer"]), userController.findUser) /** create route for search user */
app.put(`/users/:id_user`, authorization(["admin","kasir","manajer"]), userController.updateUser) /** create route for edit user */
app.delete(`/users/:id_user`, authorization(["admin","kasir","manajer"]), userController.deleteUser) /** create route for delete user */

/**export app object */
module.exports = app