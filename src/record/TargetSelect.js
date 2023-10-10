import React from 'react';
import { View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Dimensions } from 'react-native';

const TargetSelect = ({ navigation, route }) => {
  const { boxidx } = route.params;
  const targetImages = [
    require('../../images/hit/leftup.png'),
    require('../../images/hit/up.png'),
    require('../../images/hit/rightup.png'),
    require('../../images/hit/left.png'),
    require('../../images/target/img1.png'),
    require('../../images/target/img2.png'),
    require('../../images/target/img3.png'),
    require('../../images/target/img4.png'),
    require('../../images/target/img5.png'),
    require('../../images/target/img6.png'),
    require('../../images/target/img7.png'),
    require('../../images/target/img8.png'),
    require('../../images/target/img9.png'),
    require('../../images/hit/right.png'),
    require('../../images/hit/leftdown.png'),
    require('../../images/hit/down.png'),
    require('../../images/hit/rightdown.png'),
    require('../../images/hit/redhit.png'),
    require('../../images/hit/miss.png'),
    // ... 7개 부분 이미지 파일 경로 추가
  ];

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  return (
    <View style={{ flex: 1, alignItems: 'center', backgroundColor:"#fff",}}>
    <ScrollView contentContainerStyle={{ padding: 20, marginTop: 50 }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', flex: 1 }}>
        {[...Array(3)].map((_, index) => (
          <TouchableOpacity
            key={index}
            style={{
              width: index === 0 || index === 2 ? windowWidth * 0.15 : windowWidth * 0.45,
              height: windowWidth * 0.15 ,
              margin: 6.5,
              marginBottom:13,
              borderWidth: 0.5,
              borderRadius: 1,
              //borderColor: '#ccc',
              overflow: 'hidden',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => navigation.navigate('Record', { image: `${index}`, boxindex: boxidx })}
          >
            <Image
              key={index}
              source={targetImages[index]}
              style={{ width:  index==1 ? '40%' : '110%', height: index==1 ? '50%' : '110%' }}
            />
          </TouchableOpacity>
        ))}
      </View>


      <View style={{ flexDirection: 'row' }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', flex: 1 }}>
  <TouchableOpacity
    key={3}
    style={{
      width: windowWidth * 0.15,
      height: windowWidth * 0.61,
      margin: 1,
      borderWidth: 0.5,
      borderRadius: 1,
      //borderColor: '#ccc',
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
    }}
    onPress={() => navigation.navigate('Record', { image: '3', boxindex: boxidx })}
  >
    <Image
      key={3}
      source={targetImages[3]}
      style={{ width:'60%', height: '35%' }}
    />
  </TouchableOpacity>
</View>
<View style={{ flexDirection: 'column', flexWrap: 'wrap', justifyContent: 'center', flex: 0.75 }}>
    {[...Array(3)].map((_, index) => (
      <TouchableOpacity 
        key={index+4}
        style={{
          width: windowWidth * 0.15,
          height: windowWidth * 0.2,
          margin: 1,
          //borderWidth: 1,
          borderRadius: 1,
          //borderColor: '#ccc',
          overflow: 'hidden',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => navigation.navigate('Record', { image: `${index+4}`, boxindex: boxidx })}
      >
        <Image
          key={index+4}
          source={targetImages[index+4]}
          style={{ width: '100%', height: '100%' }}
        />
      </TouchableOpacity>
    ))}
  </View>
  <View style={{ flexDirection: 'column', flexWrap: 'wrap', justifyContent: 'center', flex: 0.75 }}>
    {[...Array(3)].map((_, index) => (
      <TouchableOpacity 
        key={index+7}
        style={{
          width: windowWidth * 0.15,
          height: windowWidth * 0.2,
          margin: 1,
          //borderWidth: 1,
          borderRadius: 1,
          //borderColor: '#ccc',
          overflow: 'hidden',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => navigation.navigate('Record', { image: `${index+7}`, boxindex: boxidx })}
      >
        <Image
          key={index+7}
          source={targetImages[index+7]}
          style={{ width: '100%', height: '100%' }}
        />
      </TouchableOpacity>
    ))}
  </View>
  <View style={{ flexDirection: 'column', flexWrap: 'wrap', justifyContent: 'center', flex: 0.75 }}>
    {[...Array(3)].map((_, index) => (
      <TouchableOpacity 
        key={index+10}
        style={{
          width: windowWidth * 0.15,
          height: windowWidth * 0.2,
          margin: 1,
          //borderWidth: 1,
          borderRadius: 1,
          //borderColor: '#ccc',
          overflow: 'hidden',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => navigation.navigate('Record', { image: `${index+10}`, boxindex: boxidx })}
      >
        <Image
          key={index+10}
          source={targetImages[index+10]}
          style={{ width: '100%', height: '100%' }}
        />
      </TouchableOpacity>
    ))}
  </View>
  <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', flex: 1 }}>
  <TouchableOpacity
    key={13}
    style={{
      width: windowWidth * 0.15,
      height: windowWidth * 0.61,
      margin: 1,
      borderWidth: 0.5,
      borderRadius: 1,
      //borderColor: '#ccc',
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
    }}
    onPress={() => navigation.navigate('Record', { image: '13', boxindex: boxidx })}
  >
    <Image
      key={13}
      source={targetImages[13]}
      style={{ width: '60%', height: '35%' }}
    />
  </TouchableOpacity>
</View>
  </View>
  
  <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', flex: 1 }}>
        {[...Array(3)].map((_, index) => (
          <TouchableOpacity
            key={index}
            style={{
              width: index === 0 || index === 2 ? windowWidth * 0.15 : windowWidth * 0.45,
              height: windowWidth * 0.15 ,
              margin: 6.5,
              marginTop:13,
              borderWidth: 0.5,
              borderRadius: 1,
              //borderColor: '#ccc',
              overflow: 'hidden',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => navigation.navigate('Record', { image: `${index+14}`, boxindex: boxidx })}
          >
            <Image
              key={index+14}
              source={targetImages[index+14]}
              style={{ width:  index==1 ? '40%' : '110%', height: index==1 ? '50%' : '110%'}}
            />
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', flex: 1 }}>
        {[...Array(2)].map((_, index) => (
          <TouchableOpacity
            key={index}
            style={{
              width: windowWidth * 0.4,
              height: windowWidth * 0.15 ,
              margin: 6.5,
              marginTop:50,
              borderWidth: 0,
              borderRadius: 1,
              //borderColor: '#ccc',
              overflow: 'hidden',
              justifyContent: 'center',

               alignItems: 'center',
            }}
            onPress={() => navigation.navigate('Record', { image: `${index+17}`, boxindex: boxidx })}
          >
            <Image
              key={index+17}
              source={targetImages[index+17]}
              style={{ width: '50%', height: '75%' }}
            />
          </TouchableOpacity>
        ))}
      </View>

  
    </ScrollView>
    </View>
    
    
  );
};

export default TargetSelect;
