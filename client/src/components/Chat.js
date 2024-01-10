import React, { useEffect, useState } from 'react';

const Chat = ({ socket, roomID, userID }) => {
    const [curMessage, setCurMessage] = useState('');
    const [recMessages, setRecMessages] = useState([]);

    async function sendMessage() {
        if (curMessage !== '') {
            const messageData = {
                roomID: roomID,
                author: userID,
                message: curMessage,
                time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes(),
            };

            // Include isMine property to indicate that it's your own message
            setRecMessages((prevMessages) => [...prevMessages, { ...messageData, isMine: true }]);
            
            await socket.emit('send_message', messageData);
        }

        setCurMessage("")
    }

    useEffect(() => {
        socket.on('receive_message', (data) => {
            // Include isMine property to indicate that it's another sender's message
            setRecMessages((prevMessages) => [...prevMessages, { ...data, isMine: false }]);
        });

        // Cleanup the event listener when the component is unmounted
        return () => {
            socket.off('receive_message');
        };
    }, [socket]);

    return (
        <div className=' flex flex-col w-full h-[90vh] items-center'>
            <div className='flex w-max flex-col h-full border-2 border-slate-700'>
                <h2 className="font-bold text-2xl p-4 border-b-2">Live Chat</h2>

                <div className='h-[90%] w-full p-2 space-y-2'>
                    {recMessages.map((message, index) => (
                        <div key={index} className={`w-full flex ${message.isMine? "justify-end":""}`}>
                            <div className={`w-max p-2 flex rounded-full ${message.isMine?"bg-green-500 text-white":" bg-gray-300 text-black"}`}>
                                <p className=''>{message.message}</p>
                                {/* <p>{message.time}</p> */}
                            </div>
                        </div>
                    ))}
                </div>

                <div className='m-2'>
                    <input className='bg-green-100 text-black placeholder-current rounded-md px-6 py-2 w-max focus:outline-none' type='text' value={curMessage} placeholder='Say Hello....' onChange={(e) => setCurMessage(e.target.value)} />
                    
                    <button className='ml-2 text-lg bg-green-500 text-white px-2 py-1.5 rounded-lg' onClick={sendMessage}>&#9658;</button>
                </div>
                
            </div>
        </div>
    );
};

export default Chat;
