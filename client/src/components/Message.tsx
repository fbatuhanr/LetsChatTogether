import React from 'react';

const Message = ({ username, text }: { username: string, text: string }) => {
  return (
    <div className="message">
      <p className="message-username">{username}</p>
      <p className="message-text">{text}</p>
    </div>
  );
};

export default Message