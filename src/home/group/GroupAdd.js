import { Text, View } from "react-native";
import { useState, useContext } from "react";
import Container from "../../components/Container";
import styled, {ThemeContext} from 'styled-components/native';

const GroupAdd = () => {
    const theme = useContext(ThemeContext);
    return(
        <View style={{backgroundColor : theme.gray6}}>

      <Container>
        <Text>sdf</Text>
      </Container>
      </View>
    )
}

export default GroupAdd;