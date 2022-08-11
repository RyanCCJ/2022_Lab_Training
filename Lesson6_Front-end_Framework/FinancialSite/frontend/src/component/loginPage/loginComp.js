import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { rootApiIP } from '../../constant'
axios.defaults.withCredentials = true;

function LoginComp() {
    const nav = useNavigate()
    const [userName, setUsername] = useState("");
    const [password, setPassword] = useState("");

    function login(){
        axios.post(rootApiIP + "/user/login", {
            userName : userName,
            password : password
        }).then(res => {
            alert("Log in")
            nav("/home");
        }).catch(err => {
            alert("Username or password error")
        });
    };

    function submit(e){
        e.preventDefault()

        login();
    }

    return (
        <div className = 'container-fluid h-100 d-flex flex-column justify-content-center' >
            <div className = "row justify-content-center">
                <div className = "col-sm-4 p-3" style = {{ border : "3px solid black", borderRadius: "10px" }}>
                    <form className = "row g-3 needs-validation" onSubmit = { submit } noValidate>
                        <div className = "form-row">
                            <h2 className = "text-center display-4 mt-2">Welcome</h2>
                        </div>

                        <div className = "form-row px-4">
                            <div className = "form-group">
                                <label htmlFor = "account">Username</label>
                                <input type = "text" className = "form-control" id = "account" onChange = { event => setUsername(event.target.value) } required/>
                            </div>
                        </div>

                        <div className = "form-row px-4">
                            <div className = "form-group">
                                <label htmlFor = "password">Password</label>
                                <input type = "password" className = "form-control" id = "password" onChange = { event => setPassword(event.target.value) }/>
                            </div>
                        </div>

                        <div className = 'form-row px-4'>
                            <hr style = {{ color : "black" }}/>
                        </div>

                        <div className = 'd-grid px-4'>
                            <button type = "submit" className = "btn btn-primary">Login</button>
                        </div>

                        <div className = 'd-grid px-4'>
                            <p className = "text-center" style = {{ color : "red" }}>Don't have an account? <a href = '/register'>Register</a></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginComp;