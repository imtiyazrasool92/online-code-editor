import React, { useEffect,useState } from "react";
import Styles from '../styles/studentList.module.css'
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {doc, getDoc ,collection,getDocs, setDoc, updateDoc, arrayUnion, snapshotEqual} from 'firebase/firestore';
import {db} from './firebaseconfig'

const StudentList = ()=>{
    const {uniqueId} = useParams();
    const navigate = useNavigate();

    const [list,setList] = useState({})

    const removeStudent = async (id)=>{
        const ref = doc(db,'classes',uniqueId)
        const snapShot = await getDoc(ref);
        const data = snapShot.data().joined_students
        let newData = {}
        
        for(const key in data)
        if(key != id)
        newData[key] = data[key]
    
        setList(newData)

        updateDoc(ref,{
            joined_students : newData
        })

    }

    useEffect(()=>{
        if(!localStorage.getItem('email'))
            navigate('/form')

        const check = async ()=>{
            const docRef = doc(db,'classes',uniqueId)
            const snapShot = await getDoc(docRef)
            if(!snapShot.exists())
                navigate('/teacher')
            if(snapShot.data().teacher_id != localStorage.getItem('email'))
                navigate('/teacher')
        }
        check()

        const fetch = async ()=>{
            const docRef = doc(db,'classes',uniqueId)
            const snapShot = await getDoc(docRef)
            setList(snapShot.data().joined_students)
        }

        fetch();
    },[])

    return (
        <>
        <div className={Styles.back}>
            <div className={Styles.top_panel}>
            <div className={Styles.header}> <Link to="/teacher">Teacher</Link> {'>'} Student List</div>
            </div>

            {
                Object.keys(list).map((key)=>(
                    <div className={Styles.list_object}>
                    <span>Student Name : {list[key]}</span>
                    <span style={{cursor:'pointer'}} onClick={()=>{removeStudent(key)}}>Remove</span>
                    </div>
                ))
            }

        </div>
        </>
    )
}

export default StudentList