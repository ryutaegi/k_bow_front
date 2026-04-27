import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import { LocaleConfig } from 'react-native-calendars';
import { UserContext, ProgressContext } from '../contexts';
import { Text } from 'react-native-elements';
import axios from 'axios';
import getEnvVars from '../../environmant';
import { Dimensions, View, TouchableOpacity, ScrollView } from 'react-native';
import { CustomCard } from '../equipment/card';

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
  const { apiUrl } = getEnvVars;
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
    const currentMonthRef = useRef('');
    const isFirstFocus = useRef(true);
    const today = new Date();
    //today.setHours(today.getHours() + 9);
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

      const onDayPress = (day) => {
        // console.log('Selected Day', day.dateString); // YYYY-MM-DD 형식으로 출력됩니다.
        // console.log(markedDates);
        // console.log("금일", dateString);
        //  if(day.dateString !== dateString)
        //  {
        // setData(day.dateString)
        // navigation.navigate('Record', {date : day.dateString});
        // }


        console.log('Selected Day', day.dateString); // YYYY-MM-DD 형식으로 출력됩니다.
        console.log(markedDates);
        console.log("금일", dateString);
    
        const selectedDate = new Date(day.dateString);
        const currentDate = new Date(dateString); // 현재 날짜와 시간
        //currentDate.setHours(0, 0, 0, 0); // 시간을 00:00:00으로 설정하여 날짜만 비교
        console.log("selectedDate",selectedDate);
        console.log("currentDate", currentDate);
        if (selectedDate < currentDate) {
            // 선택된 날짜가 오늘 날짜보다 이전일 경우
            setData(day.dateString);
            navigation.navigate('Record', { date: day.dateString });
        }
        
      };
      
      const fetchMonthData = (monthString) => {
        spinner.start();
        axios({
          method: 'post',
          url: apiUrl + '/api/shot/month',
          headers: { 'Authorization': `${user.jwtToken}` },
          data: { month: monthString },
        }).then((response) => {
          shotDate = [];
          shotCount = 0;
          console.log("response.data", response.data);
          if (response.data.length !== 0) {
            const newData = response.data.reduce((acc, item) => {
              const date = item.shot_date_korean.slice(0, 10);
              let shotArray = [];
              if (item.shot_array !== null) {
                shotArray = getDecodingLevel(item.shot_array).data;
              }
              shotDate = [...shotDate, ...shotArray];
              const filteredShotsCount = shotArray.filter(value => ((value >= 4 && value <= 12) || (value == 17))).length;
              shotCount += filteredShotsCount;
              const percent = 200 - (filteredShotsCount / shotArray.length) * 5 * 40;
              if (!acc[date]) acc[date] = { selected: true, selectedColor: `rgb(${percent},${percent * 1.1},255)` };
              return acc;
            }, {});
            setMarkedDates(newData);
            setMonthDate(Object.keys(newData)[0].slice(0, 7));
            setShotCount(shotCount);
            setShotDates(shotDate.length);
            setHitPercent([
              shotDate.filter(value => value == 4).length / shotCount,
              shotDate.filter(value => value == 5).length / shotCount,
              shotDate.filter(value => value == 6).length / shotCount,
              shotDate.filter(value => value == 7).length / shotCount,
              shotDate.filter(value => value == 8).length / shotCount,
              shotDate.filter(value => value == 9).length / shotCount,
              shotDate.filter(value => value == 10).length / shotCount,
              shotDate.filter(value => value == 11).length / shotCount,
              shotDate.filter(value => value == 12).length / shotCount,
            ]);
            setMissPercent([
              shotDate.filter(value => value == 0).length / (shotDate.length - shotCount),
              shotDate.filter(value => value == 1).length / (shotDate.length - shotCount),
              shotDate.filter(value => value == 2).length / (shotDate.length - shotCount),
              shotDate.filter(value => value == 3).length / (shotDate.length - shotCount),
              shotDate.filter(value => value == 13).length / (shotDate.length - shotCount),
              shotDate.filter(value => value == 14).length / (shotDate.length - shotCount),
              shotDate.filter(value => value == 15).length / (shotDate.length - shotCount),
              shotDate.filter(value => value == 16).length / (shotDate.length - shotCount),
            ]);
          } else {
            setShotCount('');
            setShotDates('');
            setHitPercent([0, 0, 0, 0, 0, 0, 0, 0, 0]);
            setMissPercent([0, 0, 0, 0, 0, 0, 0, 0]);
          }
          spinner.stop();
        }).catch(function (error) {
          console.log('error', error);
          spinner.stop();
        });
      };

      useEffect(() => {
        const date = new Date();
        const currentMonth = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        currentMonthRef.current = currentMonth;
        fetchMonthData(currentMonth);
      }, []);

      useFocusEffect(
        useCallback(() => {
          if (isFirstFocus.current) {
            isFirstFocus.current = false;
            return;
          }
          const month = currentMonthRef.current || `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}`;
          fetchMonthData(month);
        }, [])
      );

      const onVisibleMonthsChange = (months) => {
        if (months && months.length > 0) {
          const firstVisibleMonth = months[0];
          const monthString = `${firstVisibleMonth.year}-${firstVisibleMonth.month.toString().padStart(2, '0')}`;
          currentMonthRef.current = monthString;
          fetchMonthData(monthString);
        }
      };
    

      return (
      <>
      <ScrollView>
      <Calendar markedDates={markedDates}
      onDayPress={onDayPress} 
      onVisibleMonthsChange={onVisibleMonthsChange}
      />

        
      
        <CustomCard
        title="시수 분포"
        iscard={0}>
          <View style={{ alignItems: 'center', backgroundColor: "#fff", marginTop : 10, marginBottom : 30 }}>
      
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
          >
            <Text style={{color : 'gray'}}>{parseInt(missPercent[index]*100)}%</Text>
          </TouchableOpacity>
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
        >
          <Text style={{color : 'gray'}}>{parseInt(missPercent[3]*100)}%</Text>
        </TouchableOpacity>
        <View style={{flexDirection : 'row'}}>
          {[...Array(3)].map((_, index) => (
            <View key={index} style={{ flexDirection: 'column', justifyContent: 'center' }}>
              {[...Array(3)].map((_, subIndex) => (
                <TouchableOpacity
                  key={subIndex + index * 3 + 4}
                  style={{
                    width: windowWidth * 0.05,
                    height: windowWidth * 0.05,
                    margin : 0.33,
                    backgroundColor : `rgb(255, ${170-1500*hitPercent[subIndex + index * 3]}, ${150-1500*hitPercent[subIndex + index * 3]})`,
                    borderWidth: 0.1,
                    borderRadius: 0,
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
        >
          <Text style={{color : 'gray'}}>{parseInt(missPercent[4]*100)}%</Text>
        </TouchableOpacity>
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
          >
            <Text style={{color : 'gray'}}>{parseInt(missPercent[index+5]*100)}%</Text>
          </TouchableOpacity>
        ))}
      </View>
      </View>
        </CustomCard>
    

    <View style={{
        flexDirection : 'row', 
        justifyContent: 'space-between',
         marginBottom: 10,  borderWidth : 0, width : windowWidth, paddingLeft : 20, paddingRight : 20, paddingBottom : 5 }}>
          
        <View style={{textAlign : 'left', borderWidth : 0}}>
         <Text style={{ fontSize: 16, color : '#777' }}>
         {monthDate.slice(0,4)} - {monthDate.slice(5,8)}
          </Text>
        </View>
        
        {shotDates > 0 ? (
          <View>
            <Text style={{ fontSize: 16, fontWeight : '400', textAlign : 'left', borderWidth : 0 }}>
              평  {((shotCounts/shotDates) * 5).toFixed(1)} 중{'\n'}
              계 {shotCounts} / {shotDates}</Text>
          </View>
        ) : null}
        </View>
        </ScrollView>
        
      </>
      );
}


export default DataMain;

