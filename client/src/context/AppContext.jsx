import axios from "axios";
import { createContext, useState } from "react";
import { data } from "react-router-dom";
import { toast } from "react-toastify";
 export const AppContext = createContext();

export const AppContextProvider = (props) => {
    console.log("AppContext")
    const backendurl = import.meta.env.VITE_BACKEND_URL
    const [isLoggedin, setIsloggedin] = useState(false);
    const [userData, setUserData] = useState(null);
    const get_user_data = async()=>{
        try{
            const {data} = await axios.get(backendurl + '/user/data')
            console.log(data)
            data.success? setUserData(data.user_data): toast.error(data.message)
        }
        catch(error){
            toast.error(error.message)
        }
    }
    const value ={
        backendurl, 
        isLoggedin, setIsloggedin,
        userData, setUserData,
        get_user_data
      }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};




 
  