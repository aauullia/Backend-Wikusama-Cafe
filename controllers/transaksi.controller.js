const transaksiModel = require(`../models/index`).transaksi
const detailModel = require(`../models/index`).detail_transaksi
const menuModel = require(`../models/index`).menu
const userModel = require(`../models/index`).user
/**create and export func  */
// exports.addTransaksi = async (request, response) => {
//     try {
//         // Prepare data to add into transaksi
//         let newTransaksi = {
//             tgl_transaksi: request.body.tgl_transaksi,
//             id_user: request.body.id_user,
//             id_meja: request.body.id_meja,
//             nama_pelanggan: request.body.nama_pelanggan,
//             status: `belum_bayar`
//         };

//         // Insert into transaksi
//         let insertTransaksi = await transaksiModel.create(newTransaksi);
//         let latesID = insertTransaksi.id_transaksi;

//         // Prepare detail transaksi
//         let arrDetail = request.body.detail_transaksi;

//         // Loop through arrDetail and add id_transaksi and harga
//         for (let i = 0; i < arrDetail.length; i++) {
//             arrDetail[i].id_transaksi = latesID;

//             // Get the selected menu based on id_menu
//             let selectedMenu = await menuModel.findOne({
//                 where: { id_menu: arrDetail[i].id_menu }
//             });

//             // Ensure the menu exists before proceeding
//             if (!selectedMenu) {
//                 return response.json({
//                     status: false,
//                     message: `Menu with id_menu ${arrDetail[i].id_menu} not found`
//                 });
//             }

//             // Add harga to arrDetail
//             arrDetail[i].harga = selectedMenu.harga;
//         }

//         // Debug: Check arrDetail before insertion
//         console.log(arrDetail);

//         // Bulk insert into detailModel
//         await detailModel.bulkCreate(arrDetail);

//         // Response after success
//         return response.json({
//             status: true,
//             message: `Data transaksi berhasil ditambahkan`
//         });

//     } catch (error) {
//         // Error handling
//         return response.json({
//             status: false,
//             message: error.message
//         });
//     }
// };

exports.addTransaksi = async (request, response) => {
    try {
        // Prepare data to add into transaksi
        let newTransaksi = {
            tgl_transaksi: request.body.tgl_transaksi,
            id_user: request.body.id_user,
            id_meja: request.body.id_meja,
            nama_pelanggan: request.body.nama_pelanggan,
            status: request.body.status
        };

        // Insert into transaksi
        let insertTransaksi = await transaksiModel.create(newTransaksi);
        let latesID = insertTransaksi.id_transaksi;

        // Prepare detail transaksi
        let arrDetail = request.body.detail_transaksi;

        // Loop through arrDetail and add id_transaksi and harga * jumlah
        for (let i = 0; i < arrDetail.length; i++) {
            arrDetail[i].id_transaksi = latesID;

            // Get the selected menu based on id_menu
            let selectedMenu = await menuModel.findOne({
                where: { id_menu: arrDetail[i].id_menu }
            });

            // Ensure the menu exists before proceeding
            if (!selectedMenu) {
                return response.json({
                    status: false,
                    message: `Menu with id_menu ${arrDetail[i].id_menu} not found`
                });
            }

            // Calculate total price based on the selected quantity (jumlah)
            arrDetail[i].harga = selectedMenu.harga * arrDetail[i].jumlah;
        }
        

        // Debug: Check arrDetail before insertion
        console.log(arrDetail);

        // Bulk insert into detailModel
        await detailModel.bulkCreate(arrDetail);

        // Response after success
        return response.json({
            status: true,
            message: `Data transaksi berhasil ditambahkan`
        });

    } catch (error) {
        // Error handling
        return response.json({
            status: false,
            message: error.message
        });
    }
};


//create to edit transaksi
exports.updateTransaksi = async(request, response) => {
    try {
        // get id that will be update
        let id = request.params.id_transaksi

        // prepare data updated transaksi
        let dataTransaksi = {
            tgl_transaksi: request.body.tgl_transaksi,
            id_user: request.body.id_user,
            id_meja: request.body.id_meja,
            nama_pelanggan: request.body.nama_pelanggan,
            status: request.body.status
        }

        // execute update transaksi using model
        await transaksiModel.update(
            dataTransaksi,
            {where: {id_transaksi: id}}
        )

        // execute
        await detailModel.destroy({
            where: {id_transaksi: id}
        })

        // let arrDetail = request.body.detail_transaksi
        // // loop each arrdetail to insert last id
        // for (let i = 0; i < arrDetail.length; i++) {
        //     arrDetail[i].id_transaksi = id
        //     // get selected menu based on id_menu
        //     let selectedMenu = await menuModel.findOne({where: {id_menu: arrDetail[i].id_menu}})
        //     arrDetail[i].harga = selectedMenu?.harga
        // }

        // // insert new detail using model
        // await detailModel.bulkCreate(arrDetail)

        // give a response
        return response.json({
            status: true,
            message: `Data berhasil diubah`
        })
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
} 
//create and export func to delete transaksi
exports.deleteTransaksi= async(request,response)=>{
    try {
      //get id trannsaksi
      let id_transaksi = request.params.id_transaksi
      //execute delete detail using modekl
      await detailModel.destroy({
        where:{id_transaksi:id_transaksi}
      })  
      //execute delete transaksi using model
      await transaksiModel.destroy({
        where:{id_transaksi:id_transaksi}
      })  
      //give a response
      return response.json({
        status: true,
        message: `data transaksi telah dihapus`
    })
    
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
        
    }
}
//create to getall transaksi
exports.getTransaksi = async(request,response)=>{
    try {
        // get all data using model
        let result = await transaksiModel.findAll({
            include: [
                "meja","user",{
                    model:detailModel,
                    as:"detail_transaksi",
                    include:["menu"]
                }
            ],
            order :[
                ['tgl_transaksi','DESC']
            ]
        })

        return response.json({
            status: true,
            data: result
        })
    } catch (error) {
         return response.json({
            status: false,
            message: error.message
        })
        
        //give a response
        return response.json({
            status: false,
            message: result
        })
    }
}
exports.findTransaksi= async(request,response)=>{
    try {
        let keyword = request.body.keyword
        let result = await transaksiModel.findAll({
            include:[
                "meja",
                {
                    model:userModel, as:"user", where:{
                        [Op.or]:{
                            nama_user:{[Op.substring]:keyword}
                        }
                    }
                },
                {model:detailModel, as:"detail_transaksi",include:["menu"]}
            ]
        })
        //response
        return response.json({
            status:true,
            data:result
        })
    } catch (error) {
        return response.json({
            status:false,
            data:error.message
        })
        
    }
}

const moment = require('moment-timezone'); // Import moment-timezone

exports.printNota = async (request, response) => {
    try {
        // Ambil id transaksi dari request params
        let id_transaksi = request.params.id_transaksi;
        const PDFDocument = require('pdfkit');
        const path = require('path');
        const fs = require('fs');

        // Dapatkan data transaksi beserta detailnya
        let transaksi = await transaksiModel.findOne({
            where: { id_transaksi: id_transaksi },
            include: [
                {
                    model: detailModel,
                    as: 'detail_transaksi',
                    include: [{ model: menuModel, as: 'menu' }] 
                }
            ]
        });

        // Jika transaksi tidak ditemukan
        if (!transaksi) {
            return response.status(404).json({
                status: false,
                message: "Transaksi tidak ditemukan"
            });
        }

        // Cek apakah status transaksi adalah "lunas"
        if (transaksi.status !== "lunas") {
            return response.status(403).json({
                status: false,
                message: "Nota hanya bisa dicetak untuk transaksi yang lunas."
            });
        }

        // Konversi tanggal transaksi ke waktu WIB
        let tanggalWIB = moment(transaksi.tgl_transaksi).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');

        // Membuat dokumen PDF
        const doc = new PDFDocument();
        let filePath = path.join(__dirname, `../nota_transaksi_${id_transaksi}.pdf`);
        let stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // Membuat konten PDF
        doc.fontSize(20).text('NOTA TRANSAKSI', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`ID Transaksi: ${transaksi.id_transaksi}`);
        doc.text(`Tanggal: ${tanggalWIB}`);  // Menggunakan waktu yang telah dikonversi ke WIB
        doc.text(`Nama Pelanggan: ${transaksi.nama_pelanggan}`);
        doc.moveDown();

        doc.fontSize(14).text('Detail Transaksi');
        doc.moveDown();

        let total = 0;
        if (transaksi.detail_transaksi && transaksi.detail_transaksi.length > 0) {
            transaksi.detail_transaksi.forEach((detail, index) => {
                let itemTotal = detail.jumlah * detail.harga;
                total += itemTotal;
                doc.text(`${index + 1}. ${detail.menu.nama_menu} x ${detail.jumlah} @ Rp${detail.harga} = Rp${itemTotal}`);
            });
        } else {
            doc.text('Detail transaksi tidak ditemukan.');
        }

        doc.moveDown();
        doc.fontSize(16).text(`Total: Rp${total}`, { align: 'right' });

        doc.end();

        stream.on('finish', function() {
            response.setHeader('Content-Type', 'application/pdf');
            response.setHeader('Content-Disposition', `attachment; filename=nota_transaksi_${id_transaksi}.pdf`);
            response.download(filePath, (err) => {
                if (err) console.log("Error saat mengirim PDF:", err);
                fs.unlinkSync(filePath);
            });
        });

    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error.message
        });
    }
};
