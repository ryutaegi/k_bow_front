import React, { useContext, useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TextInput, Button, FlatList, Touchable, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { Card, Text, ListItem } from 'react-native-elements';
import styled, {ThemeContext} from 'styled-components/native';
import { Fontisto } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { UserContext } from './contexts';
import getEnvVars from '../environmant';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import CardMain from './equipment/card';

const EquipmentMain = ({ }) => {
return(
<View style={{backgroundColor : 'white', flex : 1}}>
    <ScrollView>
<Container>
<Text>
    궁시백화점
</Text>
</Container>

<Container>
<Text>
    하늘스포츠
</Text>
</Container>
<View style={{padding : 10}}>
<CardMain
        label="Another Label"
        heading="궁시백화점"
        description="활, 화살, 완대, 암가드, 개량궁, 각궁, 활 관련 종합쇼핑몰"
        imageUrl="https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788954756976.jpg"
        onActionPress={() => console.log('Another Button Pressed')}
      />
<CardMain
        label="Another Label"
        heading="Another Heading"
        description="This is another description."
        imageUrl="https://via.placeholder.com/150"
        onActionPress={() => console.log('Another Button Pressed')}
      />
</View>
</ScrollView>
</View>
);
}

const Container = styled.TouchableOpacity`
  align-content: center;
  border-radius: 10px;
  margin : 10px;
  
  background-color: ${({ theme }) => theme.white};
  //border : 1px solid red;
  height: 150px;
  margin-bottom: 10px;
  flex-direction: column;
  padding: 0px;
  elevation: 5;
`;
export default EquipmentMain;