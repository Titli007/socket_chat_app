import React, { useState } from "react";
import io from 'socket.io-client'
import Chat from "./components/Chat";

const socket = io.connect("http://localhost:4000")

function App() {

  const [roomID, setRoomId] = useState('');
  const [userID, setUserId] = useState('');
  const [isClicked, setIsClicked] = useState(false);

  function joinRoom(){
    if(roomID!=='' && userID!== ''){
      socket.emit("join_room", roomID)
    }
    setIsClicked(true)
  }


  return (
    <div className="w-screen flex flex-row text-center pt-10 justify-center">

    {!isClicked?
        
          <div className="w-1/2">
            <div className="pb-5">
              <h1 className="font-bold text-3xl p-6">Welcome To Chat Room....</h1>
              <input className="w-max p-4 focus:outline-none border-2  m-2" type="text" placeholder="Room ID...." onChange={(e)=>setRoomId(e.target.value)}/><br/>
              <input className="p-4 focus:outline-none border-2  m-2" type="text" placeholder="User ID...." onChange={(e)=>setUserId(e.target.value)}/><br/>
              <button className="px-6 py-2 bg-green-500 text-white rounded-full mt-2" onClick={joinRoom}>Join A Room</button>

            </div>

          </div>

          :
        
          <div className="w-1/2">
            <Chat socket={socket} roomID={roomID} userID={userID}/>
          </div>
        
        }
        </div>
    
  );
}

export default App;
