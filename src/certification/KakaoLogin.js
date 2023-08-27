
import { View, StyleSheet } from "react-native";
import React, { useState, useContext } from 'react';
import { ProgressContext, UserContext } from '../contexts';
import { WebView } from 'react-native-webview';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const REST_API_KEY = '9fd6d6c300b1e8d443843c3301a50ac5';
const REDIRECT_URI = 'http://192.168.1.102:19006';
const INJECTED_JAVASCRIPT = `window.ReactNativeWebView.postMessage('message from webView')`;


const KaKaoLogin = ({navigation}) => {
  const { dispatch } = useContext(UserContext);

 

  function KakaoLoginWebView (data) {
    const exp = "code=";
    var condition = data.indexOf(exp);    
    if (condition != -1) {
      var authorize_code = data.substring(condition + exp.length);
      //console.log(authorize_code);
      requestToken(authorize_code);
    };
  }

  const requestToken = async (authorize_code) => {
    var AccessToken = "none";
    
    axios ({
      method: 'post',
      url: 'https://kauth.kakao.com/oauth/token',
      params: {
        grant_type: 'authorization_code',
        client_id: REST_API_KEY,
        redirect_uri: REDIRECT_URI,
        code: authorize_code,
      },
    }).then((response) => {
      AccessToken = response.data.access_token;
      console.log(AccessToken);
      requestUserInfo(AccessToken);
      storeData(AccessToken);
      
    }).catch(function (error) {
      console.log('error', error);
    })
    //const user = {user: {email : "sdf", uid : "sdfg", jeong : null, start_year : null}};
      
    
    //navigation.navigate("MyPage", { screen: "MyPage" } );
  };

  function requestUserInfo(AccessToken)  {
    axios ({
      method: 'GET',
      url: 'https://kapi.kakao.com/v2/user/me',
      headers: {
        Authorization : `Bearer ${AccessToken}`
      },
    }).then((response) => {
      var user_email = response.data.kakao_account.email;
      var user_range = response.data.kakao_account.age_range;
      var user_gender = response.data.kakao_account.gender;
      console.log("user_emil", user_email);
      console.log("user_range", user_range);
      console.log("user_gender", user_gender);
      dispatch({email : user_email, uid : AccessToken});
    }).catch(function (error) {
      console.log('error', error);
    })
    return;
  }

  const storeData = async (returnValue) => {
    try {
      await AsyncStorage.setItem('userAccessToken', returnValue);
    } catch (error) {
    }
  }

  return (
    <View style={Styles.container}>      
      <WebView
        style={{ flex: 1 }}
        originWhitelist={['*']}
        scalesPageToFit={false}
        source={{
          uri: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`,
        }}
        injectedJavaScript={INJECTED_JAVASCRIPT}
        javaScriptEnabled
        onMessage={event => { KakaoLoginWebView(event.nativeEvent["url"]); }}
      />
    </View>
  )
}

export default KaKaoLogin;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24,
    backgroundColor: '#fff',
  },    
});