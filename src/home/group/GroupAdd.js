import {
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { useState, useContext, useEffect } from "react";
//import Container from "../../components/Container";
import styled, { ThemeContext } from "styled-components/native";
import getEnvVars from "../../../environmant";
import { UserContext } from "../../contexts";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import { Alert } from "react-native";

const GroupAdd = ({ navigation }) => {
  const theme = useContext(ThemeContext);
  const { user } = useContext(UserContext);
  const { apiUrl } = getEnvVars();
  const [inputData, SetInput] = useState([]);
  const [promptVisible, setPromptVisible] = useState(false);
  const [press_group_id, setPress_group_id] = useState(-1);

 return(
  <>
  <Label>제목</Label>
      <StyledInput
        placeholder="게시글 제목"
        value={title}
        onChangeText={(text) => setTitle(text)}
      />
      <Label>내용</Label>
      <StyledInput
        placeholder="게시글 내용"
        value={content}
        onChangeText={(text) => setContent(text)}
        multiline
      />
      <SubmitButton onPress={handleSubmit}>
        <Text style={{ color: 'white' }}>등록</Text>
      </SubmitButton>
      </>
  );
};

const styles = StyleSheet.create({
  // ... other styles remain the same
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textInput: {
    height: 40,
    width: 180,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  button: {
    backgroundColor: "#2196F3",
    padding: 10,
    margin: 10,
    marginBottom: 0,
    width: 160,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
  // ... other styles remain the same
});

const Label = styled.Text`
  font-size: 16px;
  margin-bottom: 5px;
`;

const StyledInput = styled.TextInput`
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 20px;
`;

const SubmitButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.mainColor4};
  padding: 10px;
  align-items: center;
  border-radius: 5px;
`;

const Container = styled.TouchableOpacity`
  align-content: center;
  border-radius: 10px;
  width: 100%;
  background-color: ${({ theme }) => theme.white};
  //border : 1px solid red;
  height: 80px;
  margin-bottom: 10px;
  flex-direction: column;
  padding: 10px;
  elevation: 5;
`;

const Title = styled.Text`
  aligncontent: center;
  height: 40%;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 7px;
`;
const Content = styled.Text`
  aligncontent: center;
  height: 35%;
`;

const Footer = styled.Text`
  aligncontent: center;
  font-size: 12px;
  margin-top: 10px;
  color: ${({ theme }) => theme.gray1};
`;

export default GroupAdd;
