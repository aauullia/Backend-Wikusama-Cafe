/**memanggil model */
const mejaModel = require(`../models/index`).meja
const transaksiModel = require(`../models/index`).transaksi
/**membuat dan mengekspor fungsi untuk pembuatan meja */
/**bcall joi library */
const joi = require(`joi`)
const transaksi = require("../models/transaksi")
/**define func to validate input of meja */
const validateMeja = async (input) => {
    let rules = joi.object().keys({
        nomor_meja: joi.string().required(),
        status: joi.boolean().required()
    })

    /**validate proses */
    let { error } = rules.validate(input)

    if (error) {
        let message = error
            .details
            .map(item => item.message)
            .join(`,`)
        return {
            return: false,
            message: message,
        }
    }
    return { status: true }
}
exports.getMeja = async (request, response) => {
    try {
        /**call meja from database,model berfungsi menjebatani,pakek await karna findall adlh promise */
        let meja = await mejaModel.findAll()
        /**give a response */
        return response.json({
            status: true,
            data: meja
        })

    } catch (error) {
        return response.json({
            return: false,
            message: error.message,
        })
    }
}
/**create and export func to filter meja */
// untuk yg saat dicari munculnya meja yang terisi
// exports.availableMeja = async (request, response) => {
//     try {
//         /**define */
//         // let param = { status: true }
//         let meja = await mejaModel.findAll({ where: {status: true} })
//         /**give response */
//         return response.json({
//             status: true,
//             data: meja
//         })

//     } catch (error) {
//         return response.json({
//             return: false,
//             message: error.message,
//         })
//     }
// }

// untuk yang saat dicari muncul nya meja yang kosong 
exports.availableMeja = async (request, response) => {
    try {
        /** Find all tables where status is false (indicating available/empty tables) */
        let meja = await mejaModel.findAll({ where: { status: `kosong` } });

        // Check if no available tables were found
        if (meja.length === 0) {
            return response.json({
                status: true,
                message: "Tidak ada meja yang kosong",  // Message indicating no available tables
                data: []
            });
        }

        /** Return available tables */
        return response.json({
            status: true,
            data: meja
        });

    } catch (error) {
        // Handle errors
        return response.json({
            status: false,
            message: error.message,
        });
    }
};


/**creat and export func to add  new meja */
exports.addMeja = async (request, response) => {
    try {
        /** validasi data */
        let resultValidation = validateMeja(request.body)
        if (resultValidation.status == false) {
            return response.json({
                status: false,
                message: resultValidation.message
            })
        }
        /**insert data meja to db using model */
        await mejaModel.create(request.body)
        /**give a response to tell that insert has succesed */
        return response.json({
            status: true,
            message: 'Data meja berhasil ditambahkan'
        })

    } catch (error) {
        return response.json({
            return: false,
            message: error.message,
        })
    }
}
// exports.updateMeja = async (request, response) => {
//     try {
//         /**get parameter for update */
//         let id_meja = request.params.id_meja
//         /**validate data meja */
//         let resultValidation = validateMeja(request.body)
//         if (resultValidation.status == false) {
//             //jika validasi salah
//             return response.json({
//                 return: false,
//                 message: resultValidation
//             })
//         }
//         /**process run update meja */
//         mejaModel.update(request.body, {
//             where: { id_meja: id_meja }
//         })
//         return response.json({
//             return: true,
//             message: error.message
//         })

//     } catch (error) {
//         return response.json({
//             return: false,
//             message: error.message,
//         })
//     }
// }

exports.updateMeja = async (request, response) => {
    try {
        /** get parameter for update */
        let id_meja = request.params.id_meja

        /** validate data meja */
        let resultValidation = validateMeja(request.body)
        if (resultValidation.status == false) {
            // jika validasi salah
            return response.json({
                return: false,
                message: resultValidation.message // resultValidation seharusnya memiliki .message
            })
        }

        /** process run update meja */
        await mejaModel.update(request.body, {
            where: { id_meja: id_meja }
        })

        /** give a response after successful update */
        return response.json({
            return: true,
            message: 'Data meja berhasil diupdate'
        })

    } catch (error) {
        /** handle error */
        return response.json({
            return: false,
            message: error.message,
        })
    }
}

/**create & export function delete meja */
exports.deleteMeja = async (request, response) => {
    try {
        /**get id meja yg akan di hapus */
        let id_mejaa = request.params.id_meja

        /** sebelum di hapus dicek dulu keberadaan transaksi di meja tsb */
        let meja = await transaksiModel.findOne({
            where: { id_meja: id_mejaa }
        })

        if (meja) {
            /**give response */
            return response.json({
                status: true,
                message: `meja tidak dapat dihapus`
            })
        }

        /** hapus meja */
        await mejaModel.destroy({where: {id_meja:id_mejaa}})

        /**give response */
        return response.json({
            status: true,
            message: `data meja berhsil dihapus`,
        })
    } catch (error) {
        return response.json({
            return: false,
            message: error.message,
        })
    }
}