import React, { useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { UserContext } from '../contexts';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import getEnvVars from '../../environmant';

const GoogleLogin = ({ navigation }) => {
  const { dispatch } = useContext(UserContext);
  const { apiUrl } = getEnvVars;

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: getEnvVars.GOOGLE_WEB_CLIENT_ID,
      iosClientId: getEnvVars.GOOGLE_IOS_CLIENT_ID,
    });
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.idToken;

      const loginResponse = await axios({
        method: 'post',
        url: apiUrl + '/api/google/login',
        data: { token: idToken },
      });

      const jwtToken = loginResponse.data.token;
      const decodedToken = jwtDecode(jwtToken);

      await AsyncStorage.setItem('userToken', jwtToken);
      await AsyncStorage.setItem('userInfo', JSON.stringify({
        name: decodedToken.nickname,
        imageURL: userInfo.user?.photo || null,
        social_id: decodedToken.social_id,
        user_id: decodedToken.user_id,
        social_type: decodedToken.social_type,
        agree: decodedToken.agree,
      }));

      dispatch({
        name: decodedToken.nickname,
        imageURL: userInfo.user?.photo || null,
        social_id: decodedToken.social_id,
        user_id: decodedToken.user_id,
        social_type: decodedToken.social_type,
        jwtToken,
        agree: decodedToken.agree,
      });
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        return;
      } else if (error.code === statusCodes.IN_PROGRESS) {
        return;
      } else {
        Alert.alert('로그인 실패', '구글 로그인 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleGoogleLogin}>
        <Text style={styles.buttonText}>Google로 로그인</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  button: {
    width: 280,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
  },
});

export default GoogleLogin;
