import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MyFavoriteCafeScreen from "./MyFavoriteCafeScreen";
import MyScreen from "./MyScreen";

const Stack = createNativeStackNavigator();

function Mystack() {
    return (
        <Stack.Navigator initialRouteName="MyScreen" >
            <Stack.Screen
                name="MyScreen"
                component={MyScreen}
                options={{headerShown : false}}
            />
            <Stack.Screen 
                name="MyFavoriteCafeScreen"
                component={MyFavoriteCafeScreen}
                options={{headerShown : false}}
            />
        </Stack.Navigator>
    );
}

export default Mystack;