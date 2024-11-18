const md5 = require(`md5`)
const jwt = require(`jsonwebtoken`)
//load moddel of user ,untuk nyocoken tabel user
const userModel = require(`../models/index`).user
async function verifyToken(token){
    try {
        let secretKey =`sixnature joss`
        let decode = jwt.verify(token, secretKey)
        return true
    } catch (error) {
        
    }
}

exports.authentication = async(request,response)=>{
    try {
        //grab username and password
        let params = {
            username : request.body.username,
            password : md5(request.body.password),

        }
        //check user exist
        let result = await userModel.findOne (
            {
                where : params
            }
        )
        //validate
        if(result){
            //if user has exist, generate token
            //define secret key of jwt
            let secretKey =`sixnature joss`
            //define
            let header={
                algorithm : "HS256"

            }
            //define paylod
            let payload = JSON.stringify(result)
            //do generate
            let token = jwt.sign(payload,secretKey,header)
            //give response
            return response.json({
                status:true,
                token: token,
                message:`login berhasil`,
                data: result
            })
         
        } else {
            //if user doesnt exist
            return response.json({
                status : false,
                message:`invalid username or password`
            })
        }
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
        
    }
}
//mengecek user apakah layak mengakses enpoint yg diinginkan/validasi token
exports.authorization=(roles)=>{
    return async function(request, response, next){
        try {
            //grab data header
            let headers = request.headers.authorization
            //grab data token
            //bearer token gfyevhmdvuy, tanda tanya untuk antisipasi jika variabel tsb bernilai undifine
            //split digunakan memecah string ke array
            let token = headers?.split(" ")[1]

            if(token== null){
                return response
                .status(401)
                .json({
                    status:false,
                    message:`unauthorized`
                })
            }
            //check verify token 
            if(! await verifyToken(token)){
                return response
                .status(401)
                .json({
                    status:false,
                    message:`invalid token`
                })
            }
            let plainText = jwt.decode(token)
            //check allowed roles
            if(!roles.includes(plainText?.role)){
                return response
                .status(401)
                .json({
                    status:false,
                    message:`FORBIDDEN ACCES`
                })
            }
            next()

           
            
        } catch (error) {
            return response.json({
                status:false,
                message:error.message
            })
        }
    }
}