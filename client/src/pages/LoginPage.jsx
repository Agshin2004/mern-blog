import axios from 'axios';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import Swal from 'sweetalert2';
import { customAlert } from '../utils/utils';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState(false);
    const { setUserInfo } = useContext(UserContext);
    const navigate = useNavigate();

    const onFormSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios({
                url: 'http://localhost:3001/login/',
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
                data: JSON.stringify({ username, password }),
                withCredentials: 'include', // if response from server will contain any cookies, they'll be saved
            });
            // Any component that calls useContext(UserContext) will rerender when setUserInfo is called
            setUserInfo(response.data);
            localStorage.setItem('username', username);

            customAlert('Success', 'Logged in succesfully, You are being redirected.', 'success', ' OK');
            setTimeout(() => {
                return navigate('/');
            }, 2000);
        } catch (err) {
            customAlert('Error!', err.response.data.message, 'error', 'OK');
        }
    };

    return (
        <form onSubmit={onFormSubmit} className="login">
            <h1>Login</h1>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button>Log in</button>
        </form>
    );
}
