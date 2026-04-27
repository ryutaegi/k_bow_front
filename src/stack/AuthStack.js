import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../certification/login';
import GoogleLogin from '../certification/GoogleLogin';
import AppleLogin from '../certification/AppleLogin';

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} options={{headerShown : false,}}/>
      <Stack.Screen name="GoogleLogin" component={GoogleLogin} options={{headerShown : false,}} />
      <Stack.Screen name="AppleLogin" component={AppleLogin} options={{headerShown : false,}} />
    </Stack.Navigator>
  );
};

export default AuthStack;
