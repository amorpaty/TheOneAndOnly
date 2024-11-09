import React, { useCallback, useContext, useEffect, useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import CafeDetailInfoScreen from "./CafeDetailnfoScreen";
import CafeKeywordAnalysisScreen from "./CafeKeywordAnalysisScreen";
import CafeMenuScreen from "./CafeMenuScreen";
import CafePictureScreen from "./CafePirctureScreen";
import CafeReviewScreen from "./CafeReviewScreen";
import { StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserFavCafe, removeUserFavCafe, setUserFavCafe } from "../lib/userFavCafe";
import { CafeContext } from "../components/CafeContext";
import { saveUserRecentCafes } from "../lib/userRecentCafes";


/**
 * 24.10.20
 * Home 화면 -> CafeDetailTab 화면 UI 생성
 * @returns 
 */

const Tab = createMaterialTopTabNavigator();

function CafeDetailTab({navigation, route}) {
    const [ cafe, setCafeInfo ] = useState(route.params.cafe);
    const { cafePoiList, setCafePoiList, cafeList, setCafeList } = useContext(CafeContext);

    useEffect(() => {
      navigation.setOptions({
        title: route.params.cafe.place_name,
        headerRight : () => (
          <View style={styles.iconContainer}>
            <Icon name="ios-share" size={20} style={{ color: 'black', }} />
            <Icon name={cafe.fav === "Y" ? "favorite" : "favorite-border"} size={20} style={{ color: cafe.fav === "Y" ? "red" : "black" }} onPress={() => handleFavoriteCafe(cafe)} />
          </View>
        )
      });

      // 최근 조회한 카페 저장
      async function saveRecentlyViewed(cafe : Object){
        const userId = await AsyncStorage.getItem("userId");
        let cafeViewed = {userId : userId, id : cafe.id, viewAt : getNowDate()};
        
        // 카페 DB 저장
        await saveUserRecentCafes(cafeViewed);
      };
   
      saveRecentlyViewed(cafe);

    }, [cafe]);

    //카페 찜하기 
    function handleFavoriteCafe(seletedCafe: Object = {}) {
        updateUserFavCafe(seletedCafe);
    }

    //카페 찜 insert delete
    async function updateUserFavCafe(seletedCafe: Object = {}) {
        const userId = await AsyncStorage.getItem("userId");
        const id = seletedCafe.id;
        const userFavCafe = await getUserFavCafe(userId, id);  // 비동기 데이터 조회

        if (userFavCafe.length > 0) {
            removeUserFavCafe(userId, id);
        } else {
            setUserFavCafe(userId, id);
        }

        handleUpdate();  
    }
    
    const handleUpdate = () => {
      const updatedCafe = { ...cafe, fav: cafe.fav === "Y" ? "N" : "Y" };
      let poiList : Object[] = [];

      cafePoiList.forEach(s => {
          let poi = s;
          if(s.id == cafeList.id){
              poi = cafeList;
          }
          poiList.push(poi);
      })

      setCafePoiList(poiList);
      setCafeList([updatedCafe]);  
      setCafeInfo(updatedCafe);
    };

    // 현재 시간 생성    
    function getNowDate(){
      const date = new Date();
      return date;
    }

    return (
      <Tab.Navigator initialRouteName="CafeInfo" screenOptions={{tabBarLabelStyle : {fontWeight : "bold"}, tabBarShowLabel : true}}>
        <Tab.Screen name="CafeInfo" component={CafeDetailInfoScreen} initialParams={{ cafeInfo: cafe }} options={{title : "카페 정보"}}/>
        <Tab.Screen name="CafeKeywordAnalysis" component={CafeKeywordAnalysisScreen} options={{title : "키워드\n분석"}}/>
        <Tab.Screen name="CafeMenu" component={CafeMenuScreen} initialParams={{ cafeInfo: cafe }} options={{title : "메뉴"}}/>
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
