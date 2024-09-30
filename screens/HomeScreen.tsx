import React, { useEffect, useState } from "react";
import { View } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import Geolocation from '@react-native-community/geolocation';
import FloatingLocationButton from "../components/FloatingLocationButton";
import FloatCafeListButton from "../components/FloatingCafeListButton";
import KeywordSearchBar from "../components/KeywordSearchBar";
import { getKeywords } from "../lib/keywords";

/**
 * 24.09.24 최초생성
 * Home 화면 
 * 구글 지도 연동
 * @returns 
 */

const defaultPosition = {
    latitude: 37.541,
    longitude: 126.986
    //latitudeDelta: 3,
    //longitudeDelta: 3,
}

function HomeScreen() {
    //지도 현재 위치 조회 컴포넌트 구현
    const [location, setLocation] = useState(defaultPosition);
    const [keywords, setKeywords] = useState([]);
        
    //키워드 목록 가져오기
    async function fetchKeywords() {
        try {
            const fetchedKeywords = await getKeywords();  // 비동기 데이터 조회
            setKeywords(Object(fetchedKeywords)); // 상태에 데이터 저장
        } catch (error) {
            console.error("Failed to fetch keywords:", error); // 오류 처리
        }
    }

    //로딩되면 바로 현재 위치 조회
    useEffect(() => {
        fetchKeywords();
        getLocation();
    }, []);

    //위치 버튼 클릭 시 해당 컴포넌트 실행
    function handleOnPress(){ 
        getLocation();
    }

    //사용자의 현재 위치 조회
    function getLocation(){
        Geolocation.getCurrentPosition(position => {
            //불변성을 지키면서 위치 변경
            const loc = {...location, latitude : position.coords.latitude, longitude : position.coords.longitude};
            setLocation(loc);
        },
        error => { console.log(error.code, error.message); },
        {enableHighAccuracy:true, timeout: 15000, maximumAge: 10000 },
        )
    }

    return (
        <View style={{ flex: 1 }}>
            <MapView    
                style={{ flex: 1 }}
                provider={PROVIDER_GOOGLE}
                region={{
                    latitude : location.latitude,
                    longitude : location.longitude,
                    latitudeDelta: 0.03,
                    longitudeDelta: 0.02,
                }}                  
                showsUserLocation={true}
                showsMyLocationButton={false}
            />
            <KeywordSearchBar keywords={keywords}/>
            <FloatCafeListButton />
            <FloatingLocationButton handleOnPress={handleOnPress}/>
        </View>
    )
    
}

export default HomeScreen;
