import React, { useEffect } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import CafeDetailInfoScreen from "./CafeDetailnfoScreen";
import { Title } from "react-native-paper";
import CafeKeywordAnalysisScreen from "./CafeKeywordAnalysisScreen";
import CafeMenuScreen from "./CafeMenuScreen";
import CafePictureScreen from "./CafePirctureScreen";
import CafeReviewScreen from "./CafeReviewScreen";

/**
 * 24.10.20
 * Home 화면 -> CafeDetailTab 화면 UI 생성
 * @returns 
 */

const Tab = createMaterialTopTabNavigator();

function CafeDetailTab({navigation, route}) {

    useEffect(() => {
      navigation.setOptions({title: route.params.cafe.place_name});
    }, [navigation]);

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
export default CafeDetailTab;
