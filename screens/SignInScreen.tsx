import React from "react";
import { View, Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import {getProfile, login } from "@react-native-seoul/kakao-login";
import logo from "../assets/src/image/logo.png";
import kakaoLoginButtonImg from "../assets/src/image/kakaoLoginButton.png";
import googleLoginButtonImg from "../assets/src/image/googleLoginButton.png";
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getEmailUser, getUser, setUser } from "../lib/user";
import uuid from 'react-native-uuid';

/**
 * 24.10.07 
 * 로그인 화면 생성
 * @returns 
 */
function SignInScreen({navigation}){

    //카카오 로그인
    async function signInWithKakao(){
        try {
            const token = await login().catch((error) => console.log("SignIn error", error));

            if(!!!token){ 
              return;
            }

            const userInfo = await getProfile().catch((error) => console.log("getProfile error", error));

            if(!!!userInfo){
              return; 
            }

            const user = await getEmailUser(userInfo.email);
            let userId : string = "" ;
            if(user.length == 0){
              userId = await setUser({email : userInfo.email, nickname : userInfo.nickname})
            }

            console.log(" user[0].userId ", user) 

            AsyncStorage.setItem('key', JSON.stringify(token));
            AsyncStorage.setItem("userId", user.length == 0 ? userId.toString() : user[0].userId.toString());
            AsyncStorage.setItem('howLogin', "kakao");
            
            navigation.navigate('MainTab');

          } catch (err) {
            console.error("login err", err);
          }
    }

    /**
     * TODO
     * 구글 로그인 
     */
    async function signInWithGoogle() {
        
    }

    return (
        <View style={styles.container}>
            <Image source={logo}></Image>
            <Text style={styles.subText}>{"\n\n"}나도 모르는 유일무이한 {"\n"}내 카페 취향은?</Text>
    
            {/* 카카오 로그인 버튼 */}
            <TouchableOpacity onPress={signInWithKakao}>
                <Image source={kakaoLoginButtonImg}/>
            </TouchableOpacity>

            {/* 구글 로그인 버튼 */}
            <TouchableOpacity onPress={signInWithGoogle}>
                <Image source={googleLoginButtonImg}/>
            </TouchableOpacity>      
      </View>
    )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#57382D', // 이미지에서 본 갈색 배경
      alignItems: 'center',
      justifyContent: 'center',
    },
    subText: {
      color: '#fff',
      fontSize: 16,
      marginBottom: 50,
      textAlign : "center"
    },
  });

export default SignInScreen;