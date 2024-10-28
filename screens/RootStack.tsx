import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CafeProvider } from '../components/CafeContext';

import MainTab from "./MainTab";
import SignInScreen from "./SignInScreen";
import MyFavoriteCafeScreen from "./MyFavoriteCafeScreen";
import CafeDetailTab from "./CafeDetailTab";
import MyUserRecentCafeScreen from "./MyUserRecentCafeScreen";

const Stack = createNativeStackNavigator();

function RootStack({isLogin}) {
    return (
        <CafeProvider>
            <Stack.Navigator initialRouteName={isLogin === true? 'MainTab' : 'SignInScreen'} >
                <Stack.Screen
                    name="SignInScreen"
                    component={SignInScreen}
                    options={{headerShown : false}}
                />
                <Stack.Screen 
                    name="MainTab"
                    component={MainTab}
                    options={{headerShown : false}}
                />
                <Stack.Screen 
                    name="CafeDetailTab"
                    component={CafeDetailTab}
                    options={{headerShown : true}}
                />      
                <Stack.Screen 
                    name="MyUserRecentCafeScreen"
                    component={MyUserRecentCafeScreen}
                    options={{headerShown : true, headerTitle : "최근 본 카페"}}
                />
                <Stack.Screen 
                    name="MyFavoriteCafeScreen"
                    component={MyFavoriteCafeScreen}
                    options={{headerShown : true, headerTitle : "찜한 카페"}}
                />
            </Stack.Navigator>
        </CafeProvider>
    );
}

export default RootStack;