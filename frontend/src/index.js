import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import Home from './components/home'
import Form from './components/form'
import Teacher from './components/teacher'
import Student from './components/student'
import Selection from './components/selection';
import CodeEditor from './components/codeeditor';
import StudentList from './components/studentList';
import Styles from './styles/index.module.css'
import RequestList from './components/requestList';
import CodeEditorTeacher from './components/codeeditorTeacher';
import CodeEditorStudent from './components/codeeditorStudent';
import { BrowserRouter,Routes,Route } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));

const Main = ()=>{
  
  return (
    <BrowserRouter>
      <div className={Styles.center}>
          <span className={Styles.logo}>Online Code Editor</span>
      </div>
      
      <Routes>
          <Route path='/' element={<div style={{position:'fixed',left:"50%",top:"50%",transform : "translate(-50%,-50%)"}}><Home/></div>}/>
          <Route path='/form' element={<div style={{position:'fixed',left:"50%",top:"50%",transform : "translate(-50%,-50%)"}}><Form/></div>}/>
          <Route path='/teacher' element={<Teacher/>}/>
          <Route path='/student' element={<Student/>}/>
          <Route path='/selection' element={<div style={{position:'fixed',left:"50%",top:"50%",transform : "translate(-50%,-50%)"}}><Selection/></div>}/>
          <Route path='/code_editor' element={<CodeEditor/>}/>
          <Route path='/teacher/student_list/:uniqueId' element={<StudentList/>}/>
          <Route path='/teacher/request_list/:uniqueId' element={<RequestList/>}/>
          <Route path='/code_editor_student/:roomId' element={<CodeEditorStudent/>}/>
          <Route path='/code_editor_teacher/:classID' element={<CodeEditorTeacher/>}/>

      </Routes>

    </BrowserRouter>
  )
}

root.render(
  <Main/>
);