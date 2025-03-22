import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../UserContext';
import { customAlert } from '../utils/utils';

export default function Header() {
    // Since Header calls useContext it will be rerendered whenever it will be rerendered (as any other component that calls)
    // useContext. So when we log in the user all components that call useContext will be rerendered
    const { setUserInfo } = useContext(UserContext);

    useEffect(() => {
        axios({
            url: 'http://localhost:3001/profile',
            withCredentials: 'include', // Include cookies (thus include jwt that is stored there)
        }).then((userInfo) => {
            // Calling setUserInfo so component can rerender and show different options for header
            setUserInfo(userInfo);
        });
    }, []);

    const logout = async () => {
        try {
            await axios({
                url: 'http://localhost:3001/logout',
                method: 'POST',
                withCredentials: 'include', // Include cookies (thus include jwt that is stored there)
            });

            // By setting username to null we make sure to render login/register buttons
            setUserInfo(null);
            localStorage.removeItem('username');

            customAlert('Logged out.', '', 'success', 'OK');
        } catch (err) {
            customAlert('Error occurred.', err?.response?.data?.message || err?.message, 'error', 'OK');
        }
    };

    // const username = userInfo?.username; // userInfo can be null
    const username = localStorage.getItem('username');

    return (
        <header>
            <Link className="logo" to={'/'}>
                Blog-App
            </Link>

            <nav>
                {username && (
                    <div>
                        Welcome <b>{username}</b>
                    </div>
                )}
                {username && (
                    <>
                        <Link to={'/create-post'}>Create new post</Link>
                        <span className="logout-span" onClick={logout}>
                            Log out
                        </span>
                    </>
                )}
                {!username && (
                    <>
                        <Link to={'/login'}>Login</Link>
                        <Link to={'/register'}>Register</Link>
                    </>
                )}
            </nav>
        </header>
    );
}
