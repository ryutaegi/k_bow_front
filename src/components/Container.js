import styled from "styled-components/native";
import { Text } from "react-native";

const Container = () => {
    return (<Containers/>);
}

const Containers = styled.TouchableOpacity`
  align-content: center;
  border-radius: 10px;
  width: 100%;
  background-color: ${({ theme }) => theme.white};
  border : 1px solid red;
  height: 100px;
  margin-bottom: 10px;
  flex-direction: column;
  padding: 10px;
`;

export default Container;