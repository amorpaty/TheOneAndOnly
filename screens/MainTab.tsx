import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./HomeScreen";
import ReviewScreen from "./ReviewScreen";
import MyScreen from "./MyScreen";
import Icon from "react-native-vector-icons/MaterialIcons";

const Tab = createBottomTabNavigator();

function MainTab() {
    return (
        <Tab.Navigator initialRouteName="Home" screenOptions={{tabBarActiveTintColor:'#fb8c00', tabBarShowLabel : true,}}>
            <Tab.Screen name="Home" component={HomeScreen} options={{tabBarIcon:({color, size}) => (<Icon name="home" color={color} size={size}></Icon>)}}/>
            <Tab.Screen name="REVIEW" component={ReviewScreen} options={{tabBarIcon:({color, size}) => (<Icon name="edit-note" color={color} size={size}></Icon>)}}/>
            <Tab.Screen name="MY" component={MyScreen} options={{tabBarIcon:({color, size}) => (<Icon name="face" color={color} size={size}></Icon>)}}/>
        </Tab.Navigator>
    );
}

export default MainTab;