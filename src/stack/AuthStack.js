import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../certification/login';
import Signup from '../certification/Signup';

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} options={{headerShown : false,}}/>
      <Stack.Screen name="Signup" component={Signup} options={{headerShown : false,}} />
    </Stack.Navigator>
  );
};

export default AuthStack;
