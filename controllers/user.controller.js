/** load model for 'users' table */
const userModel = require(`../models/index`).user

/** joi */
const joi = require(`joi`)

/** load Operation from sequelize  */
const { Op }  = require("sequelize")

/**load md5 */
const md5 = require(`md5`)

/**create a validation function */
let validateUser = async (input) => {
    let rules = joi.object().keys({
        name_user: joi.string().required(),
        role: joi.string()
            .validate(`kasir`, `admin`, `manager`),
         username: joi.string().required(),
         password: joi.string().min(3)
    })

    /** proses validation */
    let { error } = rules.validate(input)
    /** chechk error validation  */
    if (error) {
        let message = error
            .details
            .map(item => item.message)
            .join(",")
        return {
            status: false,
            message: message
        }
    }
    return {
        status: true
    }
}

/** create and mexport function to get all user  */
exports.getUser = async (request, response) => {
    try {
        /** get all user using model */
        let result = await userModel.findAll()

        /** give a respinse */
        return response.json({
            status: true,
            data: result
        })
    } catch (error) {
        return response
            .status(400)
            .json({
                status: false.valueOf,
                message: error.message
            })
    }
}

/** create and export function to find user */
exports.findUser = async (request, response) => {
    try {
        /** get the keyword of search */
        let keyword = request.body.keyword

        /** get user based on keyword using model */
        let result = await userModel.findAll({
            where: {
                [Op.or]: {
                    nama_user: { [Op.substring]: keyword },
                    role: { [Op.substring]: keyword },
                    username: { [Op.substring]: keyword }
                }
            }
        })

        /** give a response */
        return response.json({
            status: true,
            data: result
        })
    } catch (error) {
        return response
            .status(400)
            .json({
                status: false,
                message: error.message
            })
    }
}

/** create and export function to add user */
exports.addUser = async (request, response) => {
    try {
        /** validate a request */
        let resultValidation = validateUser(request.body)
        if (resultValidation.status === false) {
            return response
                .status(400)
                .json({
                    status: false,
                    message: resultValidation.message
                })
        }

        /** convert a password to md5 form */
        request.body.password = md5(
            request.body.password 
        )

        /**execute insert user using model */
        await userModel.create(request.body)

        /** give a response */
        return response.json({
            status: true,
            message: `Data user berhasil ditambahkan`
        })
    } catch (error) {
        return response
            .status(400)
            .json({
                status: false,
                message: error.message
            })
    }
}

/** create and export function to update user */
exports.updateUser = async (request, response) => {
    try {
        /** get id user that will be update */
        let id_user = request.params.id_user

        /** validate a request body */
        let resultValidation = validateUser(request.body)

        /** check result validation */
        if (resultValidation.status === false) {
            return response
                .status(400)
                .json({
                    status: false,
                    message: resultValidation.message
                })
        }

        /** convert password to md5 if it exist  */
        if (request.body.password) {
            request.body.password = md5(
                request.body.password 
            )
        }

        /** execute update user using model */
        await userModel.update(
            request.body,
            { where: { id_user:id_user } }
        )

        /** give a response */
        return response.json({
            status: true,
            message: `Data user telah di ubah`
        })
    } catch (error) {
        return response
            .status(400)
            .json({
                status: false,
                message: error.message
            })
    }
}

/** create and export function to delete user */
exports.deleteUser = async (request, response) => {
    try {
        /** get id_user that will be delete */
        let id_user = request.params.id_user
        /** execute delete user using model */
        await userModel.destroy({
            where: { id_user: id_user}
        })

        /** give a response */
        return response.json({
            status:true,
            message: `Data user telah di hilangkan`
        })
    } catch (error) {
        return response
            .status(400)
            .json({
                status: false,
                message: error.message
            })
    }
}