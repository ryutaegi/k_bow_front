import React, { useState, useEffect, useContext } from 'react';
import { Calendar } from 'react-native-calendars';
import { LocaleConfig } from 'react-native-calendars';
import { UserContext } from '../contexts';
import { Text } from 'react-native-elements';
import axios from 'axios';
LocaleConfig.locales['kr'] = {
  monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘'
};
LocaleConfig.defaultLocale = 'kr';
const URL = "http://43.201.78.159:3000";


const DataMain = ({navigation}) => {
    const [data, setData] = useState("");
    const { user } = useContext(UserContext);
    const [markedDates, setMarkedDates] = useState({});
    const [dataDetails, setDataDetails] = useState({}); // 날짜별 shots와 feedback을 저장하기 위한 state


    
      const onDayPress = (day) => {
        console.log('Selected Day', day.dateString); // YYYY-MM-DD 형식으로 출력됩니다.
        setData(day.dateString)
        navigation.navigate('Record');
      };
      
      useEffect(() => {
        const date = new Date();
        const currentMonth = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        axios({
          method : 'post',
          url: URL+'/api/shot/month',
          headers: {
            'Authorization': `${user.jwtToken}`
        },
        data: { month : currentMonth },
        }).then((response) => {
          //console.log("DB업로드 완료", response.data);
          const newData = response.data.reduce((acc, item) => {
            console.log("acc",acc);
            console.log("item",item);
            const date = item.shot_date;

            let shotArray = [];

            // Check if shot_array is not null before trying to parse
            if (item.shot_array !== null) {
                const firstParsedValue = JSON.parse(item.shot_array);
                if (typeof firstParsedValue === "string") {
                    try {
                        shotArray = JSON.parse(firstParsedValue);
                    } catch (error) {
                        shotArray = [firstParsedValue];  // If it's a simple string, make it an array
                    }
                } else {
                    shotArray = [firstParsedValue]; // If it's a non-string parsed value, make it an array
                }
            }

            const filteredShotsCount = shotArray.filter(value => ((value >= 4 && value <= 12)||(value == 17))).length;
            const percent = 200 - (filteredShotsCount/shotArray.length)*5*40
            console.log(shotArray);
            console.log(filteredShotsCount);
            console.log(percent);


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
          
        }).catch(function (error) {
          console.log('error', error);
        })
    }, []);

      const onVisibleMonthsChange = (months) => {
        if(months && months.length > 0) {
            const firstVisibleMonth = months[0];
            // YYYY-MM-DD 형식의 문자열로 월을 표시합니다.
            const monthString = `${firstVisibleMonth.year}-${firstVisibleMonth.month.toString().padStart(2, '0')}`;
            // 여기서 서버에 현재 보이는 월을 전송할 수 있습니다.
            console.log(monthString);
            axios({
              method : 'post',
              url: URL+'/api/shot/month',
              headers: {
                'Authorization': `${user.jwtToken}`
            },
            data: { month : monthString },
            }).then((response) => {
              //console.log("DB업로드 완료", response.data);

              const newData = response.data.reduce((acc, item) => {
                console.log("acc",acc);
                console.log("item",item);
                const date = item.shot_date;

                let shotArray = [];

                // Check if shot_array is not null before trying to parse
                if (item.shot_array !== null) {
                    const firstParsedValue = JSON.parse(item.shot_array);
                    if (typeof firstParsedValue === "string") {
                        try {
                            shotArray = JSON.parse(firstParsedValue);
                        } catch (error) {
                            shotArray = [firstParsedValue];  // If it's a simple string, make it an array
                        }
                    } else {
                        shotArray = [firstParsedValue]; // If it's a non-string parsed value, make it an array
                    }
                }

                const filteredShotsCount = shotArray.filter(value => ((value >= 4 && value <= 12)||(value == 17))).length;
                const percent = 200 - (filteredShotsCount/shotArray.length)*5*40
                console.log(shotArray);
                console.log(filteredShotsCount);
                console.log(percent);


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
      <Text>{data}</Text>
      </>
      );
}


export default DataMain;

