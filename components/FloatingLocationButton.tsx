import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';

function FloatingLocationButton({handleOnPress}){
    return (
        <View style={styles.wrapper}>
            <Pressable style = {({pressed})=> [
                styles.button,
                Platform.OS === 'ios' && {
                    opacity : pressed ? 0.6 : 1,
                }
            ]}
            android_ripple={{color :  'white'}}
            onPress={handleOnPress}>
            <Icon name="location-searching" size={24} style={styles.icon} />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper : {
        position : 'absolute',
        bottom : 76,
        right : 16,
        width : 48,
        height : 48,
        borderRadius : 10,
        //ios 전용 그림자 설정
        shadowColor : 'black',
        shadowOffset :{width : 0, height:4},
        shadowOpacity : 0.3,
        shadowRadius : 4,
        //안드로이드 전용 그림자 설정 
        elevation : 5,
        //안드로이드에서 물결효고가가 영역 밖으로 나가지 않도록 설정 
        //ios에서는 overflow가 hidden일 경우 그림자가 보여지지 않음
        overflow : Platform.select({android : 'hidden'})
    },
    button : {
        width : 48,
        height : 48,
        borderRadius : 10,
        backgroundColor : '#57382D',
        justifyContent : 'center',
        alignItems : 'center',
    },
    icon : {
        color : 'white'
    }
});

export default FloatingLocationButton;

