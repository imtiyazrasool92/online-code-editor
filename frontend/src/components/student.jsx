import {React,useEffect,useState} from 'react'
import Styles from '../styles/student.module.css'
import {db} from './firebaseconfig'
import {doc, getDoc ,collection,getDocs, setDoc, updateDoc, arrayUnion, snapshotEqual} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Student = ()=>{
    const navigate = useNavigate()

    const [classid,setClassid] = useState('')
    const [classList,setClassList] = useState([])
    const [error,setError] = useState('');

    const exitClass = async (id,joined)=>{
        let newList = classList.filter(data => data.id !== id)
        setClassList(newList)

        let ref = doc(db,'classes',id)
        let result = await getDoc(ref)
        let previous_data = (joined ? result.data().joined_students : result.data().request_students)
        
        let newData = {}
        for(const key in previous_data)
            if(key != localStorage.getItem('email'))
                newData[key] = previous_data[key]
    
        if(joined)
            updateDoc(ref,{joined_students : newData})
        else
            updateDoc(ref,{request_students : newData})
    }
    
    const filteredList = classList.map((data,index)=>{
                return (
                    <div className={Styles.list_object} key={index}>
                        <span>Class : {data.className}</span>
                        <span>Teacher : {data.teacher_name}</span>
                        <span>{data.joined ? "Request Accepted" : "Pending Request"}</span>
                        <span>{data.isLive ? <Link to={`/code_editor_student/${data.id}`}>Live</Link> : "Offline"}</span>
                        <span style={{cursor:'pointer'}} onClick={()=>{exitClass(data.id,data.joined)}}>Exit Class</span>
                    </div>
                )
        })

    const handleJoin = async ()=>{
        const ref = doc(db,'classes',classid)
        const snapShot = await getDoc(ref);

        if(!snapShot.exists()){
            setError("class doesn't exists")
            return;
        }

        const data = snapShot.data();

        if(data.request_students[localStorage.getItem('email')] || data.joined_students[localStorage.getItem('email')]){
            setError('Class already joined')
            return;
        }

        const currentList = data.request_students
        const newList = {
            ...currentList,
        }

        newList[localStorage.getItem('email')] = localStorage.getItem('name')
        updateDoc(ref,{
            request_students : newList
        })

        let addData = {
            className: data.className,
            teacher_name: data.teacher_name,
            isLive: data.isLive,
            joined: false,
            id : data.id
        }

        setClassList([...classList,addData])
    }

    const logout = ()=>{
        localStorage.clear('email')
        localStorage.clear('name')
        navigate('/form')
    }

    useEffect(()=>{
        if(!localStorage.getItem("email")){
            navigate('/form')
        }else {

            const fetch = async ()=>{
                const ref = collection(db,'classes')
                const classes = await getDocs(ref);

                let newList = []
                classes.docs.forEach((std) => {
                    const arr = std.data().joined_students;
                    const arr2 = std.data().request_students;

                    if (arr[localStorage.getItem('email')]) {
                        let data = {
                            className: std.data().className,
                            teacher_name: std.data().teacher_name,
                            isLive: std.data().isLive,
                            joined: true,
                            id : std.id
                        };
                        newList.push(data);
                    } else if (arr2[localStorage.getItem('email')]) {
                        let data = {
                            className: std.data().className,
                            teacher_name: std.data().teacher_name,
                            isLive: std.data().isLive,
                            joined: false,
                            id : std.id
                        };
                        newList.push(data);
                    }
                })

                console.log(newList)
                setClassList(newList)
            }

            fetch();
        }
    },[])

    return (
        <>
            
            <span onClick={()=>{logout()}} style={{backgroundColor : 'white',color:"black",padding:'5px',borderRadius:'5px',float:'right',cursor:'pointer',margin:'10px'}}>Logout</span>

            <div className={Styles.back}>

            <div className={Styles.top_panel}>
                <div className={Styles.header}>Student Panel</div>
                    <div>
                        <span style={{color : "red",margin : '5px'}}>{error}</span>
                        
                        <input type="text" value={classid} placeholder="Enter Class ID" onChange={(event)=>{
                            setClassid(event.target.value)
                        }}/>
                        
                        <button onClick={()=>{handleJoin()}}>Join</button>
                    </div>
                </div>
                {filteredList}

            </div>
            
        </>
    )
}

export default Student