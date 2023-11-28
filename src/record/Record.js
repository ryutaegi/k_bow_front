import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  ScrollView,
  Dimensions,
  StyleSheet,
  AppState,
  KeyboardAvoidingView
} from 'react-native';
import axios from 'axios';
import { UserContext } from '../contexts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Input, Icon } from '@rneui/themed';
import getEnvVars from '../../environmant';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');


const Record = ({ navigation, route }) => {
  const [shots, setShots] = useState([]); // 사각형의 결과를 저장하는 상태
  const [averages, setAverages] = useState([]); // 각 라인의 평균을 저장하는 상태
  const [test, setTest] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null); // 전달된 이미지를 저장하는 상태
  const [soon, setSoon] = useState([-1]);
  const [jeong, setJeong] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [feedbackHeight, setFeedbackHeight] = useState(40); // 초기 높이 설정
  const { user } = useContext(UserContext);
  const { apiUrl } = getEnvVars();
  // 현재의 상태를 알려주는것 
  const appState = useRef(AppState.currentState);

  // 현재 사용자의 앱을 활성화 / 비활성화 여부 
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  
    const initialShots = useRef(shots);
    const initialFeedback = useRef(feedback);
    const finalShots = useRef(shots);
    const finalFeedback = useRef(feedback);

  const today = new Date();
  const year = today.getFullYear(); // 년도
  const month = today.getMonth() + 1;  // 월
  const day = today.getDate();  // 날짜
  const dateString = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`; // 날짜를 문자열로 변환합니다. 월과 일이 한 자리 수인 경우 앞에 0을 붙입니다.



  function getDecodingLevel(dataString) {
    try {
        const firstDecode = JSON.parse(dataString);
        if (typeof firstDecode === "string") {
            // 첫 번째 디코딩 후 문자열이 반환된 경우 두 번 인코딩되었음을 의미합니다.
            const secondDecode = JSON.parse(firstDecode);
            return { level: 2, data: secondDecode };
        } else {
            // 첫 번째 디코딩에서 데이터 구조가 반환된 경우 한 번만 인코딩되었음을 의미합니다.
            return { level: 1, data: firstDecode };
        }
    } catch (e) {
        // 디코딩 중 오류가 발생한 경우
        return { level: 0, error: "Not a valid JSON encoded string" };
    }
}
 
  useEffect(() => {
    const loadShots = async () => {
      try {
            //디비로 넘길 부분
            axios({
              method : 'post',
              url: apiUrl+'/api/shot/detail',
              headers: {
                'Authorization': `${user.jwtToken}`
            },
            data: { user_id : user.user_id, date : route.params.date},
            }).then((response) => {
              console.log("데이터 받아오기 완료", response.data[0]);
              const decoding = getDecodingLevel(response.data[0].shot_array);
               //실수로 9월말 2번 인코딩해서 데이터 넣는 걸로 만듦. 고치긴 했는데 이전 데이터 받기위해이렇게함
              
              let arr = [];
              let arr1 = [];
              for (let i = -1; i <= decoding.data.length-1; i += 5) {
                arr.push(i);
            }
              for (let i=0; i< decoding.data.length; i++){
                if(((decoding.data[i]>=4) && (decoding.data[i]<=12))||(decoding.data[i]==17))
                {
                  console.log(decoding.data[i]);
                  
                  if(typeof arr1[parseInt(i/5)] == 'undefined')
                  {
                    arr1[parseInt(i/5)] = 1;
                
                }
                  else
                  arr1[parseInt(i/5)]++;
                }
                else{
                  if(typeof arr1[parseInt(i/5)] == 'undefined')
                  arr1[parseInt(i/5)] = 0;
                }
              }
              console.log("arr1은",arr1);
              
              setSoon(arr);
              setShots(decoding.data);
              setJeong(arr1);
              setFeedback(response.data[0].feedback.slice(1, -1));
              console.log("피드백은", response.data[0].feedback.slice(1, -1))
              initialShots.current = decoding.data;
              initialFeedback.current = response.data[0].feedback.slice(1, -1);
            
            }).catch(function (error) {
              console.log('error', error);
            })
        } catch (error) {
        console.error(error);
      }
    };
    loadShots();
    console.log(shots);
    console.log(typeof shots)
    console.log(Array.isArray(shots));

   
  }, []);
  useEffect(() => {
    console.log(shots);
    console.log(feedback);
    finalShots.current = shots;
    finalFeedback.current = feedback;
}, [shots, feedback]);


  const sendDataToServer = () => {
    if (finalShots.current !== initialShots.current || finalFeedback.current !== initialFeedback.current) {
      console.log(finalShots.current);
      console.log(initialShots.current);
    axios({
        method: 'post',
        url: `${apiUrl}/api/shot/modify`,
        headers: {
            'Authorization': `${user.jwtToken}`
        },
        data: {
            date : route.params.date,
            shots: JSON.stringify(finalShots.current),
            feedback: JSON.stringify(finalFeedback.current),
            shot_count : finalShots.current.length,
            target_count : finalShots.current.filter((shot) => (shot >= 4 && shot <= 12) || shot == 17).length,
        }
    }).then(response => {
        console.log("Data sent successfully:", response.data);
        initialShots.current = finalShots.current;
        initialFeedback.current = finalFeedback.current;
    }).catch(error => {
        console.error("Error sending data:", error);
    });
  }
};

// Handle unmount
useEffect(() => {
    return sendDataToServer;
}, []);



 
 const fn_handleAppStateChange = (nextAppState) => {

  console.log("appState.current ::: ", appState.current);
  console.log("nextappstate ::: ", nextAppState); //active, inactive, background 전달받음

 
  if (nextAppState === 'background') {
                sendDataToServer();
            }
  appState.current = nextAppState;    // 변경된 상태를 바꿔줌.
  setAppStateVisible(appState.current);
};


useEffect(() => {

  // 사용자가 앱의 상태가 변경 되었을 경우 실행이 된다.
  const myListener = AppState.addEventListener('change', fn_handleAppStateChange);
  return () => {
      myListener.remove();
  };


}, []);
  




const updateShots = (image, boxindex) => {
  setSelectedImage(image);

  const updatejeong = [...jeong];
  let jeongdata = 0;
  
  if(boxindex%5 == 4) //5시 수정 시
  {
    if((image>=4 && image<=12) || image == 17)
    jeongdata++;
    if((shots[boxindex-1] >= 4 && shots[boxindex-1]<=12) || shots[boxindex-1] == 17)
    jeongdata++;
    if((shots[boxindex-2] >= 4 && shots[boxindex-2]<=12) || shots[boxindex-2] == 17)
    jeongdata++;
    if((shots[boxindex-3] >= 4 && shots[boxindex-3]<=12) || shots[boxindex-3] == 17)
    jeongdata++;
    if((shots[boxindex-4] >= 4 && shots[boxindex-4]<=12) || shots[boxindex-4] == 17)
    jeongdata++;
    updatejeong[Math.floor(boxindex/5)] = jeongdata;
  }
  else if(boxindex%5 == 3) // 4시 수정 시
  {
    if((image>=4 && image<=12) || image == 17)
    jeongdata++;
    if((shots[boxindex-1] >= 4 && shots[boxindex-1]<=12) || shots[boxindex-1] == 17)
    jeongdata++;
    if((shots[boxindex-2] >= 4 && shots[boxindex-2]<=12) || shots[boxindex-2] == 17)
    jeongdata++;
    if((shots[boxindex-3] >= 4 && shots[boxindex-3]<=12) || shots[boxindex-3] == 17)
    jeongdata++;
    if((shots[boxindex+1] >= 4 && shots[boxindex+1]<=12) || shots[boxindex+1] == 17)
    jeongdata++;
    updatejeong[Math.floor(boxindex/5)] = jeongdata;
  }
  else if(boxindex%5 == 2) // 3시 수정 시
  {
    if((image>=4 && image<=12) || image == 17)
    jeongdata++;
    if((shots[boxindex-1] >= 4 && shots[boxindex-1]<=12) || shots[boxindex-1] == 17)
    jeongdata++;
    if((shots[boxindex-2] >= 4 && shots[boxindex-2]<=12) || shots[boxindex-2] == 17)
    jeongdata++;
    if((shots[boxindex+2] >= 4 && shots[boxindex+2]<=12) || shots[boxindex+2] == 17)
    jeongdata++;
    if((shots[boxindex+1] >= 4 && shots[boxindex+1]<=12) || shots[boxindex+1] == 17)
    jeongdata++;
    updatejeong[Math.floor(boxindex/5)] = jeongdata;
  }
  else if(boxindex%5 == 1) // 2시 수정 시
  {
    if((image>=4 && image<=12) || image == 17)
    jeongdata++;
    if((shots[boxindex-1] >= 4 && shots[boxindex-1]<=12) || shots[boxindex-1] == 17)
    jeongdata++;
    if((shots[boxindex+3] >= 4 && shots[boxindex+3]<=12) || shots[boxindex+3] == 17)
    jeongdata++;
    if((shots[boxindex+2] >= 4 && shots[boxindex+2]<=12) || shots[boxindex+2] == 17)
    jeongdata++;
    if((shots[boxindex+1] >= 4 && shots[boxindex+1]<=12) || shots[boxindex+1] == 17)
    jeongdata++;
    updatejeong[Math.floor(boxindex/5)] = jeongdata;
  }
  else if(boxindex%5 == 0) // 1시 수정 시
  {
    if((image>=4 && image<=12) || image == 17)
    jeongdata++;
    if((shots[boxindex+4] >= 4 && shots[boxindex+4]<=12) || shots[boxindex+4] == 17)
    jeongdata++;
    if((shots[boxindex+3] >= 4 && shots[boxindex+3]<=12) || shots[boxindex+3] == 17)
    jeongdata++;
    if((shots[boxindex+2] >= 4 && shots[boxindex+2]<=12) || shots[boxindex+2] == 17)
    jeongdata++;
    if((shots[boxindex+1] >= 4 && shots[boxindex+1]<=12) || shots[boxindex+1] == 17)
    jeongdata++;
    updatejeong[Math.floor(boxindex/5)] = jeongdata;
  }
  setJeong(updatejeong);
  
  if (boxindex < shots.length) { //이전 데이터 수정 시
    setTest(prevTest => prevTest + 1);
   

    const updatedShots = [...shots];
    updatedShots[boxindex] = parseInt(image); // shots 배열의 해당 인덱스 값을 변경
    setShots(updatedShots);
  }else {

    const updatedShots = [...shots, parseInt(image)]; // shots 배열에 추가
    setShots(updatedShots);
    if(boxindex%5 == 4){ //순 추가
      const updatedShots = [...soon, boxindex];
      setSoon(updatedShots);
      console.log(soon);
    }
  } 
};

useEffect(() => {
  
  if (route.params?.image){//&& route.params?.boxindex) {
    
    const { image, boxindex } = route.params;
    //console.log(shots); //boxindex는 클릭한 박스의 순서 0부터 시작. image는 선택한 이미지 index 0부터 시작.
    updateShots(image, boxindex); // updateShots 함수를 호출하여 shots 배열 업데이트
  }
  
  const currentAverage = calculateAverage(shots);
  setAverages((prevAverages) => [...prevAverages, currentAverage]);//배열쓰지말기
}, [route.params?.image, route.params?.boxindex]);

// // 이후 코드는 동일합니다.


//  // const missImage = require('./images/hit_image11.png'); // 미스 이미지
//   //const hitImage = require('./images/hit_image10.png'); // 히트 이미지
  const partImages = [
    require('../../images/hit/leftup.png'),
    require('../../images/hit/up.png'),
    require('../../images/hit/rightup.png'),
    require('../../images/hit/left.png'),

    require('../../images/hit/hit1.png'),
    require('../../images/hit/hit2.png'),
    require('../../images/hit/hit3.png'),
    require('../../images/hit/hit4.png'),
    require('../../images/hit/hit5.png'),
    require('../../images/hit/hit6.png'),
    require('../../images/hit/hit7.png'),
    require('../../images/hit/hit8.png'),
    require('../../images/hit/hit9.png'),
    

    require('../../images/hit/right.png'),
    require('../../images/hit/leftdown.png'),
    require('../../images/hit/down.png'),
    require('../../images/hit/rightdown.png'),

    require('../../images/hit/hit.png'), //중
    require('../../images/hit/miss.png'), //불
    // ... 7개 부분 이미지 파일 경로 추가
  ]; // 부분 이미지 경로 배열



  const calculateAverage = (line) => {
    if (line.length === 0) return 0;
    
    const hitCount = line.filter((shot) => (shot >= 4 && shot <= 12) || shot == 17).length;
    
    const totalShots = line.length;
    return ((hitCount / totalShots) * 5).toFixed(1);
  };  


  return (
    <KeyboardAvoidingView  behavior={Platform.OS === "ios" ? "padding" : "height"}
    keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 140} style={{ flex: 1 }}>
    <View style={{ flex: 1, alignItems: 'center', backgroundColor:"#fff",}}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        
      <View style={{ 
          flexDirection: 'row', 
          flexWrap: 'wrap',
          margin : 20,
          marginBottom : 0,
          borderWidth : 0,}}>
            <View style={style.top}>
            </View>
            <View style={style.top}>
            <Text>1시</Text>
            </View>
            <View style={style.top}>
            <Text>2시</Text>
            </View>
            <View style={style.top}>
            <Text>3시</Text>
            </View>
            <View style={style.top}>
            <Text>4시</Text>
            </View>
            <View style={style.top}>
            <Text>5시</Text>
            </View>
            <View style={style.top}>
            <Text></Text> 
            </View>
            

            </View>
            <View style={{ 
          flexDirection: 'row', 
          flexWrap: 'nowrap',
          margin : 20,
          marginTop : 0,
          borderWidth : 0,
          borderColor:'#000',
          }}>

            <View style={{ 
          flexDirection: 'column', 
          flexWrap: 'wrap',
          margin : 0,
          borderWidth : 0,
          width: windowWidth*0.12,
      //height : windowWidth*1
    }}>
{ soon.map((index) => (
  
  <View
    key={index}
    style={{
      width: windowWidth*0.12,
      height : windowWidth*0.12,
      aspectRatio: 1,
      margin: 0,
      borderWidth: 0,
      borderRadius: 0,
      justifyContent: 'center', // 주 축 (여기서는 row 방향)을 기준으로 가운데 정렬
    alignItems: 'center', // 교차 축 (여기서는 column 방향)을 기준으로 가운데 정렬
      //borderColor: '#ccc',
      overflow: 'hidden',
      alignContent : 'center',
    }}
  
  >
    <Text>{(index+1)/5 +1}순</Text>
  </View>
))}

      </View>
      

        <View style={{ 
          flexDirection: 'row', 
          flexWrap: 'wrap',
          margin : 0,
          borderWidth : 0,
          width : windowWidth*0.60,}}>
          
          {/* 이전 사각형들 출력 */}
        
    {Array.isArray(shots) && shots.map((shot, index) => (
  
  <TouchableOpacity
    key={index}
    style={{
      width: windowWidth*0.12,
      height : windowWidth*0.12,
      aspectRatio: 1,
      margin: 0,
      marginLeft :  0,
      marginTop :  0,
      borderWidth: 0.5,
      borderRadius: 0,
      //justifyContent: 'center', // 이미지를 세로로 중앙에 배치
      alignItems: 'center',     // 이미지를 가로로 중앙에 배치
      //borderColor: '#ccc',
      overflow: 'hidden',
    }}
    onPress={() => navigation.navigate('TargetSelect', {boxidx : index})}
  >
    {/* 결과에 따라 이미지 출력 */}
    {
      <Image
        key={index}
        source={partImages[shot]}
        style={{ width: '130%', height: '130%', marginTop:-3}}
      
      />
   }
  </TouchableOpacity>
))}
<TouchableOpacity
  style={{
    width: windowWidth*0.12,
    height : windowWidth*0.12,
    aspectRatio: 1,
    margin: 0,
    marginLeft :  0,
      marginTop :  0,
    borderWidth: 0.5,
    borderRadius: 0,
    borderColor: '#000',
    backgroundColor: '#fff',
    overflow: 'hidden',
  }}
  onPress={() => navigation.navigate('TargetSelect', {boxidx : shots.length})} //shots.length

></TouchableOpacity>



        </View>
        <View style={{ 
          flexDirection: 'column', 
          flexWrap: 'wrap',
          margin : 0,
          borderWidth : 0,
          width: windowWidth*0.12,
      //height : windowWidth*0.8,
    }}>

          {jeong &&  jeong.map((jeong1, index) => (
  
  <View
    key={index}
    style={{
      width: windowWidth*0.12,
      height : windowWidth*0.12,
      aspectRatio: 1,
      margin: 0,
      marginLeft :  0,
      marginTop :  0,
      borderWidth: 0,
      borderRadius: 0,
      justifyContent: 'center', // 주 축 (여기서는 row 방향)을 기준으로 가운데 정렬
    alignItems: 'center', // 교차 축 (여기서는 column 방향)을 기준으로 가운데 정렬
      //borderColor: '#ccc',
      overflow: 'hidden',
      alignContent : 'center',
    }}
  
  >
    <Text>{jeong1}중</Text>
  </View>
))}
      </View>
      
        </View>
       
      </ScrollView>

      {/* 현재 라인의 평균 출력 */}
     
      
      <View style={{
        flexDirection : 'row', 
        justifyContent: 'space-between',
         marginBottom: 10,  borderWidth : 0, width : windowWidth*0.8 }}>
          
        <View style={{textAlign : 'left', borderWidth : 0}}>
         <Text style={{ fontSize: 16, color : '#777' }}>
          {route.params.date}</Text>
        </View>
        
        <View>
          <Text style={{ fontSize: 16, fontWeight : '400', textAlign : 'left', borderWidth : 0 }}>
            평 {calculateAverage(shots)} 중{'\n'}
            계 {shots.filter((shot) => (shot >= 4 && shot <= 12) || shot == 17).length} / {shots.length}</Text>
        </View>
        </View>
<View style={{
  marginBottom: -10, width : windowWidth*0.9 }}>

<View style={{
         marginBottom: -10, width : windowWidth*0.9 }}>

<Input
    placeholder='이곳에 습사일지를 입력하세요'
    multiline={true}
    numberOfLines={4}
    onChangeText={setFeedback}
    inputContainerStyle={{ 
        height: Math.min(feedbackHeight, 100), // 최대 높이 적용
        overflow: 'scroll' // 스크롤 설정
    }}
    onContentSizeChange={(e) => setFeedbackHeight(e.nativeEvent.contentSize.height)}
>{feedback}</Input>
         </View>
         </View>
    </View>
    </KeyboardAvoidingView>
  );
};

const style = StyleSheet.create({
  top: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: windowWidth * 0.12,
    height : windowWidth*0.12,
    //backgroundColor: "#fff",
    justifyContent: 'center', // 주 축 (여기서는 row 방향)을 기준으로 가운데 정렬
    alignItems: 'center', // 교차 축 (여기서는 column 방향)을 기준으로 가운데 정렬
    borderWidth : 0,
   

    
    
   
    justifyContent: 'center', // 주 축 (여기서는 row 방향)을 기준으로 가운데 정렬
  alignItems: 'center', // 교차 축 (여기서는 column 방향)을 기준으로 가운데 정렬
 
    alignContent : 'center',
  },
  textContainer: {
    borderWidth: 0.5, // Input 컴포넌트와 유사한 스타일을 적용하려면 추가
    borderColor: 'gray',
    borderRadius: 4,
    padding: 10,
    height: 110,
    marginBottom : 30,
  },
  feedbackText: {
    fontSize : 16
    // 원하는 스타일을 여기에 추가
  }
})


export default Record;
