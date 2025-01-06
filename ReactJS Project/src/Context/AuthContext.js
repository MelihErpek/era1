import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

const Auth = createContext();

function AuthContextProvider(props) {
  
  const [loggedIn, setLoggedIn] = useState(undefined);
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,  
    
  });
  let token = localStorage.getItem("auth-token");
  async function getLoggedIn() {
    
    const loggedInRes = await axios.post("https://sqlite-gold.vercel.app/loggedIn",null,
    { headers: { "x-auth-token": token } });
    
    
    setLoggedIn(loggedInRes.data);
    if (loggedInRes.data) {

      const userRes = await axios.get("https://sqlite-gold.vercel.app/log", {
        headers: { "x-auth-token": token },
      });
      setUserData({
        token,
        user: userRes.data,
      });
    }
  }

  useEffect(() => {
    getLoggedIn();
    
  }, []);

  return (
    <Auth.Provider value={{ userData,setUserData,loggedIn, getLoggedIn,setLoggedIn }}>
      {props.children}
    </Auth.Provider>
  );
}

export default Auth;
export { AuthContextProvider };