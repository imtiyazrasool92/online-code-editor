import react, { useEffect, useState } from 'react'
import Styles from '../styles/teacher.module.css'
import {db} from './firebaseconfig'
import { Link, useNavigate } from 'react-router-dom'
import { collection,getDocs,addDoc,doc, updateDoc, deleteDoc } from 'firebase/firestore'

const Teacher = ()=>{

    const [classname,setClassname] = useState('')
    const [classList,setClassList] = useState([])
    const [error,setError] = useState('');
    const navigate = useNavigate()


    const removeClass = async (id)=>{
        let newList = classList.filter((data)=>{
            return data.uniqueId != id
        })

        setClassList(newList)

        const ref = doc(db,'classes',id)
        await deleteDoc(ref)
    }

    const logout = ()=>{
        localStorage.clear('email')
        localStorage.clear('name')
        navigate('/form')
    }

    const filteredList = classList.map((data,index)=>{
        return (
            <div className={Styles.list_object} key={index}>
                <span>Class : {data.className}</span>
                <span>Class ID : {data.uniqueId}</span>
                <span><Link style={{color : "white"}} to={`request_list/${data.uniqueId}`}>Join Request</Link></span>
                <span><Link style={{color : "white"}} to={`student_list/${data.uniqueId}`}>Student List</Link></span>
                <span><Link style={{color : "white"}}  to={`/code_editor_teacher/${data.uniqueId}`}>Start Now</Link></span>
                <span style={{cursor : "pointer"}} onClick={()=>{removeClass(data.uniqueId)}}>Remove Class</span>
            </div>
        )
    })

    const createClass = async ()=>{
        let can_create = true;
        classList.forEach((data)=>{
            if(data.className == classname){
                can_create = false;
                return;
            }
        })

        if(!can_create){
            setError('class already exists')
            return;
        }

        setError('')

        const data = {
            className : classname,
            isLive : false,
            joined_students : {},
            request_students : {},
            roomId : '',
            teacher_id : localStorage.getItem('email'),
            teacher_name : localStorage.getItem('name')
        }
        
        const ref = collection(db,'classes')
        const id = await addDoc(ref,data)
        
        data["uniqueId"] = id.id

        setClassList([...classList,data])
    }

    useEffect(()=>{
        if(!localStorage.getItem("email")){
            navigate('/form')
        }else{

            const fetchData = async ()=>{
                const ref = collection(db,'classes')
                const snapShot = await getDocs(ref)
                const filteredItems = snapShot.docs.filter((data)=>{
                    if(data.data().teacher_id == localStorage.getItem('email'))
                        return true;
                })
                const readyItems = filteredItems.map((data)=>{
                    let newData = data.data();
                    newData.uniqueId = data.id
                    return newData;
                })
                setClassList(readyItems)
            }

            fetchData();
        }
    },[])

    return (
        <>
        
        <span onClick={()=>{logout()}} style={{backgroundColor : 'white',color:"black",padding:'5px',borderRadius:'5px',float:'right',cursor:'pointer',margin:'10px'}}>Logout</span>

        <div className={Styles.back}>

        <div className={Styles.top_panel}>
            <div className={Styles.header}>Teacher Panel</div>
                <div>
                    <span style={{color : "red",margin : '5px'}}>{error}</span>
                    
                    <input type="text" value={classname} placeholder="Enter Class Name" onChange={(event)=>{
                        setClassname(event.target.value)
                    }} onKeyDown={(key)=>{
                        if(key.key == "Enter")
                            createClass();
                    }}/>
                    
                    <button onClick={()=>{createClass()}}>Create Class</button>
                </div>
            </div>
            {filteredList}
        </div>

        </>
    )
}

export default Teacher