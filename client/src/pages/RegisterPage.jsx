import axios from 'axios';
import { useState } from 'react';

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const onFormSubmit = async (e) => {
        e.preventDefault();
        const config = {
            headers: { 'Content-Type': 'application/json' },
        };
        const data = {
            username,
            password,
        };

        try {
            await axios.post('http://localhost:3001/register', data, config);
        } catch (err) {
            alert('error occurred');
            console.log('ERROR: ', err);
        }
    };

    return (
        <form onSubmit={onFormSubmit} className="register">
            <h1>Register</h1>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button>Register</button>
        </form>
    );
}
