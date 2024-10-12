import React, { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import MapView, { MapMarker, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Geolocation from '@react-native-community/geolocation';
import SlidingUpPanel from 'rn-sliding-up-panel';
import CafeMenuSlidingUpPanel from "../components/home/CafeMenuSlidingUpPanel";
import FloatingLocationButton from "../components/home/FloatingLocationButton";
import FloatCafeListButton from "../components/home/FloatingCafeListButton";
import KeywordSearchBar from "../components/home/KeywordSearchBar";
import { getKeywords } from "../lib/keywords";
import {getSearchKeywordCafeList} from "../lib/cafeList";
import coffeeIcon from "../assets/src/image/coffeeIcon.png"


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
    const [cafePoiList, setCafePoiList] = useState([]);
    const [cafeInfoPanelMaxHeight, setCafeInfoPanelMaxHeight] = useState("100%");
    const cafeListPanelRef = useRef<SlidingUpPanel | null>(null);    

    //로딩되면 키워드 목록과 현재 위치 조회
    useEffect(() => {
        fetchKeywords();
        //getCurrentPosition();
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
            const fetchedCafeList = await getSearchKeywordCafeList(selectedTag.keywordId);  // 비동기 데이터 조회
            setCafePoiList(Object(fetchedCafeList)); // 상태에 데이터 저장
        } catch (error) {
            console.error("Failed to fetch fetchCafeList:", error); // 오류 처리
        }
    }

    //키워드 선택 시 키워드에 맞는 카페 조회
    function handleKeywordPress(keyword : string = ""){
        fetchCafeList(keyword);
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

    /**
     * 카페 리스트 버튼 클릭 시 SlidingPanel show
     */
    function cafeListPanelShow(){
        setCafeInfoPanelMaxHeight("100%")
        cafeListPanelRef.current?.show(10000);
    }

    /**
     * 카페 POI 클릭 시 SlidingPanel show
     */
    function cafeInfoPanelShow(){
        setCafeInfoPanelMaxHeight("30%")
        cafeListPanelRef.current?.show(10000);
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
                    <Marker 
                        key={poi.id} 
                        coordinate={{latitude: Number(poi.y), longitude: Number(poi.x)}}
                        icon={coffeeIcon}
                        onPress={cafeInfoPanelShow}
                    />
                 ))}

            </MapView>
            <KeywordSearchBar keywords={keywords} handleKeywordPress={handleKeywordPress} />
            <FloatCafeListButton cafeListPanelShow={cafeListPanelShow}/> 
            <FloatingLocationButton handleOnPress={handleOnPress} /> 
            <CafeMenuSlidingUpPanel cafeListPanelRef={cafeListPanelRef} maxHeight={cafeInfoPanelMaxHeight} /> 
        </View>
    )

}

export default HomeScreen;
