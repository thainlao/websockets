import { useState } from 'react';
import '../styles/mainbody.css';
import LoggedIn from './LoggedIn';

function Mainbody() {
  const [username, setUsername] = useState<string>('');
  const [logedIn, setLogedIn] = useState<boolean>(false);

  const handleLogin = () => {
    if (username.length < 4){
     alert('more then 4 symobls please')
    } else  {
      setLogedIn(true)
    }
  }

  return (
    <div>
    {!logedIn ?
      <form onSubmit={(e) => {e.preventDefault()}} className='main'>
      <h1>Welcome to Thainlao Chat :)</h1>
      <h2>Please enter your name to start </h2>

      <input 
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder='your username...'
      />
      <button 
        type='button'
        onClick={handleLogin}>Start
      </button>
    </form> : 
      <div className='main'>
        <LoggedIn username={username}/>
      </div>}
    </div>
  )
}

export default Mainbody
