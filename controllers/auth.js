const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../db/models/user_model.js");
const saltrounds = 10; //Work Factor
JWT_SECRET = process.env.JWT_SECRET;
const crypto = require('crypto');
const transporter = require('../config/node_mailer.js')


async function register(req, res) {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.json({
            success: false,
            message: "Missing details",
        });
    }
    try {
        const existing_user = await User.findOne({ email });
        if (existing_user) {
            return res.json({
                success: false,
                message: "User already exist",
            });
        }
        bcrypt.hash(password, saltrounds, async function (err, hash) {
            if (err) {
                return res.json({
                    success: false,
                    message: "Error hashing password",
                });
            }

            const user = await User.create({
                name,
                email,
                password: hash,
            });

            const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
                expiresIn: "1h",
            });
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "Production",
                sameSite: process.env.NODE_ENV === "Production" ? "none" : "strict",
                maxAge: 1 * 24 * 60 * 1000,
            });

            //Welcome Email to User - Nodemailer
            const mail_options = {
                from: process.env.Sender_email,
                to: email,
                subject: 'Welcome Message',
                text: `Welcome to our website, your account has been created with email id: ${email}`
            }
            await transporter.sendMail(mail_options)

            return res.json({ success: true });
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message,
        });
    }
}

async function login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({
            success: false,
            message: "Email and password are required",
        });
    }
    try {
        const user = await User.findOne({ email });
        // console.log(user)
        if (!user) {
            return res.json({
                success: false,
                message: "Invalid Email",
            });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.json({
                success: false,
                message: "Invalid password",
            });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
            expiresIn: "1h",
        });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "Production",
            sameSite: process.env.NODE_ENV === "Production" ? "none" : "strict",
            maxAge: 1 * 24 * 60 * 1000,
        });

        return res.json({ success: true });
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

async function logout(req, res) {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "Production",
            sameSite: process.env.NODE_ENV === "Production" ? "none" : "strict",
        });
        return res
            .status(200)
            .json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        //console.error('Error during logout:', error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

//Send verification OTP to users email
async function sendVerifyOtp(req, res) {
    try {
        const { user_id } = req.body
        const user = await User.findById(user_id)
        if (user.isAccountVerified) {
            return res.json({
                success: true,
                message: "Account already verified"
            })
        }
        const otp = String(crypto.randomInt(100000, 999999))
        user.verifyOtp = otp
        user.verifyOtpExpiresAt = Date.now() + 15 * 60 * 1000
        await user.save()
        const mail_options = {
            from: process.env.Sender_email,
            to: user.email,
            subject: 'Account Verification OTP',
            text: `Your OTP is : ${otp}, Verify your account using this OTP`
        }
        await transporter.sendMail(mail_options)

        return res.json({ success: true, message: "Verification OTP sent on Email " });

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }

}

async function verifyEmail(req, res){
    const {user_id, otp} = req.body;
    if(!user_id || !otp){
        return res.json({
            success:false,
            message: "Missing details"
        })
    }
    try{
        const user = await User.findById(user_id)
        if(!user){
            return res.json({
                success:false,
                message: "User not found"
            })
        }
        if(user.verifyOtp != otp){
            return res.json({
                success:false,
                message: "Invalid OTP"
            })
        }
        if(user.verifyOtpExpiresAt < Date.now()){
            return res.json({
                success:false,
                message: "OTP expired"
            })
        }
        user.isAccountVerified = true;
        user.verifyOtp = ''
        user.verifyOtpExpiresAt = 0
        await user.save()

        return res.json({
            success:true,
            message: "Account verified"
        })
    }catch(error){
        return res.json({
            success:false,
            message: error.message
        })
    }
}

async function isauthenticated(req, res) {
    try{
        return res.json({success: true})
    }catch(error){
        return res.json({
            success: false,
            message: error.message
        })
    }
    
}


//Password reset
async function password_resetOtp(req, res) {
    const {email} =  req.body
    if(!email){
        return res.json({
            success:false,
            message: "Missing Details, email required"
        })
    }
    var  user = 0
    try{
         user = await User.findOne({email})
    if(!user){
        return res.json({
            success:false,
            message: "User doest not exits"
        })
    }}catch(error){
        return res.json({
            success:false,
            message: `${error.message}`
        })
    }
    try {
        const otp = String(crypto.randomInt(100000, 999999))
        user.resetOtp = otp
        user.resetOtpExpiresAt = Date.now() + 5 * 60 * 1000 // expires in 5 minutes
        await user.save()
        const mail_options = {
            from: process.env.Sender_email,
            to: user.email,
            subject: 'Password reset OTP',
            text: `Your OTP for password resetting is : ${otp}`
        }
        await transporter.sendMail(mail_options)

        return res.json({ success: true, message: "Password reset OTP sent on Email " });

    
}catch(error){
    return res.json({
        success:false,
        message: error.message
    })
}
}

async function change_password(req, res){
    const {email,otp,newpassword} = req.body  //password reset otp
    if(!email || !otp || !newpassword){
        return res.json({
            success:false,
            message: "Missing details"
        })
    }
    try{
        const user = await User.findOne({email})
        if(!user){
            return res.json({
                success:false,
                message: "User doest not exists"
            })
        }
        if(user.resetOtp !== otp){
            return res.json({
                success:false,
                message: "Invalid otp"
            })
        }
        if(user.resetOtpExpiresAt < Date.now()){
            return res.json({
                success:false,
                message: "OTP Expired"
            })
        }

        const hashed_password = await bcrypt.hash(newpassword, saltrounds)
        user.password = hashed_password
        user.resetOtp =''
        user.resetOtpExpiresAt = 0
        await user.save()
        return res.json({
            success:true,
            message: "Password has been reset successfully"
        })
    }
    catch(error){
        return res.json({
            success:false,
            message: error.message
        })
    }

    

}
module.exports = {
    register,
    login,
    logout,
    sendVerifyOtp,
    verifyEmail,
    isauthenticated,
    password_resetOtp,
    change_password,
};
