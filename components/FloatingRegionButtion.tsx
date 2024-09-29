import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';

function FloatingRegionButtion(){
    return (
        <View style={styles.wrapper}>
            <Pressable style = {({pressed})=> [
                styles.button,
                Platform.OS === 'ios' && {
                    opacity : pressed ? 0.1 : 0.2,
                }
            ]}
            android_ripple={{color :  'white'}}>
            <Text style={styles.text}>
                    지역{"\n"}설정
            </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper : {
        borderRadius : 8,
    },
    button : {
        width : 40,
        height : 40,
        borderRadius : 8,
        backgroundColor : '#57382D',
        justifyContent : 'center',
        alignItems : 'center',
    },
    text : {
        fontSize : 11,
        color : 'white',
        fontWeight : '500',
    },
});

export default FloatingRegionButtion;

