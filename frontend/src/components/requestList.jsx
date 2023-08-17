import React, { useEffect,useState } from "react";
import Styles from '../styles/studentList.module.css'
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {doc, getDoc ,collection,getDocs, setDoc, updateDoc, arrayUnion, snapshotEqual} from 'firebase/firestore';
import {db} from './firebaseconfig'

const RequestList = ()=>{
    const {uniqueId} = useParams();
    const navigate = useNavigate();

    const [list,setList] = useState({})

    const accept = async (id)=>{
        const docRef = doc(db,'classes',uniqueId)
        const snapShot = await getDoc(docRef)

        const joined_list = snapShot.data().joined_students
        joined_list[id] = list[id]

        updateDoc(docRef,{
            joined_students : joined_list
        })

        const dataList = snapShot.data().request_students   
        const newDataList = {}
        
        for(const key in dataList)
            if(key != id)
                newDataList[key] = dataList[key]

        setList(newDataList)
        updateDoc(docRef,{
            request_students : newDataList
        })

    }

    const decline = async (id)=>{
        const docRef = doc(db,'classes',uniqueId)
        const snapShot = await getDoc(docRef)

        const dataList = snapShot.data().request_students   
        const newDataList = {}
        
        for(const key in dataList)
            if(key != id)
                newDataList[key] = dataList[key]

        setList(newDataList)
        updateDoc(docRef,{
            request_students : newDataList
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
            setList(snapShot.data().request_students)
        }

        fetch();
    },[])

    return (
        <>
        <div className={Styles.back}>
            <div className={Styles.top_panel}>
            <div className={Styles.header}> <Link to="/teacher">Teacher</Link> {'>'} Request List</div>
            </div>

            {
                Object.keys(list).map((key)=>(
                    <div className={Styles.list_object}>
                    <span>Student Name : {list[key]}</span>
                    <span onClick={()=>{accept(key)}}>Accept</span>
                    <span onClick={()=>{decline(key)}}>Decline</span>
                    </div>
                ))
            }

        </div>
        </>
    )
}

export default RequestList