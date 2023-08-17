import { react,useState,useEffect,useRef } from 'react'
import Styles from '../styles/codeeditor.module.css'
import { useNavigate, useParams } from 'react-router-dom';
import {io} from 'socket.io-client'
import {doc, getDoc ,collection,getDocs, setDoc, updateDoc, arrayUnion, snapshotEqual} from 'firebase/firestore';
import {db} from './firebaseconfig'
import axios from 'axios';

import 'brace';
import 'brace/theme/monokai';
import 'brace/mode/javascript';
import 'brace/mode/c_cpp';
import 'brace/mode/java';
import 'brace/mode/python';


const CodeEditorStudent = ()=>{

    const navigate = useNavigate();
    const {roomId} = useParams();
    const [input,setInput] = useState('')
    const [mode,setMode] = useState('c')
    const editorRef = useRef(null);
    
    const socket = io('http://192.168.29.244:2000')
    socket.on("connect",()=>{
        document.getElementById("display").style.display = "block"
        document.getElementById("loading").style.display = "none"

        const ace = window.ace;
        const editor = ace.edit(editorRef.current);

        socket.emit("join",roomId)
        socket.on("take_code",(code)=>{
            editor.getSession().setValue(code)
        })

        socket.on("take_input",(value)=>{
            setInput(value)
        })

        socket.on("take_language",(value)=>{
            setMode(value)
        })
    })
    
    useEffect(() => {
        const isClass = async ()=>{
            const ref = doc(db,'classes',roomId)
            const snap = await getDoc(ref);
            const data = snap.data()
            if(!data.isLive)
                navigate('/student')
        }

        isClass();

        if (editorRef.current) {
            const ace = window.ace;
            const editor = ace.edit(editorRef.current);
            editor.getSession().setMode('ace/mode/c_cpp');
            editor.setTheme('ace/theme/textmate');
            editor.setReadOnly(true)
        }

    }, []);

    return (
        <>
        <div className={Styles.loading} id="loading">Loading</div>
        <div style={{display:"none"}} id="display">
            <div className={Styles.top}>
                <select className={Styles.option} value={mode} readOnly>
                    <option value="c">C</option>
                    <option value="cpp">C++</option>
                    <option value="python">Python</option>
                    <option value="javascript">Javascript</option>
                    <option value="java">Java</option>
                </select>
                <span className={Styles.btn} disabled>Run</span>
            </div>

            <div className={Styles.main}>
            
            <div ref={editorRef} style={{ width: '50%', height: '750px' }} />
            <textarea readOnly={true} style={{width : "50%"}} value={input}  placeholder="Input here">
            </textarea>
            </div>
        </div>
        </>
    )
}

export default CodeEditorStudent;