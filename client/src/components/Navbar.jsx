import React, { useContext } from "react";
import { assets } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";
import { toast } from "react-toastify";
import axios from "axios";

const Navbar = () => { 
  console.log("Navbar")

    const navigate = useNavigate() 
    const {userData, backendurl, setUserData, setIsloggedin} =useContext(AppContext)
    const sendverificationotp = async()=>{
        try{
          axios.defaults.withCredentials= true;
          const {data} = await axios.post(backendurl + '/auth/send-verify_otp')
          if(data.success){
            navigate('/email-verify')
            toast.success(data.message)
          }
          else{
            toast.error(data.message)
          }
        }catch{
          toast.error(error.message)
        }
    }
    const logout = async()=>{
      try{
          const {data} = await axios.post(backendurl + '/auth/logout')
          data.success && setIsloggedin(false)
          data.success && setUserData(null)
          navigate('/')
      }catch(error){
        toast.error(error.message)
      }
    }
  return (
    <div
      className="w-full flex justify-between items-center p-4 sm:p-6
    sm:px-24  absolute top-0"
    >
      <img src={assets.logo} alt="" className="w-28 sm:w-32" />
      {userData? 
      <div
      className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group">
        {userData.name[0].toUpperCase()}
        <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
          <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
            {!userData.isAccountVerified &&  <li onClick={sendverificationotp} className="py-1 px-2 hover: bg-gray-200 cursor-pointer">Verify email</li>}
            <li onClick = {logout} className="py-1 px-2 hover: bg-gray-200 cursor-pointer pr-10">Logout</li>
          </ul>
        </div>
      </div>:
       <button onClick={function() { navigate('/login'); }}
        className=" cursor-pointer flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100
      transition-all"
      >
        Login <img src={assets.arrow_icon} alt="" />
      </button>}
    </div>
  );
};

export default Navbar;
