const express = require(`express`)
const app = express()

app.use(express.json())

/**load controller of user */
const transaksiController = require(`../controllers/transaksi.controller`)
const {authorization}=require(`../controllers/auth.controller`)
/**create route for get all user */
app.get(`/transaksis`,authorization(["manajer","kasir"]), transaksiController.getTransaksi)
app.post(`/transaksis`, authorization(["kasir"]),transaksiController.addTransaksi)
app.put(`/transaksis/:id_transaksi`,  authorization(["kasir"]),transaksiController.updateTransaksi)
app.delete(`/transaksis/:id_transaksi`, authorization(["kasir"]), transaksiController.deleteTransaksi)
app.get(`/transaksis/print/:id_transaksi`, authorization(["kasir"]), transaksiController.printNota)

module.exports= app