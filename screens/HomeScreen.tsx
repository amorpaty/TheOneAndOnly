import React, { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import MapView, { MapMarker, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Geolocation from '@react-native-community/geolocation';
import FloatingLocationButton from "../components/home/FloatingLocationButton";
import FloatCafeListButton from "../components/home/FloatingCafeListButton";
import KeywordSearchBar from "../components/home/KeywordSearchBar";
import { getKeywords } from "../lib/keywords";
import {getSearchKeywordCafeList} from "../lib/cafeList";

import SlidingUpPanel from 'rn-sliding-up-panel';
import CafeMenuSlidingUpPanel from "../components/home/CafeMenuSlidingUpPanel";

/**
 * 24.09.24 최초생성
 * Home 화면 
 * 구글 지도 연동
 * @returns 
 */
const defaultPosition = {
    latitude: 37.541,
    longitude: 126.986
}

function HomeScreen() {
    //지도 현재 위치 조회 컴포넌트 구현
    const [location, setLocation] = useState(defaultPosition);
    const [keywords, setKeywords] = useState([]);
    const [selectedTag, setSelectedTag] = useState("");
    const [cafePoiList, setCafePoiList] = useState([]);

    const panelRef = useRef<SlidingUpPanel | null>(null);      

    //로딩되면 키워드 목록과 현재 위치 조회
    useEffect(() => {
        fetchKeywords();
        getCurrentPosition();
    }, []);

    //키워드 목록 가져오기
    async function fetchKeywords() {
        try {
            const fetchedKeywords = await getKeywords();  // 비동기 데이터 조회
            setKeywords(Object(fetchedKeywords)); // 상태에 데이터 저장
        } catch (error) {
            console.error("Failed to fetch keywords:", error); // 오류 처리
        }
    }

    /**
     * 키워드에 맞는 카페 조회 (firestore)
     */
    async function fetchCafeList(selectedTag : Object = {}){
        try {

            console.log("keywordId", selectedTag.keywordId)
            const fetchedCafeList = await getSearchKeywordCafeList(selectedTag.keywordId);  // 비동기 데이터 조회

            console.log("fetchedCafeList", fetchedCafeList)
            setCafePoiList(Object(fetchedCafeList)); // 상태에 데이터 저장

        } catch (error) {
            console.error("Failed to fetch fetchCafeList:", error); // 오류 처리
        }
    }

    //키워드 선택 시 키워드에 맞는 카페 조회
    function handleKeywordPress(keyword : string = ""){
        setSelectedTag(keyword);
        fetchCafeList(selectedTag);
    };

    //위치 버튼 클릭 시 해당 컴포넌트 실행
    function handleOnPress() {
        getCurrentPosition();
    }

    //사용자의 현재 위치 조회
    function getCurrentPosition() {
        Geolocation.getCurrentPosition(position => {
            //불변성을 지키면서 위치 변경
            const loc = { ...location, latitude: position.coords.latitude, longitude: position.coords.longitude };
            setLocation(loc);
        },
            error => { console.log(error.code, error.message); },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        )
    }

    return (
        <View style={{ flex: 1 }}>
            <MapView
                style={{ flex: 1 }}
                provider={PROVIDER_GOOGLE}
                region={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.03,
                    longitudeDelta: 0.02,
                }}
                showsUserLocation={true}
                showsMyLocationButton={false}
            >
                {/**
                 * 카페 POI 표출 
                 */}
                {cafePoiList.map((poi) => (
                    <Marker coordinate={{latitude: Number(poi.y), longitude: Number(poi.x)}}
                        title="this is a marker"
                        description="this is a marker example"
                    />
                 ))}

            </MapView>
            <KeywordSearchBar keywords={keywords} handleKeywordPress={handleKeywordPress} />
            <FloatCafeListButton panelRef={panelRef} /> 
            <FloatingLocationButton handleOnPress={handleOnPress} /> 
            <CafeMenuSlidingUpPanel panelRef={panelRef} /> 
        </View>
    )

}

export default HomeScreen;
