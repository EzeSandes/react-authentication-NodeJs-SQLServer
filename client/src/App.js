import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [usernameReg, setUsernameReg] = useState('');
  const [passwordReg, setPasswordReg] = useState('');
  const [usernameLog, setUsernameLog] = useState('');
  const [passwordLog, setPasswordLog] = useState('');

  const [loginStatus, setLoginStatus] = useState('');

  const register = async () => {
    try {
      // In the port of the server obviously
      const res = await axios({
        method: 'POST',
        url: `/api/v1/users/signup`,
        data: {
          username: usernameReg,
          password: passwordReg,
        },
      });

      console.log(res.data);
      if (res.data.status === 'success') console.log('Register succesfully');
    } catch (err) {
      console.log(`⛔⛔⛔: ${err.response.data.message}`);
    }
  };

  const login = async () => {
    try {
      // In the port of the server obviously
      const res = await axios({
        method: 'POST',
        url: '/api/v1/users/login',
        data: {
          username: usernameLog,
          password: passwordLog,
        },
      });

      console.log(res.data);
      if (res.data.status === 'success') {
        console.log('Logged succesfully!');
        setLoginStatus(
          `Logged succesfully! Welcome back ${res.data.data.username}`
        );
      }
    } catch (err) {
      console.log(`⛔⛔⛔: ${err.response.data.message}`);
      setLoginStatus(err.response.data.message);
    }
  };

  const handlerRegister = e => {
    e.preventDefault();
    register();
    // setUsernameReg('');
    // setPasswordReg('');
  };

  const handlerLogin = e => {
    e.preventDefault();
    login();
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
          <button onClick={handlerLogin}>Log in</button>
        </form>
      </div>

      <h1>{loginStatus}</h1>
    </div>
  );
}

export default App;
