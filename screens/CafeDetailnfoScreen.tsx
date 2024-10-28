import React from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Icon from "react-native-vector-icons/MaterialIcons";
import coffeeIcon from "../assets/src/image/coffeeIcon.png"

/**
 * 24.10.20
 * Home 화면 -> CafeDetailInfo (카페 정보) 화면 UI 생성
 * @returns 
 */
function CafeDetailInfoScreen({route}) {
    const { cafeInfo } = route.params;

    return (
      <View style={styles.container}>
        {/* 카페 정보 */}
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Icon name="category" size={20} color="black" />
            <Text style={styles.infoText}>
              {cafeInfo.category_name}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="location-on" size={20} color="black" />
            <Text style={styles.infoText}>
               {cafeInfo.road_address_name}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="call" size={20} color="black" />
            <Text style={styles.infoText}>
                {cafeInfo.phone ? cafeInfo.phone : "-"}
            </Text>
          </View>
        </View>

        {/* 지도 */}
        <View style={styles.mapContainer}>
          <View style={styles.mapWrapper}>
            <MapView
              style={styles.mapView}
              provider={PROVIDER_GOOGLE}
              region={{
                latitude: Number(cafeInfo.y),
                longitude: Number(cafeInfo.x),
                latitudeDelta: 0.00,
                longitudeDelta: 0.002,
              }}
            >
              <Marker
                coordinate={{ latitude: Number(cafeInfo.y), longitude: Number(cafeInfo.x) }}
                icon={coffeeIcon}
              >
              </Marker>
            </MapView>
          </View>  
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  infoContainer: {
    marginTop: 16,
    padding : 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 8,
    marginRight : 8,
    fontSize: 14,
    color: '#333',
  },
  openNow: {
    color: 'red',
    fontWeight: 'bold',
  },
  mapContainer: {
    flex: 1,
    width: "100%",
    marginTop: 16,
    alignItems: "center",
  },
  mapWrapper: {
    width: "100%",
    height: 300,
    borderRadius: 16, // 원하는 borderRadius 값 설정
    overflow: "hidden", // 자식 뷰가 경계를 벗어나지 않도록 함
  },
  mapView: {
    width: "100%",
    height: 300, // 높이 설정 (원하는 크기로 조정 가능)
    borderRadius: 8,
  },
});
export default CafeDetailInfoScreen;
