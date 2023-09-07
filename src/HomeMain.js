import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import axios from 'axios';
import HomeStack from './stack/HomeStack';
import styled from 'styled-components/native';

const HomeMain = () => {
    return (
       <LoginButton>
        <Text>커뮤니티</Text>
       </LoginButton>
    );
};

const LoginButton = styled.TouchableOpacity`
  width: 100%;
  height: 40px;
  background-color: rgb(100,100,255); /* 배경 색상을 원하는 대로 변경하세요 */
  justify-content: center;
  border-radius : 10px;
  align-items: center;
  margin-top : 20px;
  margin-bottom: 10px;
`;

export default HomeMain;
