import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";


const ResetPassword = () => {
  axios.defaults.withCredentials = true
  const {backendurl} = useContext(AppContext)
  const [email, setemail] = useState('')
  const [new_password, set_new_password] = useState('')
  const[isEmailSent, setIsEmailSent] = useState(false)
  const[isOtpSubmitted, setIsOtpSubmitted] = useState(false)
  const[otp, sepOtp] = useState(0)
  const navigate = useNavigate()
  const inputRef = React.useRef([])
  
    const Input_handler = (e, index)=>{
      if(e.target.value.length == 1 && index < inputRef.current.length - 1){
        inputRef.current[index + 1].focus()
      }
    }
    const backspace_handler = (e, index)=>{
      if(e.key === 'Backspace' && e.target.value === '' && index > 0){
        inputRef.current[index - 1 ].focus()
      }
    }
    const handle_paste = (e)=>{
      const paste = e.clipboardData.getData('text')
      const paste_array = paste.split('');
      paste_array.forEach((char, index)=>{
        if(inputRef.current[index]){
          inputRef.current[index].value = char;
        }
      })
  
    }
    const EmailSubmitHandler = async(e)=>{
      e.preventDefault();
      try{
        const {data} = await axios.post(backendurl + '/auth/reset_passwordOtp',{
          email
        })

        if(data.success){
          toast.success(data.message)
          setIsEmailSent(true)
        }else{
          toast.error(data.message)
        }
      }catch(error){
        toast.error(error.message)
      }
    }
    const OtpSubmitHandler = async(e) =>{
      e.preventDefault();
      console.log("1")
      const otpArray = inputRef.current.map(e=>e.value)
      sepOtp(otpArray.join(''))
      setIsOtpSubmitted(true)
      console.log("2")
    }
    const NewpasswordHandler = async(e) =>{
      e.preventDefault();
      try{
        const {data} = await axios.post(backendurl + '/auth/reset_password ',{
          email, newpassword: new_password, otp
        })

        if(data.success){
          toast.success(data.message)
          navigate('/login')
        }else{
          toast.error(data.message)
        }
      }catch(error){
        toast.error(error.message)
      }
    }
  return (
    <div
      className="flex items-center justify-center  min-h-screen
    bg-gradient-to-br from-blue-200 to-purple-400"
    >
      <img
        onClick={() => navigate("/")}
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
        src={assets.logo}
        alt=""
      />
      {!isEmailSent &&
      <form onSubmit = {EmailSubmitHandler}className=' bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
      <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password</h1>
      <p className='text-center mb-6 text-indigo-300'>Enter your registered mail address</p> 
      <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
        <img src={assets.mail_icon} alt=""  className="w-3 h-3"/>
        <input type="email"  placeholder="Email Id" className="bg-transparent text-white outline-none"
        value={email} onChange={e=> setemail(e. target.value)} required/>
      </div>
        <button className=" cursor-pointer w-full mt-3 rounded-full py-2.5 
          text-white font-medium bg-gradient-to-r from-indigo-500 to-indigo-900">
            Submit
          </button>
      </form>
}

      {isEmailSent && !isOtpSubmitted &&   
      <form onSubmit={OtpSubmitHandler} className=' bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
      <h1 className='text-white text-2xl font-semibold text-center mb-4'>Password Reset OTP</h1>
      <p className='text-center mb-6 text-indigo-300'>Enter the 6-digit code sent to your mail id</p>
      <div onPaste={handle_paste} className="flex justify-between mb-6">
          {Array(6).fill(0).map((_, index) => (
            <input
              required
              key={index}  // key is set as the index of the iteration
              type="text"
              maxLength="1"
              onInput={e =>Input_handler(e, index)}
              ref={e =>inputRef.current[index] = e}
              onKeyDown={e=>backspace_handler(e, index)}
              className="w-12 h-12 text-center bg-[#333A5C] text-white text-xl rounded-md"
            />   
          ))}
</div> 
          <div>
            <button className=' w-full py-2.5 bg-gradient-to-r from-indigo-500 to bg-indigo-900 rounded-full text-white cursor-pointer'>Submit</button>
          </div>

      </form>}
     

      {isEmailSent && isOtpSubmitted &&
      <form onSubmit={NewpasswordHandler} className=' bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
      <h1 className='text-white text-2xl font-semibold text-center mb-4'>New  Password</h1>
      <p className='text-center mb-6 text-indigo-300'>Enter New password below</p> 
      <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
        <img src={assets.lock_icon} alt=""  className="w-3 h-3"/>
        <input type="password"  placeholder="New Password" className="bg-transparent text-white outline-none"
        value={new_password} onChange={e=> set_new_password(e. target.value)} required/>
      </div>
        <button className=" cursor-pointer w-full mt-3 rounded-full py-2.5 
          text-white font-medium bg-gradient-to-r from-indigo-500 to-indigo-900">
            Submit
          </button>
      </form>}


    </div>
  );
};

export default ResetPassword;
