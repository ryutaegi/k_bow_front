
import { View, StyleSheet } from "react-native";
import React, { useState, useContext } from 'react';
import { ProgressContext, UserContext } from '../contexts';
import { WebView } from 'react-native-webview';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import getEnvVars from "../../environmant";

const REDIRECT_URI = 'https://www.naver.com';
const APPLE_CLIENT_ID = "com.taeyou.reactexams";


const AppleLogin = ({navigation}) => {
  const { dispatch } = useContext(UserContext);
  const { apiUrl } = getEnvVars;
  const { spinner } = useContext(ProgressContext);


  const handleWebViewNavigationStateChange = async (newNavState) => {

    const { url } = newNavState;
    if (!url) return;
    console.log(newNavState);
    console.log(url);
    // }
  };
  

   
   

  return (
    <WebView
      source={{ uri:`https://appleid.apple.com/auth/authorize?response_type=code&client_id=${APPLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=apple&response_type=code%20id_token&scope=name%20email&response_mode=form_post&scope=name`}}
      onNavigationStateChange={handleWebViewNavigationStateChange}
      style={{ flex: 1 }}
      onMessage={handleWebViewNavigationStateChange}
    />
    
  )
}

export default AppleLogin;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24,
    backgroundColor: '#fff',
  },    
});