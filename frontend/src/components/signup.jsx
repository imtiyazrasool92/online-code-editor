import {React,useState,useEffect} from 'react'
import Styles from '../styles/signup.module.css'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { collection, getDoc,doc,addDoc,setDoc } from 'firebase/firestore';
import {auth,db} from './firebaseconfig'
import { Navigate, useNavigate } from 'react-router-dom';

class CustomError extends Error {
    constructor(message) {
      super(message);
      this.name = 'CustomError';
    }
  }
  

const Signup = ()=>{

    const navigate = useNavigate();
    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [confirmPassword,setConfirmPassowrd] = useState('')
    const [error,setError] = useState('');

    const signup = async ()=>{

        try {
            if(confirmPassword != password)
                throw new CustomError("Password Doesn't Match")

            setEmail(email.toLowerCase());
            await createUserWithEmailAndPassword(auth,email,password)
            
            localStorage.setItem('email',email)
            localStorage.setItem('name',name)

            const ref = doc(db,'user_information','list')
            const snapShot = await getDoc(ref)

            const data = {...snapShot.data()}
            data[email] = name

            await setDoc(ref,data)

            navigate('/selection')
        }catch(err){
            setError(err.message)
        }
    }
    
    return (
        <div className={Styles.component}>
            <div className={Styles.row}>
                <input type="text" onChange={(event)=>{setName(event.target.value)}} className={Styles.input} value={name} placeholder='Full Name' onKeyDown={(event)=>{
                    if(event.key == "Enter")
                        document.getElementById('email').focus()
                }}/>
            </div>

            <div className={Styles.row}>
                <input type="email" onChange={(event)=>{setEmail(event.target.value)}} className={Styles.input} value={email} placeholder='Email' id="email" onKeyDown={(event)=>{
                    if(event.key == "Enter")
                        document.getElementById('password').focus()
                }}/>
            </div>

            <div className={Styles.row}>
                <input type="password" onChange={(event)=>{setPassword(event.target.value)}} className={Styles.input} value={password} placeholder='Password' id="password" onKeyDown={(event)=>{
                    if(event.key == "Enter")
                        document.getElementById('confirm_password').focus()
                }}/>
            </div>

            <div className={Styles.row}>
                <input type="password" onChange={(event)=>{setConfirmPassowrd(event.target.value)}} className={Styles.input} value={confirmPassword} placeholder='Confirm Password' id="confirm_password" onKeyDown={(event)=>{
                    if(event.key == "Enter")
                        signup()
                }}/>
            </div>
            
            <p className={Styles.error}>{error}</p>
            <span className={Styles.btn} onClick={()=>{signup()}}>Sign Up</span>
        </div>
    )
}

export default Signup