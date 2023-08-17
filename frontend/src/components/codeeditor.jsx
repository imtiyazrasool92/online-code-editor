import { react,useState,useEffect,useRef } from 'react'
import Styles from '../styles/codeeditor.module.css'

import 'brace';
import 'brace/theme/monokai';
import 'brace/mode/javascript';
import 'brace/mode/c_cpp';
import 'brace/mode/java';
import 'brace/mode/python';
import axios from 'axios';

const CodeEditor = ()=>{

    const [code,setCode] = useState('')
    const [input,setInput] = useState('')
    const [mode,setMode] = useState('c')
    const editorRef = useRef(null);

    const compile = async ()=>{
        setInput("compiling...")
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
        }catch(err){
            setInput(err.response.data.output);
        }
    }
    
    useEffect(() => {

        if (editorRef.current) {
        
            const ace = window.ace;
            const editor = ace.edit(editorRef.current);
            editor.getSession().setMode('ace/mode/c_cpp');
            editor.setTheme('ace/theme/textmate');

            editor.getSession().on('change',()=>{
                setCode(editor.getValue())
            })

        }

    }, []);

    return (
        <>
        <div className={Styles.top}>
            <select className={Styles.option} onChange={(event)=>{
                const ace = window.ace;
                const editor = ace.edit(editorRef.current);
                let mode = event.target.value
                
                if(mode[0] == 'c')
                    mode = 'c_cpp'

                editor.getSession().setMode('ace/mode/' + mode)
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
            setInput(event.target.value)
        }} placeholder="Input here">
        </textarea>

        </div>

        </>
    )
}

export default CodeEditor;