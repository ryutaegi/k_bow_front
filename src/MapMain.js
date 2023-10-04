import React from "react";
import { StyleSheet, View } from "react-native";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";

const MapMain = ({}) => {
  return (
    <>
      <View style={styles.container}>
        <MapView
          initialRegion={{
            latitude: 37.6334,
            longitude: 127.0781,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          style={styles.map}
        >
          <Marker
            coordinate={{
              latitude: 37.6334,
              longitude: 127.0781,
            }}
            //pinColor="#2D63E2"
            title="붕어방"
            description="다이빙 명소"
          />
        </MapView>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
export default MapMain;
