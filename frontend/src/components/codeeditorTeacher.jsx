import { react,useState,useEffect,useRef, useLayoutEffect } from 'react'
import Styles from '../styles/codeeditor.module.css'
import {io} from 'socket.io-client'
import {db} from './firebaseconfig'
import {doc, getDoc ,collection,getDocs, setDoc, updateDoc, arrayUnion, snapshotEqual} from 'firebase/firestore';
import axios from 'axios';

import 'brace';
import 'brace/theme/monokai';
import 'brace/mode/javascript';
import 'brace/mode/c_cpp';
import 'brace/mode/java';
import 'brace/mode/python';
import { useNavigate, useParams } from 'react-router-dom';


const CodeEditorTeacher = ()=>{
    const navigate = useNavigate();
    const {classID} = useParams();

    const [code,setCode] = useState('')
    const [input,setInput] = useState('')
    const [mode,setMode] = useState('c')
    const editorRef = useRef(null);

 
    const socket = io('http://192.168.29.244:2000')
    socket.on('connect',()=>{
        document.getElementById("display").style.display = "block"
        document.getElementById("loading").style.display = "none"
        
        const docRef = doc(db,'classes',classID)
        updateDoc(docRef,{
            roomId : socket.id,
            isLive : true
        })
    })

    const compile = async ()=>{
        setInput("compiling...")
        socket.emit("send_input","compiling...",classID)
        try{
            const response = await axios.post('http://192.168.29.244:1000/compile',{
            language : mode,
            code : code,
            input : input
            },{
                headers : {
                    'Content-Type': 'application/json'
                }
            })
            setInput(response.data.output)
            socket.emit("send_input",response.data.output,classID)
        }catch(err){
            setInput(err.response.data.output);
            socket.emit("send_input",err.response.data.output,classID)
        }
    }


    window.addEventListener('beforeunload',()=>{
        const docRef = doc(db,'classes',classID)
        updateDoc(docRef,{
            roomId : "",
            isLive : false
        })  
    })
    
    useEffect(() => {
        const isOwner = async ()=>{
            const ref = doc(db,'classes',classID)
            const snap = await getDoc(ref)
            
            if(!snap.exists()){
                navigate('/teacher')
            }else{
                const data = snap.data();
                if(data.teacher_id != localStorage.getItem('email'))
                    navigate('/teacher')
            }
        }
        isOwner();

        if (editorRef.current) {
        
            const ace = window.ace;
            const editor = ace.edit(editorRef.current);
            editor.getSession().setMode('ace/mode/c_cpp');
            editor.setTheme('ace/theme/textmate');

            editor.getSession().on('change',()=>{
                socket.emit("send_code",editor.getValue(),classID);
                setCode(editor.getValue())
            })

        }

        return ()=>{
            const docRef = doc(db,'classes',classID)
            updateDoc(docRef,{
                roomId : "",
                isLive : false
            })  
        }

    }, []);

    return (
        <>
        <div id="loading" className={Styles.loader}></div>

        <div id="display" style={{display:"none"}}>
            <div className={Styles.top}>
                <select className={Styles.option} onChange={(event)=>{
                    const ace = window.ace;
                    const editor = ace.edit(editorRef.current);
                    let mode = event.target.value
                    
                    if(mode[0] == 'c')
                        mode = 'c_cpp'

                    editor.getSession().setMode('ace/mode/' + mode)
                    socket.emit("send_language",event.target.value,classID)
                    setMode(event.target.value)
                }}>
                    <option value="c">C</option>
                    <option value="cpp">C++</option>
                    <option value="python">Python</option>
                    <option value="javascript">Javascript</option>
                    <option value="java">Java</option>
                </select>
                <span className={Styles.btn} onClick={()=>{
                    compile();
                }}>Run</span>
            </div>

            <div className={Styles.main}>
            
            <div ref={editorRef} style={{ width: '50%', height: '750px' }} />
            <textarea style={{width : "50%"}} value={input} onChange={(event)=>{
                socket.emit("send_input",event.target.value,classID)
                setInput(event.target.value)
            }} placeholder="Input here">
            </textarea>
            </div>
        </div>

        </>
    )
}

export default CodeEditorTeacher;