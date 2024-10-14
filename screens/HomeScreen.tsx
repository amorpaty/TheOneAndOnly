import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import coffeeIcon from "../assets/src/image/coffeeIcon.png"
import Geolocation from '@react-native-community/geolocation';
import SlidingUpPanel from 'rn-sliding-up-panel';
import CafeMenuSlidingUpPanel from "../components/home/CafeMenuSlidingUpPanel";
import FloatingLocationButton from "../components/home/FloatingLocationButton";
import FloatCafeListButton from "../components/home/FloatingCafeListButton";
import KeywordSearchBar from "../components/home/KeywordSearchBar";
import { getKeywords } from "../lib/keywords";
import {getSearchKeywordCafeList} from "../lib/cafeList";
import Icon from "react-native-vector-icons/MaterialIcons";


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
    //const [cafeInfo, setCafeInfo] = useState({});    

    const cafeListPanelRef = useRef<SlidingUpPanel | null>(null);    
    const cafeInfoPanelRef = useRef<SlidingUpPanel | null>(null);    

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
            setCafePoiList(fetchedCafeList); // 상태에 데이터 저장
        } catch (error) {
            console.error("Failed to fetch fetchCafeList:", error); // 오류 처리
        }
    }

    //키워드 선택 시 키워드에 맞는 카페 조회
    function handleKeywordPress(keyword : Object = {}){
        fetchCafeList(keyword);
    };

    //카카오톡 공유하기 
    function handleShare(seletedCafe : Object = {}){

    }

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
                    <Marker 
                        key={poi.id + Math.random()} 
                        coordinate={{latitude: Number(poi.y), longitude: Number(poi.x)}}
                        icon={coffeeIcon}
                        calloutAnchor={{ x: 0.5, y: 5 }}
                    >
                        {/* 카페 정보 Overlay */}
                        <Callout tooltip={true} style={{ alignItems: 'center'}} >
                            <View style={styles.container}>
                                {/* 카페명 및 주소 */}
                                <View style={styles.titleHeaderContainer}>
                                    <Text style={styles.title}>{poi.place_name}</Text>
                                    <View style={styles.iconContainer}>
                                        <Icon name="ios-share" size={20} style={{color : "black", marginRight : 5}} onPress={() => handleShare(poi)}></Icon>
                                        <Icon name="favorite-border" size={20} style={{color : "black"}}></Icon>
                                    </View>
                                </View>
                                <View style={styles.addressContainer}>
                                    <Text>{poi.road_address_name}</Text>
                                    <Text>{poi.phone}</Text>
                                </View>
                                {/* 이미지들 */}
                                <View style={styles.imagesContainer}>
                                {/* {imageUrls.map((url, index) => (
                                    <Image key={index} source={{ uri: url }} style={styles.image} />
                                ))} */}
                                </View>
                            </View>
                        </Callout>
                    </Marker>
                 ))}
            </MapView>
            <KeywordSearchBar keywords={keywords} handleKeywordPress={handleKeywordPress} />
            <FloatCafeListButton cafeListPanelRef={cafeListPanelRef}/> 
            <FloatingLocationButton handleOnPress={handleOnPress} /> 
            <CafeMenuSlidingUpPanel cafeListPanelRef={cafeListPanelRef}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 300,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    addressContainer : {
       fontSize : 12,         
       paddingTop: 5,
    },
    titleHeaderContainer : {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    iconContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    imagesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 5,
    },
});

export default HomeScreen;
