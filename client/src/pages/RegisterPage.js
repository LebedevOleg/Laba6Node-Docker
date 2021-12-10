import React, { useState, useEffect, useCallback } from "react";
import stl from './RegisterPage.module.css' 
import axios from 'axios'

export const RegisterPage = () => {
    const [form, setForm] = useState({
       login: "",password: "", email: ""  
    })

   
    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value})
    }

    const registerHandler = async () =>{
        const message = "" 
        try{                                      
           axios.post('/api/register', { ...form})
           .then(res => {
            if (window.M) {
                window.M.toast({ html: res.data.message })
            }
           })
           .catch((error) => {
            if (error.response){
                if (window.M) {                    
                    if(!error.response.data.msg){
                        window.M.toast({ html: error.response.data.message })
                    }
                    else {
                        window.M.toast({ html: error.response.data.msg.errors[0].msg })
                    }
                    
                }
                }else if(error.request){
                if (window.M) {
                    window.M.toast({ html: error.response.data.message })
                }
                }
            
        })
        }
        catch(e){    

            message = e.message       
            console.log(message)
        } 
    }

    return (
        <div id={stl.login} >                
         <h1>Форма регистрации</h1>           
            <fieldset id={stl.inputs}>
                <input id="email" name="email" type="email" placeholder="Электронная почта" autoFocus = 'true'  onChange={changeHandler} required/>   
                <input id={stl.username} name="login" type="text" placeholder="Логин" onChange={changeHandler} required/>   
                <input id={stl.password} name="password" type="password" placeholder="Пароль" onChange={changeHandler} required/>
            </fieldset>
            <fieldset id={stl.actions} >
                <input type="submit" id={stl.submit} value="Зарегистрироваться"  onClick={registerHandler}/>
                <a href="/login">ВОЙТИ</a>
            </fieldset>
        </div>
    )
}