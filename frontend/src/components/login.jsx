import {useState,React} from 'react'
import Styles from '../styles/login.module.css'
import {signInWithEmailAndPassword} from "firebase/auth";
import { auth,db } from './firebaseconfig'
import { Navigate, useNavigate } from 'react-router-dom';
import { getDoc,doc } from 'firebase/firestore';

// setup in both forms, localStorage(name)

const LoginScreen = ()=>{
    const navigate = useNavigate()

    const [email,setEmail] = useState('')
    const [error,setError] = useState('')
    const [password,setPassword] = useState('')

    const handleLogin = async ()=>{
        try{
            setEmail(email.toLowerCase());
            await signInWithEmailAndPassword(auth,email, password);
            const ref = doc(db,'user_information','list')
            const data = await getDoc(ref)
            const name = (data.data())[email]

            localStorage.setItem('email',email)
            localStorage.setItem('name',name)
            navigate('/selection')
        }catch(err){
            setError(err.message)
        }
    }
    return (
        <div className={Styles.component}>

            <div className={Styles.row}>
                <input type="text" className={Styles.input} id="email" value={email} placeholder='Email' onChange={(event)=>{
                    setEmail(event.target.value)
                }} onKeyDown={(event)=>{
                    if(event.key == "Enter"){
                        document.getElementById('password').focus();      
                    }
                }} autoFocus/>
            </div>

            <div className={Styles.row}>
                <input type="password" className={Styles.input} id="password" value={password} placeholder='Password' onChange={(event)=>{
                    setPassword(event.target.value)
                }} onKeyDown={(event)=>{
                    if(event.key == "Enter")
                        handleLogin()
                }}/>
            </div>
                
            <p className={Styles.error}>{error}</p>

            <span className={Styles.btn} onClick={()=>{handleLogin()}}>Login</span>
        
        </div>
    )
}

export default LoginScreen