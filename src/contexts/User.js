import React, {useEffect, useState, createContext} from 'react';

const UserContext = createContext({
    user: {email : null, uid : null, jeong : null, start_year : null},
    dispatch: () => {},
});

const UserProvider = ({ children }) => {
    const  [user, setUser] = useState({});
    const dispatch = ({ email, uid, jeong, start_year }) => {
        setUser({email, uid, jeong, start_year});
    };
    const value = { user, dispatch};
    useEffect(() => {
        console.log('UserContext updated:', user);
      }, [user]);
    
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
export { UserContext, UserProvider};