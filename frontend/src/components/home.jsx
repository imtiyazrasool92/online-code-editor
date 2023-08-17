import React from 'react'
import Styles from '../styles/home.module.css'
import { Link } from 'react-router-dom'

const Home = ()=>{
    return (
        <>
            <div className={Styles.back}>
                <div className={Styles.btn}>
                    <Link to="/form">Login or Sign Up</Link>
                </div>
                <div className={Styles.btn}>
                    <Link to ="/code_editor" >Use without Login</Link>
                </div>
            </div>
        </>
    )
}

export default Home