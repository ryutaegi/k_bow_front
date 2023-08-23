import React, { useState, useContext } from 'react';
import {Alert, View, Text, TextInput, Image, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
//import firebase from '@react-native-firebase/app';
//import auth from '@react-native-firebase/auth';
import {signup} from '../utils/firebase';
import { ProgressContext, UserContext } from '../contexts';
import { firebase } from '@react-native-firebase/auth';
import styled from 'styled-components/native';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [jeong, setJeong] = useState('');
  const [start_year, setStart_year] = useState('');
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const { spinner } = useContext(ProgressContext);
  const { dispatch } = useContext(UserContext);
  


  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      alert('모든 필드를 입력해주세요.');
    } else if (password !== confirmPassword) {
      alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
    } else {
      try {
        // 이미지 업로드
        spinner.start();
        const user = await signup({name, email, password, imageUri, jeong, start_year});
            Alert.alert('회원가입이 완료되었습니다.');
           dispatch(user);
        
      } catch (e) {
        Alert.alert('로그인 오류', e.message);
      } finally {
        spinner.stop();
      }
    }
  };


const pickImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
    base64 : true,
  });

  if (!result.canceled) {
    console.log(result.assets[0].uri);  // 로그 추가
    setImageUri(result.assets[0].uri);
    setImageBase64(`data:image/jpeg;base64,${result.assets[0].base64}`);
  }
  
};




  return (
    <View style={styles.container}>
<TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
  {imageUri ? (
    <Image source={{ uri: imageUri }} style={styles.image} />
  ) : (
    <View style={styles.image} />
  )}
</TouchableOpacity>

      <Text style={styles.title}>회원가입</Text>
      <TextInput
        style={styles.input}
        placeholder="이름"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="이메일"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호 확인"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="소속 정 또는 학교"
        value={jeong}
        onChangeText={setJeong}
      />
      <TextInput
        style={styles.input}
        placeholder="집궁 연도"
        value={start_year}
        onChangeText={setStart_year}
      />
      <SignupButton style={styles.button} title="회원가입" onPress={handleSignup}>
        <SignupText>회원가입</SignupText></SignupButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  imageContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'gray',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'black',
    borderWidth: 0.5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },

});

const SignupButton = styled.TouchableOpacity`
  width: 100%;
  height: 40px;
  background-color: rgb(100,100,255); /* 배경 색상을 원하는 대로 변경하세요 */
  justify-content: center;
  border-radius : 10px;
  align-items: center;
  margin-top : 20px;
  margin-bottom: 10px;
`;
const SignupText = styled.Text`
color: white; /* 텍스트 색상을 원하는 대로 변경하세요 */
font-size: 16px;
`;


export default Signup;
