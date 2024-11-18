const express = require(`express`)
const app = express()

/** define port for the server */
const PORT = 8000
const cors = require(`cors`)
app.use(cors())

/** load a route */
const mejaRoute = require(`./routes/meja.route`)
const menuRoute = require(`./routes/menu.route`)
const userRoute = require(`./routes/user.route`)
const transaksiRoute = require(`./routes/transaksi.route`)
const authRoute = require(`./routes/auth.route`)

/** register route  */
app.use(mejaRoute)
app.use(menuRoute)
app.use(userRoute)
app.use(transaksiRoute)
app.use(authRoute)
app.use(express.static(__dirname))

/** run the server */
app.listen(PORT, () => {
    console.log(`server run on port ${PORT}`)
})