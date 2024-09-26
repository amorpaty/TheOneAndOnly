import React from "react";
import { Alert, View } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import FloatingLocationButton from "../components/FloatingLocationButton";
import Geolocation from 'react-native-geolocation-service'; // 현재 위치 추적
import FloatCafeListButton from "../components/FloatingCafeListButton";


/**
 * 24.09.24 최초생성
 * Home 화면 
 * 구글 지도 연동
 * @returns 
 */

const defaultPosition = {
    latitude: 35.91395373474155,
    longitude: 127.73829440215488,
    latitudeDelta: 3,
    longitudeDelta: 3,
}

//TODO
//지도 현재 위치 조회 컴포넌트 구현
function handleOnClick(){

}

function HomeScreen() {
    return (
        <View style={{ flex: 1 }}>
            <MapView    
                style={{ flex: 1 }}
                provider={PROVIDER_GOOGLE}
                initialRegion={defaultPosition}
                showsUserLocation={true}
                showsMyLocationButton={true}
            />
            <FloatCafeListButton />
            <FloatingLocationButton/>
        </View>
    )
}

export default HomeScreen;
