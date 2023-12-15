import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Alert,
  StyleSheet,
  TOuchablele,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { UserContext } from "../contexts";
import styled, { ThemeContext } from "styled-components/native";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { SpeedDial } from "@rneui/themed";
import getEnvVars from "../../environmant";

const Notice_list = ({ route, navigation }) => {
  const theme = useContext(ThemeContext);
  const board_type = route.params.board_type;
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [inputData, SetInput] = useState([]);
  const { user } = useContext(UserContext);
  const isFocused = useIsFocused(); // 현재 화면의 포커스 상태를 확인
  const [open, setOpen] = useState(false);
  const { apiUrl } = getEnvVars;
  const [page, setPage] = useState(1); // 현재 페이지 번호

  const fetchPosts = async () => {
    // ...
    // 페이지에 따라 데이터를 로드하는 로직을 추가합니다.
    console.log("page",page);
    console.log(user);

        try {
          const response = await axios.get(
            apiUrl + "/api/board/list/" + board_type + '/' + page,
            {
              headers: {
                Authorization: `${user.jwtToken}`,
              },
            }
          );
          const _inputData = response.data.map((rowData) => ({
            writer: rowData.nickname,
            board_id: rowData.board_id,
            title: rowData.title,
            content: rowData.content,
            date: rowData.created_at_korean, //rowData.created_at
          }));
          SetInput((prevPost) => [...prevPost, ..._inputData]);
          console.log(inputData);
        } catch (error) {
          if (error.response && error.response.status === 401) {
            console.error("권한 없음", error);
            Alert.alert("안내", "로그인이 필요합니다");

            navigation.navigate("홈");
            // 여기에 추가적인 동작(예: 알림 또는 리다이렉션)을 넣을 수 있습니다.
          } else {
            console.error("API 요청 중 에러 발생:", error);
          }
        }
  };

  const loadMorePosts = () => {
    setPage(prevPage => prevPage + 1); // 페이지 번호 증가
  };

  useEffect(() => {
    if (isFocused) {
      fetchPosts();
    }
  }, [isFocused, page]); // 페이지가 변경될 때마다 fetchPosts를 호출

  useEffect(() => {
    if (isFocused) {
      setPage(1); // 페이지 번호를 초기화합니다.
      SetInput([]); // 게시물 데이터를 초기화합니다.
      //fetchPosts(); // 게시물을 다시 불러옵니다.
    }
  }, [isFocused]);

  // useEffect(() => {
  //   if (isFocused) {
  //     const fetchPosts = async () => {
  //       console.log(user);

  //       try {
  //         const response = await axios.get(
  //           apiUrl + "/api/board/list/" + board_type,
  //           {
  //             headers: {
  //               Authorization: `${user.jwtToken}`,
  //             },
  //           }
  //         );
  //         const _inputData = response.data.map((rowData) => ({
  //           writer: rowData.nickname,
  //           board_id: rowData.board_id,
  //           title: rowData.title,
  //           content: rowData.content,
  //           date: rowData.created_at,
  //         }));
  //         SetInput(_inputData);
  //         console.log(inputData);
  //       } catch (error) {
  //         if (error.response && error.response.status === 401) {
  //           console.error("권한 없음", error);
  //           Alert.alert("안내", "로그인이 필요합니다");

  //           navigation.navigate("홈");
  //           // 여기에 추가적인 동작(예: 알림 또는 리다이렉션)을 넣을 수 있습니다.
  //         } else {
  //           console.error("API 요청 중 에러 발생:", error);
  //         }
  //       }
  //     };
  //     fetchPosts();
  //   }
  // }, [isFocused]);

  return (
    <>
    <View style={{ padding: 7.5, backgroundColor: theme.white }}>
    <FlatList
  data={inputData}
  renderItem={({ item, index }) => (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() =>
        navigation.navigate("notice_detail", {
          board_type: board_type,
          board_id: item.board_id,
        })
      }
    >
      <View style={styles.contentContainer}>
        <View style={{ flexDirection: "column", alignItems: "center" }}>
          <View style={styles.textContainer}>
            <Title numberOfLines={2} ellipsizeMode="tail">{item.title}</Title>
            <Content numberOfLines={2} ellipsizeMode="tail">{item.content}</Content>
            <View style={{ flexDirection: "row" }}>
              <Footer>{item.writer} |</Footer>
              <Footer>
                {" "}
                {item.date.slice(0, 10)} {item.date.slice(11, 16)}
              </Footer>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )}
  keyExtractor={(item, index) => index.toString()}
  onEndReached={loadMorePosts}
  onEndReachedThreshold={0.5}
/>
</View>


      
      {board_type !== 1 && (
        <SpeedDial
          color={theme.wiget22}
          isOpen={open}
          icon={{ name: "edit", color: "#fff" }}
          openIcon={{ name: "close", color: "#fff" }}
          onOpen={() =>
            navigation.navigate("create_post", { board_type: board_type })
          }
          onClose={() => setOpen(false)}
        >
          <SpeedDial.Action
            color={theme.wiget22}
            icon={{ name: "add", color: "#fff" }}
            title="글쓰기"
            onPress={() =>
              navigation.navigate("create_post", { board_type: board_type })
            }
          />
        </SpeedDial>
      )}

{((board_type == 1)&&(user.user_id == 1)) && (
        <SpeedDial
          color={theme.wiget22}
          isOpen={open}
          icon={{ name: "edit", color: "#fff" }}
          openIcon={{ name: "close", color: "#fff" }}
          onOpen={() =>
            navigation.navigate("create_post", { board_type: board_type })
          }
          onClose={() => setOpen(false)}
        >
          <SpeedDial.Action
            color={theme.wiget22}
            icon={{ name: "add", color: "#fff" }}
            title="글쓰기"
            onPress={() =>
              navigation.navigate("create_post", { board_type: board_type })
            }
          />
        </SpeedDial>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 10,
    marginLeft : 5,
    marginRight : 5,
  },
  contentContainer: {
    flexDirection: "row",
    marginBottom: 0, // Add some space above the button
  },
  textContainer: {
    flex: 1, // Take up all available space
    justifyContent: "center", // Center the text vertically
  },
  labelText: {
    fontSize: 12,
    color: "#000",
  },
  cardHeading: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  cardDescription: {
    fontSize: 14,
    color: "#000",
  },
});

const Container = styled.TouchableOpacity`
  aligncontent: center;
  border: 0px;
  border-radius: 10px;

  background-color: ${({ theme }) => theme.white};
  height: 100px;
  marginbottom: 10px;
  flexdirection: column;
  padding: 10px;
  elevation: 3;
`;

const Title = styled.Text`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 7px;
  overflow: hidden;
`;
const Content = styled.Text`
  overflow: hidden;
`;

const Footer = styled.Text`
  font-size: 12px;
  margin-top: 10px;
  color: ${({ theme }) => theme.gray1};
`;

const HorizontalLine = styled.View`
  border-bottom-width: 0.85px;
  border-bottom-color: gray;
`;

const WriteButton = styled.TouchableOpacity`
  width: 60px;
  height: 60px;
  position: absolute;

  bottom: ${({ theme }) => theme.viewHeight * 0.02}px;
  right: ${({ theme }) => theme.viewWidth * 0.06}px;
  background-color: ${({ theme }) => theme.mainColor4};
  justify-content: center;
  border-radius: 50px;
  align-items: center;
`;

export default Notice_list;
