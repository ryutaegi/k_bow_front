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
import { CardRow } from './equipment/card';
import { equipment_data } from './LocationData';
import * as Linking from 'expo-linking';

const EquipmentMain = ({ }) => {

  const link = (url) => {
    Linking.openURL(url)
}

return(
<View style={{backgroundColor : 'white', flex : 1}}>
    <ScrollView>

<View style={{padding : 10}}>
  {equipment_data.map((data, index) => (
    <CardRow
        key={data.id}
        label={data.label}
        heading={data.heading}
        description={data.description}
        imageUrl={data.imageUrl}
        onActionPress={() => {link(data.pageUrl)}}
      />
  ))}


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