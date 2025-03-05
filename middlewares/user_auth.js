const jwt = require('jsonwebtoken')
async function user_auth(req, res, next){
    const {token} = req.cookies
    if(!token){
        return res.json({
            success:false,
            message: "Not Authorized, Login again"
        })
    }
    try{
        const decoded_token = jwt.verify(token, process.env.JWT_SECRET)
        if(decoded_token.userId){
            req.body.user_id = decoded_token.userId
        }else{
            return res.json({
                success:false,
                message: "Not Authorized, Login again"
            })
        }
        next();

    }catch(error){
        return res.json({
            success:false,
            message: error.message 
        })
    }   

}
module.exports = user_auth;