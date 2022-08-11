import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { rootApiIP } from '../../constant'
axios.defaults.withCredentials = true;

function RegisterComp() {
    const nav = useNavigate()
    const [name, setName] = useState("");
    const [userName, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, set_confirmPassword] = useState("");

    const [emailError, setemailError] = useState(false);
    const [passwordError, setpasswordError] = useState(false);
    const [confirmpasswordError, setconfirmpasswordError] = useState(false);

    function register(){
        axios.post(rootApiIP + "/user/register", {
            name : name,
            userName : userName,
            email : email,
            password : password
        }).then(res => {
            alert("Register successfully")// eslint-disable-next-line
            nav("/login");
        }).catch(err => {
            alert("error")// eslint-disable-next-line
        });
    };

    useEffect(() => {
        function checkEmailFormat(email){
            var pattern = new RegExp(/^([A-Za-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{3,6})$/);//eslint-disable-line
    
            if(pattern.test(email)){
                setemailError(false)
            }else{
                if(email !== "") setemailError(true)
                else setemailError(false)
            };
        };

        function checkpassword(x){
            var pattern = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,15}$/);//eslint-disable-line
    
            if(pattern.test(x)){
                if(password !== confirmPassword){
                    setconfirmpasswordError(true)
                }else{
                    setconfirmpasswordError(false)
                };
                setpasswordError(false)
            }else{
                if(password !== "") setpasswordError(true)
                else setpasswordError(false)
            };
        };

        function checkConfirmpassword(y){
            if(confirmPassword !== password){
                setconfirmpasswordError(true)
            }else{
                setconfirmpasswordError(false)
            };
        };

        function checkButton(){
            if(emailError === false && passwordError === false && confirmpasswordError === false && name !== "" && userName !== "" && email !== "" && password !== "" && confirmPassword !== ""){
                document.getElementById("registerButton").disabled = false
            }else{
                document.getElementById("registerButton").disabled = true
            }
        };

        checkEmailFormat(email);
        checkpassword(password);
        checkConfirmpassword(confirmPassword);
        checkButton();
    })

    function submit(e){
        e.preventDefault()

        register();
    }

    return (
        <div className = 'container-fluid h-100 d-flex flex-column justify-content-center' >
            <div className = "row justify-content-center">
                <div className = "col-sm-5 p-3" style = {{ border : "3px solid black", borderRadius: "10px" }}>
                    <form className = "row g-3 needs-validation" onSubmit = { submit } noValidate>
                        <div className = "form-row">
                            <h2 className = "text-center display-4 mt-2">Register</h2>
                        </div>

                        <div className = "form-row px-4">
                            <p style = {{ color : "red" }}>* is required</p>
                            <div className = "form-group">
                                <label htmlFor = "name">Name <span style = {{ color : "red" }}>*</span></label>
                                <input type = "text" className = "form-control" id = "name" onChange = { event => setName(event.target.value) } required/>
                                <div className = "form-text">Length cannot over 20</div>
                            </div>
                        </div>

                        <div className = "form-row px-4">
                            <div className = "form-group">
                                <label htmlFor = "account">Username <span style = {{ color : "red" }}>*</span></label>
                                <input type = "text" className = "form-control" id = "account" onChange = { event => setUsername(event.target.value) } required/>
                                <div className = "form-text">Length cannot over 20</div>
                            </div>
                        </div>

                        <div className = "form-row px-4">
                            <div className = "form-group">
                                <label htmlFor = "email">Email <span style = {{ color : "red" }}>*</span></label>
                                <input type = "text" className = "form-control" id = "email" onChange = { event => setEmail(event.target.value) } required/>
                                { emailError ? <div className = "item"> <p style = {{ color : "red" }}>Email format error</p> </div> : <div></div> }
                            </div>
                        </div>

                        <div className = "form-row px-4">
                            <div className = "form-group">
                                <label htmlFor = "password">Password <span style = {{ color : "red" }}>*</span></label>
                                <input type = "password" className = "form-control" id = "password" onChange = { event => setPassword(event.target.value) }/>
                                <div className = "form-text">Password length must not be less than 6, and over 15</div>
                                <div className = "form-text">Password must contain an Uppper case, and a Lower case</div>
                                { passwordError ? <div className = "item"> <p style = {{ color : "red" }}>Password format error</p> </div> : <div></div> }
                            </div>
                        </div>

                        <div className = "form-row px-4">
                            <div className = "form-group">
                                <label htmlFor = "confirmPassword">Confirm Password <span style = {{ color : "red" }}>*</span></label>
                                <input type = "password" className = "form-control" id = "confirmPassword" onChange = { event => set_confirmPassword(event.target.value) }/>
                                { confirmpasswordError ? <div className = "item"> <p style = {{ color : "red" }}>Confirm password doesn't match</p> </div> : <div></div> }
                            </div>
                        </div>

                        <div className = "d-grid px-4">
                            <button id = "registerButton" type = "submit" className = "btn btn-primary" disabled>Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default RegisterComp;