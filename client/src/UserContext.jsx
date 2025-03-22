import { createContext, useState } from 'react';

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    // userInfo is gonna hold user's username
    const [userInfo, setUserInfo] = useState('');

    return (
        // All children will have access to userInfo and setUserInfo
        <UserContext.Provider value={{ userInfo, setUserInfo }}>
            {children}
        </UserContext.Provider>
    );
}
