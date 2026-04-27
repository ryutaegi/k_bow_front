import React from 'react';
import { View, TouchableOpacity, Image, ScrollView, Text } from 'react-native';
import { Dimensions } from 'react-native';

const Target_select = ({ navigation, route }) => {
  const { boxidx } = route.params;
  const targetImages = [
    require('../images/target/img1.png'),
    require('../images/target/img2.png'),
    require('../images/target/img3.png'),
    require('../images/target/img4.png'),
    require('../images/target/img5.png'),
    require('../images/target/img6.png'),
    require('../images/target/img7.png'),
    require('../images/target/img8.png'),
    require('../images/target/img9.png'),
  ];

  const windowWidth = Dimensions.get('window').width;
  const CELL_W = Math.floor(windowWidth * 0.15);
  const CELL_H = Math.floor(windowWidth * 0.2);
  const TARGET = CELL_H * 3;
  const GRID_W = CELL_W * 3;

  const arrowBtn = (label, imageIdx, style) => (
    <TouchableOpacity
      style={[{
        backgroundColor: '#f2f2f2',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 2,
      }, style]}
      onPress={() => navigation.navigate('RecordMain', { image: `${imageIdx}`, boxindex: boxidx })}
      activeOpacity={0.6}
    >
      <Text style={{ fontSize: 26, fontWeight: '900', color: '#555' }}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={{ padding: 20, marginTop: 50 }}>

        {/* 상단 행: ↖ / ↑ / ↗ */}
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          {arrowBtn('↖', 0, { width: CELL_W, height: CELL_W })}
          {arrowBtn('↑', 1, { width: GRID_W, height: CELL_W })}
          {arrowBtn('↗', 2, { width: CELL_W, height: CELL_W })}
        </View>

        {/* 중간 행: ← / 과녁 3x3 / → */}
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          {arrowBtn('←', 3, { width: CELL_W, height: TARGET })}

          {/* 과녁 3x3 */}
          <View style={{ flexDirection: 'row', margin: 2 }}>
            {[0, 1, 2].map((col) => (
              <View key={col} style={{ flexDirection: 'column', width: CELL_W }}>
                {[0, 1, 2].map((row) => (
                  <TouchableOpacity
                    key={col * 3 + row}
                    style={{ width: CELL_W, height: CELL_H, overflow: 'hidden' }}
                    onPress={() => navigation.navigate('RecordMain', { image: `${col * 3 + row + 4}`, boxindex: boxidx })}
                  >
                    <Image
                      source={targetImages[col * 3 + row]}
                      style={{ width: '100%', height: '100%' }}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>

          {arrowBtn('→', 13, { width: CELL_W, height: TARGET })}
        </View>

        {/* 하단 행: ↙ / ↓ / ↘ */}
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          {arrowBtn('↙', 14, { width: CELL_W, height: CELL_W })}
          {arrowBtn('↓', 15, { width: GRID_W, height: CELL_W })}
          {arrowBtn('↘', 16, { width: CELL_W, height: CELL_W })}
        </View>

        {/* 중 / 不 버튼 */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 40 }}>
          <TouchableOpacity
            style={{
              width: windowWidth * 0.38,
              height: 56,
              backgroundColor: '#4a4a4a',
              borderRadius: 12,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => navigation.navigate('RecordMain', { image: '18', boxindex: boxidx })}
          >
            <Text style={{ color: '#fff', fontSize: 32, fontWeight: 'bold' }}>不</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: windowWidth * 0.38,
              height: 56,
              backgroundColor: '#e8342a',
              borderRadius: 12,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => navigation.navigate('RecordMain', { image: '17', boxindex: boxidx })}
          >
            <Text style={{ color: '#fff', fontSize: 32, fontWeight: 'bold' }}>中</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
};

export default Target_select;
