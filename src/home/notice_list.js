import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import axios from 'axios';
import { UserContext } from '../contexts';
import styled, {ThemeContext} from 'styled-components/native';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { SpeedDial } from '@rneui/themed';
import getEnvVars from '../../environmant';



 
const Notice_list = ({route, navigation}) => {
    const theme = useContext(ThemeContext);
    const board_type = route.params.board_type;
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [inputData, SetInput] = useState([]);
    const { user } = useContext(UserContext);
    const isFocused = useIsFocused(); // 현재 화면의 포커스 상태를 확인
    const [open, setOpen] = useState(false);
    const { apiUrl } = getEnvVars();

    useEffect(() => {
        if(isFocused) {
        const fetchPosts = async () => {
            console.log(user);
            
            try{
            const response = await axios.get(apiUrl+'/api/board/list/'+board_type, {
                headers: {
                    'Authorization': `${user.jwtToken}`
                }
            });
            const _inputData = response.data.map((rowData) => ({
                writer : rowData.nickname,
                board_id: rowData.board_id,
                title: rowData.title,
                content: rowData.content,
                date : rowData.created_at,
            }));
            SetInput(_inputData);
            console.log(inputData);
        }catch(error) {
            if (error.response && error.response.status === 401) {
                console.error("권한 없음", error);
                alert("로그인하세요");

                navigation.navigate('board1');
                // 여기에 추가적인 동작(예: 알림 또는 리다이렉션)을 넣을 수 있습니다.
             } else {
                 console.error("API 요청 중 에러 발생:", error);
             }
        }
           
            
        };
        fetchPosts();
    }
    }, [isFocused]);

   

    return (
        <>
        <ScrollView showsHorizontalScrollIndicator={false}>
        <View style={{ padding: 15, backgroundColor : theme.gray6}}>
            {inputData.map((notice, index) => (
                <React.Fragment key={index}>
                    
                    <Container onPress={() => navigation.navigate("notice_detail", {board_type : board_type, board_id : notice.board_id})}>
                        <Title>{notice.title}</Title>
                        <Content>{notice.content}</Content>
                        <View style={{flexDirection: 'row'}}>
                        <Footer>{notice.writer} |</Footer>
                        <Footer> {notice.date.slice(0, 10)} {notice.date.slice(11, 16)}</Footer>
                        
                        
                        </View>
                    </Container>
                </React.Fragment>
            ))}
            
            
            
        </View>
        
        </ScrollView>
        {
        board_type !== 1 && (
            <SpeedDial
            color='#254EDB'
            isOpen={open}
            icon={{ name: 'edit', color: '#fff' }}
            openIcon={{ name: 'close', color: '#fff' }}
            onOpen={() => setOpen(!open)}
            onClose={() => setOpen(!open)}
          >
            <SpeedDial.Action
            color='#254EDB'
              icon={{ name: 'add', color: '#fff' }}
              title="글쓰기"
                onPress={() => navigation.navigate("create_post", {board_type : board_type})}
              
            />
           
          </SpeedDial>
        
            )
        }


        </>
    );
    
    
};

const Container = styled.TouchableOpacity`
  alignContent: center;
  border : 0px;
  border-radius : 10px;
  
  background-color : ${({ theme }) => theme.white};
  height : 100px;
  marginBottom: 10px;
  flexDirection: column;
  padding : 10px;
  elevation : 3;
`;

const Title = styled.Text`
  
  height : 30%;
 font-size : 16px;
 font-weight : bold;
 margin-bottom : 7px;
`;
const Content = styled.Text`

  height : 26%;
`;

const Footer = styled.Text`

  font-size : 12px;
  margin-top : 10px;
  color : ${({ theme }) => theme.gray1};
`;

const HorizontalLine = styled.View`
border-bottom-width: 0.85px;
border-bottom-color: gray;

`;

const WriteButton = styled.TouchableOpacity`
  width: 60px;
  height: 60px;
  position : absolute;
  
  bottom : ${({ theme }) => theme.viewHeight*0.02}px;
  right : ${({ theme }) => theme.viewWidth*0.06}px;
  background-color : ${({ theme }) => theme.mainColor4};
  justify-content: center;
  border-radius : 50px;
  align-items: center;


`;

export default Notice_list;
