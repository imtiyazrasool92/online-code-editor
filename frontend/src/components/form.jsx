import {React,useEffect,useState} from 'react'
import Styles from '../styles/form.module.css'
import LoginScreen from './login'
import Signup from './signup'
import { Navigate, useNavigate } from 'react-router-dom'

const Form = ()=>{
    const [who,setWho] = useState(localStorage.getItem("current_page") ? localStorage.getItem("current_page") : "login_page")

    const navigate = useNavigate()

    useEffect(()=>{
        if(localStorage.getItem("email")){
            navigate('/selection')
        }
    })

    return (
        <>
        <div className={Styles.back}>
            <div className={Styles.nav}>
                <div className={who === "login_page" ? Styles.btn_active : Styles.btn} onClick={()=>{
                    localStorage.setItem("current_page","login_page")
                    setWho("login_page")
                }}> Login </div>

                <div className={who === "login_page" ? Styles.btn : Styles.btn_active} onClick={()=>{
                    localStorage.setItem("current_page","signup_page")
                    setWho("signup_page")
                }}> Sign Up </div>
            </div>

            {who == "login_page" ? <LoginScreen/> : <Signup/>}
        </div>
        </>
    )
}

export default Form