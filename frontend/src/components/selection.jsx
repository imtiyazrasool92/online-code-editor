import react, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Styles from '../styles/selection.module.css'


const Selection = ()=>{
    const navigate = useNavigate();

    useEffect(()=>{
        if(!localStorage.getItem("email"))
            navigate('/form')
    })

    const logout = ()=>{
        localStorage.clear('email')
        localStorage.clear('name')
        navigate('/form')
    }

    return (
        <>
        <div className={Styles.back}>
            <div className={Styles.btn}>
                <Link to="/teacher">I am Teacher</Link>
            </div>
            <div className={Styles.btn}>
                <Link to="/student">I am Student</Link>
            </div>
            <div className={Styles.btn}>
                <span style={{cursor:"pointer"}} onClick={()=>{logout()}}>Logout</span>
            </div>
        </div>
        </>
    )
}

export default Selection;