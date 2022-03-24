import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [usernameReg, setUsernameReg] = useState('');
  const [passwordReg, setPasswordReg] = useState('');
  const [usernameLog, setUsernameLog] = useState('');
  const [passwordLog, setPasswordLog] = useState('');

  const register = async () => {
    try {
      // In the port of the server obviously
      const response = await axios.post(
        `http://localhost:3001/api/v1/users/signup`,
        {
          username: usernameReg,
          password: passwordReg,
        }
      );

      console.log(response);
    } catch (err) {
      console.log(`⛔⛔⛔: ${err.message}`);
    }
  };

  const handlerRegister = e => {
    e.preventDefault();
    register();
    // setUsernameReg('');
    // setPasswordReg('');
  };
  return (
    <div className='App'>
      <div className='registration'>
        <h1>Registration</h1>
        <form>
          <label>Username</label>
          <input
            type='text'
            onChange={e => setUsernameReg(e.target.value)}
            value={usernameReg}
          />
          <label>Password</label>
          <input
            type='password'
            onChange={e => setPasswordReg(e.target.value)}
            value={passwordReg}
          />
          <button onClick={handlerRegister}>Register</button>
        </form>
      </div>
      <div className='login'>
        <h1>Login</h1>
        <form>
          <label>Username</label>
          <input
            type='text'
            placeholder='Username...'
            onChange={e => setUsernameLog(e.target.value)}
            value={usernameLog}
          />
          <label>Password</label>
          <input
            type='password'
            placeholder='Password...'
            onChange={e => setPasswordLog(e.target.value)}
            value={passwordLog}
          />
          <button>Log in</button>
        </form>
      </div>
    </div>
  );
}

export default App;
