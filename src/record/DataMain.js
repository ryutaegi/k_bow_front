import React, { useState, useEffect, useContext } from 'react';
import { Calendar } from 'react-native-calendars';
import { LocaleConfig } from 'react-native-calendars';
import { UserContext, ProgressContext } from '../contexts';
import { Text } from 'react-native-elements';
import axios from 'axios';
import getEnvVars from '../../environmant';
import { Dimensions, View, TouchableOpacity } from 'react-native';

LocaleConfig.locales['kr'] = {
  monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘'
};
LocaleConfig.defaultLocale = 'kr';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const DataMain = ({navigation}) => {
  const { spinner } = useContext(ProgressContext);
  const { apiUrl } = getEnvVars();
    const [data, setData] = useState("");
    const { user } = useContext(UserContext);
    const [markedDates, setMarkedDates] = useState({});
    const [dataDetails, setDataDetails] = useState({}); // 날짜별 shots와 feedback을 저장하기 위한 state
    const [monthDate, setMonthDate] = useState('');
    const [shotDates, setShotDates] = useState('');
    const [shotCounts, setShotCount] = useState('');
    const [hitPercent, setHitPercent] = useState([]);
    const [missPercent, setMissPercent] = useState([]);
    let shotDate = [];
    let shotCount = 0;

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

      const onDayPress = (day) => {
        console.log('Selected Day', day.dateString); // YYYY-MM-DD 형식으로 출력됩니다.
        setData(day.dateString)
        navigation.navigate('Record', {date : day.dateString});
      };
      
      useEffect(() => {
        spinner.start();
        const date = new Date();
        //date.setHours(date.getHours() + 9);
        //console.log("오늘날짜", date)
        const currentMonth = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        axios({
          method : 'post',
          url: apiUrl+'/api/shot/month',
          headers: {
            'Authorization': `${user.jwtToken}`
        },
        data: { month : currentMonth },
        }).then((response) => {
          shotDate = [];
              shotCount = 0;
          console.log("response.data", response.data)
          if(response.data.length !== 0)
           {
              
          //console.log("DB업로드 완료", response.data);
          const newData = response.data.reduce((acc, item) => {
            console.log("acc",acc);
            console.log("item",item);
            const date = item.shot_date.slice(0,10); //korean시간변경가능
            console.log("date는",item.shot_date); //korean시간변경가능

            let shotArray = [];

            // Check if shot_array is not null before trying to parse
            if (item.shot_array !== null) {
              shotArray = getDecodingLevel(item.shot_array).data;
                
            }
            shotDate = [...shotDate, ...shotArray];
            const filteredShotsCount = shotArray.filter(value => ((value >= 4 && value <= 12)||(value == 17))).length;
            shotCount += filteredShotsCount;
            const percent = 200 - (filteredShotsCount/shotArray.length)*5*40
            console.log(shotArray);
            console.log(filteredShotsCount);
            console.log(percent);
            console.log('shotdate', shotDate);


            // Calculate the percentage of shot values between 9 and 14
             //const filteredShots = shotArray.filter(value => value >= 4 && value <= 14).length;
            // const percentage = (filteredShots.length / shotArray.length) * 100;
        
             
             //console.log(filteredShots);
             
        

            if (!acc[date]) acc[date] = {selected: true, selectedColor: `rgb(${percent},${percent*1.1},255)`};

            // const existingDetails = dataDetails[date] || { shots: [], feedback: [] };
            // existingDetails.shots.push(shotArray);
            // existingDetails.feedback.push(item.feedback);
            // setDataDetails(prevDetails => ({ ...prevDetails, [date]: existingDetails }));
        
            // 필요하다면 다른 로직을 추가하여 acc[date]를 업데이트 할 수 있습니다.
            return acc;


          }, {});
          setMarkedDates(newData);
          setMonthDate(Object.keys(newData)[0].slice(0,7));
          setShotCount(shotCount);
          setShotDates(shotDate.length);
          setHitPercent(
            [shotDate.filter(value => (value == 4)).length / shotCount,
            shotDate.filter(value => (value == 5)).length / shotCount,
            shotDate.filter(value => (value == 6)).length / shotCount,
            shotDate.filter(value => (value == 7)).length / shotCount,
            shotDate.filter(value => (value == 8)).length / shotCount,
            shotDate.filter(value => (value == 9)).length / shotCount,
            shotDate.filter(value => (value == 10)).length / shotCount,
            shotDate.filter(value => (value == 11)).length / shotCount,
            shotDate.filter(value => (value == 12)).length / shotCount, 
          ]);
          setMissPercent(
            [shotDate.filter(value => (value == 0)).length / (shotDate.length - shotCount),
            shotDate.filter(value => (value == 1)).length / (shotDate.length - shotCount),
            shotDate.filter(value => (value == 2)).length / (shotDate.length - shotCount),
            shotDate.filter(value => (value == 3)).length / (shotDate.length - shotCount),
            shotDate.filter(value => (value == 13)).length / (shotDate.length - shotCount),
            shotDate.filter(value => (value == 14)).length / (shotDate.length - shotCount),
            shotDate.filter(value => (value == 15)).length / (shotDate.length - shotCount),
            shotDate.filter(value => (value == 16)).length / (shotDate.length - shotCount),
          ]);
        }
        spinner.stop();

        }).catch(function (error) {
          console.log('error', error);
        })
    }, []);

      const onVisibleMonthsChange = (months) => {
        if(months && months.length > 0) {
          spinner.start();
            const firstVisibleMonth = months[0];
            // YYYY-MM-DD 형식의 문자열로 월을 표시합니다.
            const monthString = `${firstVisibleMonth.year}-${firstVisibleMonth.month.toString().padStart(2, '0')}`;
            // 여기서 서버에 현재 보이는 월을 전송할 수 있습니다.
            console.log(monthString);
            axios({
              method : 'post',
              url: apiUrl+'/api/shot/month',
              headers: {
                'Authorization': `${user.jwtToken}`
            },
            data: { month : monthString },
            }).then((response) => {
              //console.log("DB업로드 완료", response.data);
              console.log("response.data", response.data)
              if(response.data.length !== 0)
              {
              shotDate = [];
              shotCount = 0;
              
             
              const newData = response.data.reduce((acc, item) => {
                console.log("acc",acc);
                console.log("item",item);
                const date = item.shot_date.slice(0,10); //korean시간변경가능

                let shotArray = [];

                // Check if shot_array is not null before trying to parse
                if (item.shot_array !== null) {
                  if (item.shot_array !== null) {
                    shotArray = getDecodingLevel(item.shot_array).data;
                      
                  }
                }
                shotDate = [...shotDate, ...shotArray];
                const filteredShotsCount = shotArray.filter(value => ((value >= 4 && value <= 12)||(value == 17))).length;
                shotCount += filteredShotsCount;
                const percent = 200 - (filteredShotsCount/shotArray.length)*5*40
                console.log("shotarray", shotArray);
                console.log(filteredShotsCount);
                console.log(percent);
                console.log('shotdate', shotDate);
               


                // Calculate the percentage of shot values between 9 and 14
                 //const filteredShots = shotArray.filter(value => value >= 4 && value <= 14).length;
                // const percentage = (filteredShots.length / shotArray.length) * 100;
            
                 
                 //console.log(filteredShots);
                 
            

                if (!acc[date]) acc[date] = {selected: true, selectedColor: `rgb(${percent},${percent*1.1},255)`};

                // const existingDetails = dataDetails[date] || { shots: [], feedback: [] };
                // existingDetails.shots.push(shotArray);
                // existingDetails.feedback.push(item.feedback);
                // setDataDetails(prevDetails => ({ ...prevDetails, [date]: existingDetails }));
            
                // 필요하다면 다른 로직을 추가하여 acc[date]를 업데이트 할 수 있습니다.
                return acc;
              }, {});
              setMarkedDates(newData);
            setMonthDate(Object.keys(newData)[0].slice(0,7));
            setShotCount(shotCount);
            setShotDates(shotDate.length);
            setHitPercent(
              [shotDate.filter(value => (value == 4)).length / shotCount,
              shotDate.filter(value => (value == 5)).length / shotCount,
              shotDate.filter(value => (value == 6)).length / shotCount,
              shotDate.filter(value => (value == 7)).length / shotCount,
              shotDate.filter(value => (value == 8)).length / shotCount,
              shotDate.filter(value => (value == 9)).length / shotCount,
              shotDate.filter(value => (value == 10)).length / shotCount,
              shotDate.filter(value => (value == 11)).length / shotCount,
              shotDate.filter(value => (value == 12)).length / shotCount, 
            ]);
            setMissPercent(
              [shotDate.filter(value => (value == 0)).length / (shotDate.length - shotCount),
              shotDate.filter(value => (value == 1)).length / (shotDate.length - shotCount),
              shotDate.filter(value => (value == 2)).length / (shotDate.length - shotCount),
              shotDate.filter(value => (value == 3)).length / (shotDate.length - shotCount),
              shotDate.filter(value => (value == 13)).length / (shotDate.length - shotCount),
              shotDate.filter(value => (value == 14)).length / (shotDate.length - shotCount),
              shotDate.filter(value => (value == 15)).length / (shotDate.length - shotCount),
              shotDate.filter(value => (value == 16)).length / (shotDate.length - shotCount),
            ]);
          }
            spinner.stop();
              
            }).catch(function (error) {
              console.log('error', error);
            })
        }
    };
    

      return (
      <><Calendar markedDates={markedDates}
      onDayPress={onDayPress} 
      onVisibleMonthsChange={onVisibleMonthsChange}
      />



    <View style={{ flex: 1, alignItems: 'center', backgroundColor: "#fff", marginTop : 70 }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', }}>
        {[...Array(3)].map((_, index) => (
          <TouchableOpacity
            key={index}
            style={{
              width: index === 0 || index === 2 ? windowWidth * 0.15 : windowWidth * 0.15,
              height: windowWidth * 0.15,
              backgroundColor : `rgb(255, 255, ${200-2000*missPercent[index]})`,
              borderWidth: 0.1,
            borderRadius: 0.5,
            margin : 1,
              overflow: 'hidden',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        ))}
      </View>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          key={3}
          style={{
            width: windowWidth * 0.15,
            height: windowWidth * 0.15,
            backgroundColor : `rgb(255, 255, ${200-2000*missPercent[3]})`,
            borderWidth: 0.1,
            margin : 1,
            borderRadius: 0.5,
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        />
        <View>
          {[...Array(3)].map((_, index) => (
            <View key={index} style={{ flexDirection: 'column', flexWrap: 'wrap', justifyContent: 'center', flex: 0.75 }}>
              {[...Array(3)].map((_, subIndex) => (
                <TouchableOpacity
                  key={subIndex + index * 3 + 4}
                  style={{
                    width: windowWidth * 0.05,
                    height: windowWidth * 0.05,
                    margin : 0.33,
                    backgroundColor : `rgb(255, ${150-1500*hitPercent[subIndex + index * 3]}, ${150-1500*hitPercent[subIndex + index * 3]})`,
                    borderWidth: 0.1,
                    borderRadius: 0.5,
                    overflow: 'hidden',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                />
              ))}
            </View>
          ))}
        </View>
        <TouchableOpacity
          key={13}
          style={{
            width: windowWidth * 0.15,
            height: windowWidth * 0.15,
            margin : 1,
            backgroundColor : `rgb(255, 255, ${200-2000*missPercent[4]})`,
            borderWidth: 0.1,
            borderRadius: 0.5,
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        />
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', flex: 1 }}>
        {[...Array(3)].map((_, index) => (
          <TouchableOpacity
            key={index + 14}
            style={{
              width: index === 0 || index === 2 ? windowWidth * 0.15 : windowWidth * 0.15,
              height: windowWidth * 0.15,
            backgroundColor : `rgb(255, 255, ${200-2000*missPercent[index+5]})`,
            borderWidth: 0.1,
            borderRadius: 0.5,
            margin : 1,
              overflow: 'hidden',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        ))}
      </View>
    </View>

    <View style={{
        flexDirection : 'row', 
        justifyContent: 'space-between',
         marginBottom: 10,  borderWidth : 0, width : windowWidth, paddingLeft : 20, paddingRight : 20, paddingBottom : 5 }}>
          
        <View style={{textAlign : 'left', borderWidth : 0}}>
         <Text style={{ fontSize: 16, color : '#777' }}>
         {monthDate.slice(0,4)} - {monthDate.slice(5,8)}
          </Text>
        </View>
        
        <View>
          <Text style={{ fontSize: 16, fontWeight : '400', textAlign : 'left', borderWidth : 0 }}>
            평  {((shotCounts/shotDates) * 5).toFixed(1)} 중{'\n'}
            계 {shotCounts} / {shotDates}</Text>
        </View>
        </View>
      
      </>
      );
}


export default DataMain;

