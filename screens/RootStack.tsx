import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTab from "./MainTab";
import SignInScreen from "./SignInScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createNativeStackNavigator();

function RootStack({isLogin}) {
    return (
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
        </Stack.Navigator>
    );
}

export default RootStack;