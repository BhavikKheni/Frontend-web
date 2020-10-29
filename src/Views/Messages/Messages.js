import React, { useState } from 'react';
import "./Messages.css";

import { Avatar, IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ChatPerson from './ChatPerson/ChatPerson';
import SendIcon from '@material-ui/icons/Send';

const Messages = () => {
    const [typedMessage, setTypedMessages] = useState("");

    const sendMessage = (e) => {
        e.preventDefault();
        document.getElementById('typed_messages').value = '';
        console.log(typedMessage);
    };


    return (
        <div className="messages">
            <div className="messages_body">
                {/* Sidebar Section */}
                <div className="sidebar_section">
                    <div className="sidebar_header">
                        <h1>Messages</h1>
                    </div>
                    <div className="sidebar_body">
                        <ChatPerson name="Feedback"></ChatPerson>
                        <ChatPerson name="Support"></ChatPerson>
                    </div>
                </div>
                
                {/* Chat Section */}
                <div className="chat_section">
                    {/* Chat Header */}
                    <div className="chat_header">
                        <div className="chat_header_left">
                            <h1>Chat</h1>
                        </div>
                        <div className="chat_header_right">
                            <IconButton className="btn_chat_search">
                                <SearchIcon/>
                            </IconButton>
                        </div>
                    </div>
                    {/* Chat Body */}
                    <div className="chat_body">
                        <p className="chat_message chat_sender">
                            <span className="chat_name">Feedback</span>
                            MessageOne
                        </p>
                        <p className="chat_message chat_reciever">
                            <span className="chat_name">Feedback</span>
                            MessageOne
                        </p>
                        <p className="chat_message chat_sender">
                            <span className="chat_name">Feedback</span>
                            MessageOne
                        </p>
                        <p className="chat_message chat_sender">
                            <span className="chat_name">Feedback</span>
                            MessageOne
                        </p>
                    </div>
                    {/* <div className="chat_note_section">
                        <p className="chat_note">To write a good feedback, try to be as detailed you can.  We apreciate your oppinion.</p>
                        <p className="chat_note">Be brave and let it out. Your thoughts matter and we love to hear them.</p>
                    </div> */}
                    <div className="chat_type_message">
                        <form>
                            <input 
                                id="typed_messages"
                                type="text" 
                                value={typedMessage} 
                                onChange={(e) => setTypedMessages(e.target.value)} 
                                placeholder="Type a message">
                            </input>
                            <button onClick={sendMessage} type="submit" className="btn_message_send">
                                <SendIcon/>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Messages;