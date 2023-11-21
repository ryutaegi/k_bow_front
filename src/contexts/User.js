import React, {useEffect, useState, createContext} from 'react';

const UserContext = createContext({
    user: {imageURL : null, LoginType : null, name : null, email : null, social_id : null, social_type : null, user_id : null, jwtToken : null, agree : null},
    dispatch: () => {},
});

const UserProvider = ({ children }) => {
    const  [user, setUser] = useState({});
    const dispatch = ({ imageURL, LoginType, name, email, social_id, social_type, user_id, jwtToken, agree }) => {
        setUser({imageURL, LoginType, name, email, social_id, social_type, user_id, jwtToken, agree});
    };
    const value = { user, dispatch};
    useEffect(() => {
        console.log('UserContext updated:', user);
      }, [user]);
    
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
export { UserContext, UserProvider};