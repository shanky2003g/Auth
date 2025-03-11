import React, { useContext, useEffect } from 'react'
import { assets } from "../assets/assets";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';
import axios from "axios";

const EmailVerify = () => { 
  axios.defaults.withCredentials = true
  const {userData, backendurl,  get_user_data, isLoggedin} =useContext(AppContext)
  const navigate = useNavigate();
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
  const onSubmitHandler = async(e)=>{
    try{
      e.preventDefault();
      const otpArray = inputRef.current.map(e=>e.value)
      const otp = otpArray.join('')
      const {data} = await axios.post(backendurl + '/auth/verify-account',{otp})
      if(data.success){
        toast.success(data.message)
        get_user_data()
        navigate('/')
      }
      else{
        toast.error(data.message)
      }
    }catch(error){
      toast.error(erro.message)
    }
  }
  useEffect(() => {
    console.log("Debugging")
    // Only check isAccountVerified if userData is not null or undefined
    if (userData?.isAccountVerified) {
      navigate('/');
    }
  }, [userData]);
  
  return (
    <div className="flex items-center justify-center  min-h-screen
    bg-gradient-to-br from-blue-200 to-purple-400">
       <img
              onClick={() => navigate("/")}
              className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
              src={assets.logo}
              alt=""
            />
      <form onSubmit = {onSubmitHandler} className=' bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
      <h1 className='text-white text-2xl font-semibold text-center mb-4'>Email Verify OTP</h1>
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
            <button className=' w-full py-3 bg-gradient-to-r from-indigo-500 to bg-indigo-900 rounded-full text-white cursor-pointer'>Verify Email</button>
          </div>

      </form>
     

    </div>
  )
}

export default EmailVerify
