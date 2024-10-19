import React, { useEffect, useMemo, useRef, useState } from "react";
import { Image, ScrollView, StyleSheet, View, Text, ActivityIndicator } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import coffeeIcon from "../assets/src/image/coffeeIcon.png"
import Geolocation from '@react-native-community/geolocation';
import SlidingUpPanel from 'rn-sliding-up-panel';
import FloatingLocationButton from "../components/home/FloatingLocationButton";
import FloatCafeListButton from "../components/home/FloatingCafeListButton";
import KeywordSearchBar from "../components/home/KeywordSearchBar";
import { getKeywords } from "../lib/keywords";
import { getSearchCafeList, getSearchKeywordCafeList } from "../lib/cafeList";
import Icon from "react-native-vector-icons/MaterialIcons";
import { getUserFavCafe, removeUserFavCafe, setUserFavCafe } from "../lib/userFavCafe";
import AsyncStorage from "@react-native-async-storage/async-storage";


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

function HomeScreen({ route }) {
    const [location, setLocation] = useState(defaultPosition); //지도 현재 위치 조회 컴포넌트 구현
    const [keywords, setKeywords] = useState([]); // 키워드 조회 컴포넌트 구현
    const [cafePoiList, setCafePoiList] = useState([]); // 카페 조회 컴포넌트 구현 (키워드 별)
    const [panelContent, setPanelContent] = useState('cafeList'); // 패널의 콘텐츠 상태
    const [cafeList, setCafeList] = useState([]); // SlidingUpPanel에 표시될 카페 리스트

    const cafeListPanelRef = useRef<SlidingUpPanel | null>(null);

    //로딩되면 키워드 목록과 현재 위치 조회
    useEffect(() => {
        fetchKeywords();
        //getCurrentPosition();
    }, []);

    // parameter 넘어올 시 (특정 카페 조회)
    useEffect(() => {
        if (route.params) {
            const routeParamCafe = route.params.cafe;
            setLocation({ latitude: Number(routeParamCafe.y), longitude: Number(routeParamCafe.x) });
            setCafePoiList([routeParamCafe]);
            setCafeList([routeParamCafe]);
        }
    }, [route])

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
    async function fetchCafeList(selectedTag: Object = {}) {
        try {
            const fetchedCafeList = await getSearchKeywordCafeList(selectedTag.keywordId);  // 비동기 데이터 조회
            setCafePoiList(fetchedCafeList); // 상태에 데이터 저장
        } catch (error) {
            console.error("Failed to fetch fetchCafeList:", error); // 오류 처리
        }
    }

    //키워드 선택 시 키워드에 맞는 카페 조회
    function handleKeywordPress(keyword: Object = {}) {
        fetchCafeList(keyword);
    };

    //카카오톡 공유하기 
    function handleShare(seletedCafe: Object = {}) {

    }

    //카페 패널 표출 정보 open 
    async function openMenuPanel(category: string = "", seletedCafe: Object = {}) {

        if (category === "cafeList") {
            //todo cafeList 조회
            const cafeList = await getSearchCafeList("");
            setCafeList(cafeList);
        } else if (category === "info") {
            setCafeList([seletedCafe]);
        }

        setPanelContent(category);
        setTimeout(() => {
            if (cafeListPanelRef.current) {
                cafeListPanelRef.current?.show(1000);
            }
        }, 2000)
    }

    //카페 찜하기 
    function handleFavoriteCafe(seletedCafe: Object = {}) {
        updateUserFavCafe(seletedCafe);
    }

    //카페 찜 insert delete
    async function updateUserFavCafe(seletedCafe: Object = {}) {

        const userId = await AsyncStorage.getItem("userId");
        const id = seletedCafe.id;
        const userFavCafe = await getUserFavCafe(userId, id);  // 비동기 데이터 조회
        const cafe = { ...seletedCafe };
        const slidingCafeList: any = [];

        if (userFavCafe.length > 0) {
            removeUserFavCafe(userId, id);
            cafe.fav = "N";
        } else {
            setUserFavCafe(userId, id);
            cafe.fav = "Y";
        }

        cafeList.forEach(s => {
            if (s.id == cafe.id) {
                s = cafe;
            }
            slidingCafeList.push(s);
        })

        setCafeList(slidingCafeList);

        const cafePoiCopyList = [...cafePoiList];
        const resultCafeList: Object[] = [];

        cafePoiCopyList.forEach(s => {
            if (s.id == id && s.fav == 'Y') {
                s.fav = 'N'
            } else if (s.id == id && s.fav == 'N') {
                s.fav = 'Y'
            }
            resultCafeList.push(s);
        });

        setCafePoiList(resultCafeList);
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

    //cafeList를 memoized 처리하여 불필요한 재렌더링 방지
    const memoizedCafeList = useMemo(() => {
        return cafeList.map((cafe, index) => (
            <View key={index} style={styles.cafeItem}>
                <View style={styles.headerContainer}>
                    <View style={{}}>
                        <Text style={styles.cafeName}>{cafe.place_name}</Text>
                    </View>
                    <View style={styles.iconContainer}>
                        <Icon name="ios-share" size={20} style={{ color: 'black', }} />
                        <Icon name={cafe.fav === "Y" ? "favorite" : "favorite-border"} size={20} style={{ color: cafe.fav === "Y" ? "red" : "black" }} onPress={() => handleFavoriteCafe(cafe)} />
                    </View>
                </View>
                <View style={styles.tags}>
                    <ScrollView
                        horizontal={true} // 가로 스크롤 활성화
                        showsHorizontalScrollIndicator={false} // 스크롤바 숨기기 (선택 사항)
                        contentContainerStyle={styles.scrollContent} // 스크롤 내용의 스타일
                    >
                        {keywords.map((tag) => (
                            <Text key={tag.keywordId} style={styles.tagText}> #{tag.keywordName} </Text>
                        ))}
                    </ScrollView>
                </View>
                <View style={styles.imageContainer}>
                    {/* {cafe.images && cafe.images.map((image, idx) => (
                        <FastImage
                            key={idx}
                            style={styles.cafeImage}
                            source={{ uri: image }}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                    ))} */}
                </View>
            </View>
        ));
    }, [cafeList]);

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
                        coordinate={{ latitude: Number(poi.y), longitude: Number(poi.x) }}
                        icon={coffeeIcon}
                        calloutAnchor={{ x: 0.5, y: 5 }}
                        onPress={() => openMenuPanel("info", poi)}
                    >
                    </Marker>
                ))}
            </MapView>
            <KeywordSearchBar keywords={keywords} handleKeywordPress={handleKeywordPress} />
            <FloatCafeListButton openMenuPanel={openMenuPanel} />
            <FloatingLocationButton handleOnPress={handleOnPress} />
            {/** 카페 정보 및 검색 슬라이딩패널 */}
            <SlidingUpPanel containerStyle={{ maxHeight: panelContent === "cafeList" ? '100%' : 200, bottom: 0 }} ref={cafeListPanelRef}>
                <View style={styles.slidingUpPanel}>
                    <ScrollView>
                        {panelContent == "cafeList" ?
                            (
                                <View style={styles.searchContainer}>
                                    <Text style={styles.search}>검색어 입력</Text>
                                    <Text style={styles.sort}>인기순</Text>
                                </View>
                            )
                            : null
                        }
                        {/* 카페 리스트 */}
                        {panelContent === "cafeList" && !cafeList.length ? (
                            <ActivityIndicator size="large" color="#0000ff" />
                        ) : (
                            memoizedCafeList
                        )}
                    </ScrollView>
                </View>
            </SlidingUpPanel>
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
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    addressContainer: {
        fontSize: 12,
        paddingTop: 5,
    },
    iconContainer: {
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
    slidingUpPanel: {
        height: '100%',
        color: "#fff",
        backgroundColor: "#fff",
    },
    scrollContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5,
    },
    searchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    search: {
        color: '#888',
    },
    sort: {
        color: '#888',
    },
    cafeItem: {
        padding: 15,
        // borderBottomWidth: 1,
        // borderBottomColor: '#eee',
    },
    cafeName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    status: {
        color: 'red',
    },
    tags: {
        marginTop: 10,
        color: '#999',
    },
    tagText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#3a3b3a',
    },
    imageContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    cafeImage: {
        width: 100,
        height: 100,
        marginRight: 10,
        borderRadius: 10,
    },
});

export default HomeScreen;
