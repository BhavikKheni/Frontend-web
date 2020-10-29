import React from 'react';
import "./ChatPerson.css";
import { Avatar } from '@material-ui/core';
import oweraAvatar from "../../../images/oweraAvatar.png"

const ChatPerson = (props) => {
    return (
        <div className="chat_person">
            <div className="chat_person_avater">
                <img src={oweraAvatar} alt=""></img>
            </div>
            <div className="chat_person_name">
                <h2>{props.name}</h2> 
            </div>
        </div>
    );
};

export default ChatPerson;