import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  ScrollView,
  Dimensions,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import { UserContext } from '../contexts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Input, Icon } from '@rneui/themed';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');


const RecordMain = ({ navigation, route }) => {
  const [shots, setShots] = useState([]); // 사각형의 결과를 저장하는 상태
  const [averages, setAverages] = useState([]); // 각 라인의 평균을 저장하는 상태
  const [test, setTest] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null); // 전달된 이미지를 저장하는 상태
  const [soon, setSoon] = useState([-1]);
  const [jeong, setJeong] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [feedbackHeight, setFeedbackHeight] = useState(40); // 초기 높이 설정
  const { user } = useContext(UserContext);

  const today = new Date();
  const year = today.getFullYear(); // 년도
  const month = today.getMonth() + 1;  // 월
  const day = today.getDate();  // 날짜
  const dateString = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`; // 날짜를 문자열로 변환합니다. 월과 일이 한 자리 수인 경우 앞에 0을 붙입니다.

 
  useEffect(() => {
    const loadShots = async () => {
      try {
            //디비로 넘길 부분
            axios({
              method : 'post',
              url: 'http://43.201.78.159:3000/api/shot/detail',
              headers: {
                'Authorization': `${user.jwtToken}`
            },
            data: { user_id : user.user_id, date : route.date},
            }).then((response) => {
              console.log("데이터 받아오기 완료", response.data);
              setShots(response.data.shots);
              setFeedback(response.data.feedback);
            }).catch(function (error) {
              console.log('error', error);
            })
        } catch (error) {
        console.error(error);
      }
     
    };
    loadShots();
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

// 이후 코드는 동일합니다.


 // const missImage = require('./images/hit_image11.png'); // 미스 이미지
  //const hitImage = require('./images/hit_image10.png'); // 히트 이미지
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
        
    {shots.map((shot, index) => (
  
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
>
 
</TouchableOpacity>


        </View>
        <View style={{ 
          flexDirection: 'column', 
          flexWrap: 'wrap',
          margin : 0,
          borderWidth : 0,
          width: windowWidth*0.12,
      //height : windowWidth*0.8,
    }}>

          { jeong.map((jeong1, index) => (
  
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
          {year+' - '+month+' - '+day}</Text>
        </View>
        
        <View>
          <Text style={{ fontSize: 16, fontWeight : '400', textAlign : 'left', borderWidth : 0 }}>
            평 {calculateAverage(shots)} 중{'\n'}
            계 {shots.filter((shot) => (shot >= 4 && shot <= 12) || shot == 17).length} / {shots.length}</Text>
        </View>
        </View>
        <View style={{
         marginBottom: -10, width : windowWidth*0.9 }}>

<Input
    placeholder='이곳에 습사일지를 입력하세요'
    multiline={true}
    numberOfLines={4}
    value={feedback}
    onChangeText={setFeedback}
    inputContainerStyle={{ 
        height: Math.min(feedbackHeight, 100), // 최대 높이 적용
        overflow: 'scroll' // 스크롤 설정
    }}
    onContentSizeChange={(e) => setFeedbackHeight(e.nativeEvent.contentSize.height)}
/>
         </View>
    </View>
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
  }
})


export default RecordMain;
