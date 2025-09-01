import React, { useEffect, useRef } from 'react';
import "./editor.css";
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/dracula.css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from '../Action';

const CodeEditor = ({socketRef, roomId,onCodeChange}) => {
  const editorRef = useRef(null); // ref for textarea
  const cmInstance = useRef(null); // ref for codemirror instance

  useEffect(() => {
    if (editorRef.current && !cmInstance.current) {
      cmInstance.current = Codemirror.fromTextArea(editorRef.current, {
        mode: { name: 'javascript', json: true },
        theme: 'dracula',
        autoCloseTags: true,
        autoCloseBrackets: true,
        lineNumbers: true,
      });


       cmInstance.current.on('change',(instance, changes)=>{
        console.log('changes',changes);
        const {origin} = changes;
        const code = instance.getValue();
        onCodeChange(code);
        if(origin !== 'setValue'){
            socketRef.current.emit(ACTIONS.CODE_CHANGE,{
                roomId,
                code,
                  
            });
        }

       });


    }
  }, []);

  useEffect(()=>{
          if(socketRef.current){
                  socketRef.current.on(ACTIONS.CODE_CHANGE,({code})=>{
            if(code !== null){
                cmInstance.current.setValue(code);
            }
        });
          }
       
     return () =>{
          socketRef.current.off(ACTIONS.CODE_CHANGE);
     }
     
  },[socketRef.current]);


  return (
    <textarea ref={editorRef}></textarea>
  );
};

export default CodeEditor;
