import React, { useEffect, useState } from "react";
import useWebSocket from 'react-use-websocket';
import Chat from "./Chat";

interface Props {
  username: string;
}

const LoggedIn: React.FC<Props> = ({username}) => {
    const WS_URL = 'ws://localhost:8000';
    const { sendJsonMessage, lastJsonMessage } = useWebSocket(WS_URL, {
      queryParams: { username }
    })
    const [users, setUsers] = useState<{[key: string]: any}>({});

    useEffect(() => {
      if (lastJsonMessage) {
        setUsers(lastJsonMessage);
      }
    }, [lastJsonMessage]);

    return (
      <div className="main">
        <h2>Welcome, {username}!</h2>
        <h3>Online Users:</h3>
        <ul>
          {Object.keys(users).map((userId) => (
            <li key={userId}>
              {users[userId].username} - {users[userId].state.online ? 'Online' : 'Offline'}
            </li>
          ))}
        </ul>
        <Chat username={username} sendJsonMessage={sendJsonMessage} />
      </div>
  )
}

export default LoggedIn
