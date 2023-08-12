import React, { useEffect, useState, useContext } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { logout } from './utils/firebase';
import { UserContext } from './contexts';
import { Button } from 'react-native';


const HomeMain = () => {
 const { dispatch } = useContext(UserContext);

 const _logoutpress = async () => {
  try {
    await logout();
  } catch(e) {
    console.log('[profile] logout : ', e.message);
  }finally{
    dispatch({});
  }
  };
 

  return (
    
    <Button title="logout" onPress={_logoutpress}/>
    
  );
};

export default HomeMain;
