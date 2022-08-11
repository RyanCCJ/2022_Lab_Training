import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from "axios";

function LoginRoute() {
    const [isAuth, setIsAuth] = useState()

    useEffect(() => {
        async function state(){
            axios.get("http://140.116.214.154:3000/api/data/isAuth")
            .then(res => {
                setIsAuth(true)
            }).catch(res => {
                setIsAuth(false)
            })
        }
        
        state()
    }, [])

    if (isAuth === undefined) return null

    return isAuth ? <Navigate to = "/home" /> : <Outlet />;
}

export default LoginRoute;