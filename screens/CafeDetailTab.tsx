import React, { useCallback, useEffect, useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import CafeDetailInfoScreen from "./CafeDetailnfoScreen";
import CafeKeywordAnalysisScreen from "./CafeKeywordAnalysisScreen";
import CafeMenuScreen from "./CafeMenuScreen";
import CafePictureScreen from "./CafePirctureScreen";
import CafeReviewScreen from "./CafeReviewScreen";
import { Alert, BackHandler, StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserFavCafe, removeUserFavCafe, setUserFavCafe } from "../lib/userFavCafe";
import { useFocusEffect } from "@react-navigation/native";


/**
 * 24.10.20
 * Home 화면 -> CafeDetailTab 화면 UI 생성
 * @returns 
 */

const Tab = createMaterialTopTabNavigator();

function CafeDetailTab({navigation, route}) {

    const [cafeInfo, setCafeInfo] = useState([route.params.cafe]);

    //*
    useFocusEffect(
        useCallback(() => {
            const onBeforeRemove = (e) => {

                console.log("route.params.backScreen", route.params)
                if(route.params.backScreen == "Home"){
                  route.params.Params(cafeInfo);
                }else if(route.params.backScreen == "MyFav"){
                  route.params.Params();
                }
            };

            // 이벤트 리스너 추가
            const unsubscribe = navigation.addListener('beforeRemove', onBeforeRemove);

            // 언마운트 시 리스너 제거
            return unsubscribe;
        }, [navigation])
    );

    useEffect(() => {
      navigation.setOptions({
        title: route.params.cafe.place_name,
        headerRight : () => (
          <View style={styles.iconContainer}>
            <Icon name="ios-share" size={20} style={{ color: 'black', }} />
            <Icon name={cafeInfo[0].fav === "Y" ? "favorite" : "favorite-border"} size={20} style={{ color: cafeInfo[0].fav === "Y" ? "red" : "black" }} onPress={() => handleFavoriteCafe(cafeInfo[0])} />
          </View>
        )
      });
    }, [cafeInfo]);

    //카페 찜하기 
    function handleFavoriteCafe(seletedCafe: Object = {}) {
        updateUserFavCafe(seletedCafe);
    }

    //카페 찜 insert delete
    async function updateUserFavCafe(seletedCafe: Object = {}) {
        const userId = await AsyncStorage.getItem("userId");
        const id = seletedCafe.id;
        const userFavCafe = await getUserFavCafe(userId, id);  // 비동기 데이터 조회
        const cafe = seletedCafe;

        if (userFavCafe.length > 0) {
            removeUserFavCafe(userId, id);
            cafe.fav = "N";
        } else {
            setUserFavCafe(userId, id);
            cafe.fav = "Y";
        }

        setCafeInfo([cafe]);  
    }

    return (
      <Tab.Navigator initialRouteName="CafeInfo" screenOptions={{tabBarActiveTintColor:'#57382D', tabBarLabelStyle : {fontWeight : "bold"}, tabBarShowLabel : true}}>
        <Tab.Screen name="CafeInfo" component={CafeDetailInfoScreen} options={{title : "카페 정보"}}/>
        <Tab.Screen name="CafeKeywordAnalysis" component={CafeKeywordAnalysisScreen} options={{title : "키워드\n분석"}}/>
        <Tab.Screen name="CafeMenu" component={CafeMenuScreen} options={{title : "메뉴"}}/>
        <Tab.Screen name="CafeReview" component={CafeReviewScreen} options={{title : "리뷰"}}/>
        <Tab.Screen name="CafePicture" component={CafePictureScreen} options={{title : "사진"}}/>
      </Tab.Navigator>
    );
}


const styles = StyleSheet.create({
  iconContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
  },
})


export default CafeDetailTab;
