import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';

//카페목록 버튼
function FloatingCafeListButton({cafeListPanelRef}){
    return (
        <View style={styles.wrapper}>
            <Pressable style = {({pressed})=> [
                styles.button,
                Platform.OS === 'ios' && {
                    opacity : pressed ? 0.1 : 0.2,
                }
            ]}
            android_ripple={{color :  '#57382D'}}
            onPress={() => cafeListPanelRef.current.show()}
            >
            <Icon name="menu" size={24} style={styles.icon} />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper : {
        position : 'absolute',
        bottom : 16,
        right : 16,
        width : 48,
        height : 48,
        borderRadius : 10,
        //ios 전용 그림자 설정
        shadowColor : 'black',
        shadowOffset :{width : 1, height:4},
        shadowOpacity : 3,
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
        backgroundColor : 'white',
        justifyContent : 'center',
        alignItems : 'center',
    },
    icon : {
        color : 'black'
    }
});

export default FloatingCafeListButton;

