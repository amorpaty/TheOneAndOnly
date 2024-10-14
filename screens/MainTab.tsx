import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./HomeScreen";
import ReviewScreen from "./ReviewScreen";
import MyScreen from "./MyScreen";
import Icon from "react-native-vector-icons/MaterialIcons";
import { BackHandler } from "react-native";

const Tab = createBottomTabNavigator();

function MainTab() {
    // 백 버튼 누름을 처리하는 사용자 정의 로직
    // 기본 동작(예: 앱 종료)을 방지하려면 true를 반환
    // 기본 동작을 허용하려면 false를 반환
    useEffect(()=>{
        BackHandler.addEventListener('hardwareBackPress', () => {
            return true;
        });
    })

    return (
        <Tab.Navigator initialRouteName="Home" screenOptions={{tabBarActiveTintColor:'#57382D', tabBarShowLabel : true, headerShown : false}}>
            <Tab.Screen name="Home" component={HomeScreen} options={{tabBarIcon:({color, size}) => (<Icon name="home" color={color} size={size}></Icon>)}}/>
            <Tab.Screen name="REVIEW" component={ReviewScreen} options={{tabBarIcon:({color, size}) => (<Icon name="edit-note" color={color} size={size}></Icon>)}}/>
            <Tab.Screen name="MY" component={MyScreen} options={{tabBarIcon:({color, size}) => (<Icon name="account-circle" color={color} size={size}></Icon>)}}/>
        </Tab.Navigator>
    );
}

export default MainTab;