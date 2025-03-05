const User = require("../db/models/user_model.js");
async function get_user_data(req, res) {
    try{
        const {user_id} = req.body
        const user = await User.findById(user_id)
        if(!user){
            return res.json({ success: false, message: "User Not found" });
        }
        return res.json({ success: true, user_data: {
            name: user.name,
            isAccountVerified: user.isAccountVerified
        } });
    }catch(error){
        return res.json({ success: false, message:error.message});
    }
    
}
module.exports = get_user_data;