import React, { useContext } from 'react'
import AuthContext from "../Context/AuthContext";
import { useHistory } from "react-router-dom";

export default function Header() {

    const { loggedIn } = useContext(AuthContext);
    const history = useHistory();
    
    const logOut = () =>{
        localStorage.setItem("auth-token", "");

        history.push("/")
    }
    return (
        <div className="flex flex-col">
            {/* <div className="flex justify-center">
                <img className="mt-8 w-72 " src={Photo} alt="" />
            </div> */}

            <div className="flex justify-center text-sm w-screen sm:w-auto sm:text-lg font-bold   mt-12  ">
                {loggedIn === false && (
                    <>

                        <div className='sidebarNav'><a href="/login" >Login</a></div>
                        <div className='sidebarNav'><a href="/register" className="ml-12">Register</a></div>
                    </>
                )}
                {loggedIn === true && (
                    <>

                        <div className='sidebarNav'><a href="/events" className="">Events</a></div>
                        <div className='sidebarNav'><a href="/myevents" className="ml-6">My Events</a></div>
                        <div className='sidebarNav'><a href="/" className="ml-6" onClick={()=>logOut()}>Log Out</a></div>
                    </>
                )}


            </div>
        </div>
    )
}
