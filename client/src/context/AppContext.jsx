import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { data } from "react-router-dom";
import { toast } from "react-toastify";
 export const AppContext = createContext();

export const AppContextProvider = (props) => { 
    console.log("AppContext")
    const backendurl = import.meta.env.VITE_BACKEND_URL
    const [isLoggedin, setIsloggedin] = useState(false);
    const [userData, setUserData] = useState(null);
    console.log(isLoggedin)
    console.log(userData)
    const get_user_data = async()=>{
        try{
            console.log("Getting User Data")
            const {data} = await axios.get(backendurl + '/user/data')
            console.log("Hi")
            console.log(data)
            data.success? setUserData(data.user_data): toast.error(data.message)
        }
        catch(error){
            toast.error(error.message)
        }
    }
    const get_auth_state = async()=>{
        axios.defaults.withCredentials = true
        console.log("Use effect here")
        try{
            const {data} = await axios.get(backendurl + '/auth/isauthenticated')
            if(data.success){
                setIsloggedin(true)
                get_user_data()
            }else{
                toast.error(data.message)
            }
        }catch(error){
            toast.error(error.message)
        }
    }
    const value ={
        backendurl, 
        isLoggedin, setIsloggedin,
        userData, setUserData,
        get_user_data
      }
      useEffect(()=>{
        get_auth_state()
      }, [])
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};




 
  