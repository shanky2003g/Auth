import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast  } from "react-toastify";

const Login = () => {
  console.log("Login Component")
  const [state, setstate] = useState("Sign Up");
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const navigate = useNavigate();
  const {backendurl, setIsloggedin, get_user_data} = useContext(AppContext)

  const on_submit_handler = async (e) => {
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true
  
      let response;
  
      if (state === 'Sign Up') {
        response = await axios.post(backendurl + '/auth/register', {
          name, email, password,
        });
      } else {
        response = await axios.post(backendurl + '/auth/login', {
          email, password,
        });
      }
  
      if (response.data.success) {
        setIsloggedin(true);
        get_user_data()
        navigate('/');
      } else {
        toast.error(response.data.message || "An error occurred");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        // Backend error
        toast.error(error.response.data.message || "Something went wrong");
      } else {
        // Axios or network error 
        toast.error(error.message || "Network or request error");
      }
    }
  };
  

  

  return (
    <div
      className="flex items-center justify-center  min-h-screen px-6 sm:px-0
    bg-gradient-to-br from-blue-200 to-purple-400"
    >
      <img
        onClick={() => navigate("/")}
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
        src={assets.logo}
        alt=""
      />
      <div
        className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 
      text-indigo-300 text-sm"
      >
        <h2 className="text-3xl font-semibold text-white text-center mb-3 ">
          {state == "Sign Up" ? "Create Account" : "Login"}
        </h2>
        <p className="text-center text-sm mb-6">
          {state == "Sign Up"
            ? "Create your Account"
            : "Login to your account!"}
        </p>
 
        <form onSubmit={on_submit_handler}>
          {state === "Sign Up" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.person_icon} alt="Person Icon" />
              <input onChange={(e) => setname(e.target.value)}
              value={name}
                className="bg-transparent outline-none"
                type="text"
                placeholder="Full Name"
                required
              />
            </div>
          )}
          <div
            className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 
          rounded-full bg-[#333A5C]"
          >
            <img src={assets.mail_icon} alt="" />
            <input onChange={(e) => setemail(e.target.value)}
            value={email}
              className="bg-transparent outline-none"
              type="email "
              placeholder="Email Id"
              required
            />
          </div>
          <div
            className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 
          rounded-full bg-[#333A5C]"
          >
            <img src={assets.lock_icon} alt="" />
            <input onChange={(e) => setpassword(e.target.value)}
            value={password}
              className="bg-transparent outline-none"
              type="password"
              placeholder="Passsword"
              required
            />
          </div>
          <p
            onClick={() => navigate("/reset-password")}
            className="cursor-pointer mb-4 text-indigo-500"
          >
            Forgot Password?
          </p>
          <button
            className="w-full rounded-full py-2.5 
          text-white font-medium bg-gradient-to-r from-indigo-500 to-indigo-900"
          >
            {state}
          </button>
        </form>
        {state == "Sign Up" ? (
          <p className="text-gray-400 text-center text-xs mt-4">
            Already have an account?{" "}
            <span
              onClick={() => setstate("Login")}
              className="text-blue-400 cursor-pointer underline"
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="text-gray-400 text-center text-xs mt-4">
            Don't have an account?{" "}
            <span
              onClick={() => setstate("Sign Up")}
              className="text-blue-400 cursor-pointer underline"
            >
              Sign up here
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
