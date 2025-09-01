import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Editor from './EditorPage';
const Home = () => {
    const navigate = useNavigate();

    const [roomId,setRoomId] = useState('');
    const [username, setUsername] = useState('');

  const createNewRoom = (e)=>{
       e.preventDefault();
       const id = uuidv4();
       setRoomId(id);
       toast.success('Created a new room');

  }
  const joinRoom = ()=>{
    if(!roomId || !username){
        toast.error('Room ID and username is required');
        return;
    }
  
    navigate(`/editor/${roomId}`,{
        state: {
              username,
        },
    })

  }
  const handleInputEnter = (e)=>{
    if(e.code === 'Enter')
    {
        joinRoom();
    }
  }

  return (
    <div className='homePageWrapper'>
        <div className='formWrapper'>
            <img className='homePageLogo' src="code-sync.png" alt="code-sync-logo" />
            <h4 className='mainLable'>Paste invitation ROOM ID</h4>
            <div className='inputGroup'>
                <input type="text" className='inputBox' placeholder='ROOM ID'
                   onChange={(e)=> setRoomId(e.target.value)}
                   onKeyUp={handleInputEnter}
                value={roomId} />
                <input type="text" className='inputBox' placeholder='USERNAME'
                   onChange={(e)=> setUsername(e.target.value)}
                    onKeyUp={handleInputEnter}
                value={username}
                />
                <button onClick={joinRoom} className='btn joinBtn'>Join</button>
                <span className='createInfo'>
                    If you don't have an invite then create &nbsp;
                    <a onClick={createNewRoom} href="" className='createNewBtn'>
                        new room
                    </a>
                </span>
            </div>
        </div>
        <footer>
           <h4>
             Build by <a href="https://github.com/cracker0001">Raj Coder</a>
           </h4>
        </footer>

    </div>
  )
}

export default Home
