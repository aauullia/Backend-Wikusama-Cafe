const menuModel = require(`../models/index`).menu 
const { request } = require("express")
const joi = require(`joi`)
const { Op } = require("sequelize")
const { response } = require("../routes/meja.route")

/**load upload  */
const upload = require(`./upload-menu`)

/**load path */
const path = require(`path`)
const fs = require(`fs`)

/**create function to validate */
const validateMenu = (input) => {
    /**define rules */
    let rules = joi.object().keys({
        nama_menu: joi.string().required(),
        jenis: joi
            .string()
            .valid('makanan', 'minuman',)
            .required(),
        deskripsi: joi.string().required(),
        harga: joi.number().required()
    })
    let { error } = rules.validate(input)
    if (error) {
        let message = error
            .details
            .map(item => item.message)
            .join(',')
        return {
            status: false,
            message: message
        }
    }
    return {
        status: true,
    }
}
/**cerate and export function to add all menu */
exports.addMenu = async (request, response) => {
    try {
        const uploadMenu = upload.single(`gambar`)
        uploadMenu(request, response, async error => {
            if (error) {
                return response.json({
                    status: false,
                    message: error.message

                })
            }
            /**ceck existing file */
            if (!request.file) {
                return response.json({
                    status: false,
                    message: 'nothing file to upload'

                })
            }

            if (request.body.harga < 0) {
                return response.status(400).json({
                    status:"error",
                    message:"Harga tidsk boleh kurang dari 0",
                });
            }
            /**check validation menu */
            let resultValidation = validateMenu(request.body)
            if (resultValidation.status == false) {
                return response.json({
                    status: false,
                    message: resultValidation.message
                })
            }
            /**slipping filename in request.body */
            request.body.gambar = request.file.filename
            /**insert menu usinf model */
            await menuModel.create(request.body)
            /**give a response */
            return response.json({
                status: true,
                message: 'Data menu telah ditambahkan'
            })

        })
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })

    }
}

/**create and export to get all menu */
exports.getMenu = async (request, response) => {
    try {
        let result = await menuModel.findAll()
        /**give a ressponse */
        return response.json({
            status: true,
            data: result
        })

    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })

    }
}

/**create and export function to filter menu */
exports.findMenu = async (request, response) => {
    try {
        // Retrieve the keyword from the request body
        let keyword = request.body.keyword;
        console.log("Keyword:", keyword);

        // Search for menus based on nama_menu containing the keyword
        let result = await menuModel.findAll({
            where: {
                nama_menu: { [Op.substring]: keyword }  // Filter by nama_menu
            }
        });

        console.log("Result:", result); // Log the search results

        // Check if no menu was found
        if (result.length === 0) {
            return response.status(404).json({
                status: false,
                message: `Menu dengan pencarian '${keyword}' tidak tersedia`,  // Clear error message
                data: []
            });
        }

        // Return the search result
        return response.json({
            status: true,
            data: result
        });

    } catch (error) {
        console.error("Error:", error); // Log the error
        return response.status(500).json({
            status: false,
            message: 'An error occurred while processing your request'  // General error message
        });
    }
};


/**create and export function to filter menu */
// exports.findMenu = async (request, response) => {
//     try {
//         let keyword = request.body.keyword;
//         console.log("Keyword:",keyword);

//         let result = await menuModel.findAll({
//             where: {
//                 [Op.or]: {
//                     nama_menu: { [Op.substring]: keyword },
//                     // jenis: { [Op.substring]: keyword },
//                     // deskripsi: { [Op.substring]: keyword }
//                 }
//             }
//         });

//         console.log("Result:", result); // Log hasil pencarian

//         // Check if result is empty
//         if (result.length === 0) {
//             return response.json({
//                 status: false,
//                 message: 'Menu tidak ada',
//                 data: []
//             });
//         }

//         /**give a response */
//         return response.json({
//             status: true,
//             data: result
//         });

//     } catch (error) {
//         console.error("Error:",error);
//         return response.json({
//             status: false,
//             message: error.message
//         });
//     }
// };

/**create function to update menu */
exports.updateMenu = async (request, response) => {
    try {
        const uploadMenu = upload.single(`gambar`)
        uploadMenu(request, response, async error => {
            if (error) {
                return response.json({
                    status: false,
                    message: error.message
                })
            }
            let id_menu = request.params.id_menu
            let selectedMenu = await menuModel
                .findOne({ where: { id_menu: id_menu } })

            /**check if update within upload`gambar` */
            if (request.file) {
                let oldFilename = selectedMenu.gambar
                let pathFile = path.join(__dirname, `../menu_image`, oldFilename)

                /**che ck the existing old file*/
                if (fs.existsSync(pathFile)) {
                    /**delete the old file */
                    fs.unlinkSync(pathFile, error => {
                        console.log(error)
                    })
                }
                /**insert the file to  request body */
                request.body.gambar = request.file.filename
            }
            /**update */
            await menuModel.update(
                request.body,
                { where: { id_menu: id_menu } }
            )
            /**give response */
            return response.json({
                status: true,
                message: `data menu telah diupdate`
            })
        })
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}
/**create and exports delete menu */
exports.deleteMenu = async (request, response) => {
    try {
        /** get id that will be deleted */
        let id_menu = request.params.id_menu;

        /** grab menu based on id */
        let selectedMenu = await menuModel.findOne({ where: { id_menu: id_menu } });

        if (!selectedMenu) {
            return response.json({
                status: false,
                message: `Menu with id_menu ${id_menu} not found`
            });
        }

        /** define the path of the file */
        let pathFile = path.join(__dirname, `../Gambar`, selectedMenu.gambar);

        /** check if the file exists */
        if (fs.existsSync(pathFile)) {
            // Asynchronously remove the file
            fs.unlink(pathFile, async (error) => {
                if (error) {
                    return response.json({
                        status: false,
                        message: `gagal untuk menghapus file: ${error.message}`
                    });
                }

                // Delete the menu from the database after file is deleted
                await menuModel.destroy({ where: { id_menu: id_menu } });

                return response.json({
                    status: true,
                    message: `Data menu berhasil terhapus`
                });
            });
        } else {
            // If the file does not exist, just delete the menu entry
            await menuModel.destroy({ where: { id_menu: id_menu } });
            return response.sssjson({
                status: true,
                message: `Data menu berhasil dihapus, tapi file gambar tidak berhasil ditemukan`
            });
        }

    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        });
    }
};
// exports.deleteMenu = async (request, response) => {
//     try {
//         /**get id that will be delete */
//         let id_menu = request.params.id_menu
//         /**grab menu best on id */
//         let selectedMenu = await menuModel
//             .findOne({ where: { id_menu: id_menu } })
//         /**define a path of file */
//         let pathFile = path.join(
//             __dirname, `../menu_image`,
//             selectedMenu.gambar)
//         /**existing file */
//         if (fs.existsSync(pathFile)) {
//             fs.unlinkSync(pathFile, error=> {
//                 console.log(error)
//             })
//             await menuModel.destroy({
//                 where: { id_menu: id_menu }
//             })
//             return response.json({
//                 status:true,
//                 message:`data menu dihapus`
//             })
//         }
//     } catch (error) {
//         return response.json({
//             status: false,
//             message: error.message
//         })
//     }
// }