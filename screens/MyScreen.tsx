import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getProfile, logout, unlink } from "@react-native-seoul/kakao-login";
import { getUser, removeUser } from "../lib/user";
import { Divider } from "react-native-paper";

/**
 * 24.10.06
 * MY 화면 UI 생성
 * @returns 
 */
function MyScreen({navigation}) {

    const [userInfo, setUserInfo] = useState({}); //유저 정보 저장

    /**
     * 진입 시 user정보(profile, nicname) 가져오기
     */
    useEffect(() => {
        
        // 유저 정보 조회
        async function getUserInfo(){
            const howLogin = await AsyncStorage.getItem("howLogin"); 

            if(howLogin === "kakao"){//카카오 유저정보 조회
                const profile = await getProfile();
                setUserInfo(profile);
            }else if(howLogin === "google"){//구글 유저정보 조회
            }
        }

        getUserInfo();
    }, [])

    /**
     * 로그아웃 Alert
     */
    function handleLogOut(){
        Alert.alert("", "로그아웃 하시겠습니까?",
            [
                {text: 'Cancel', onPress: () => {}, style: 'cancel'},
                {
                  text: 'OK',
                  onPress: setLogout,
                  style: 'destructive',
                },
              ],
        );
    }

    // 로그인 경로에 따른 분기 처리
    async function setLogout(){
        let howLogin =  await AsyncStorage.getItem("howLogin");

        if(howLogin === "kakao"){
            logoutWithKakao();
        }else if(howLogin === "googole"){
            logoutWithGoogle();    
        }
    }

    /**
     * 카카오 로그아웃 
     */
    async function logoutWithKakao(){
        const result = await logout();
        if(result === "Successfully logged out"){
            navigation.navigate("SignInScreen");
            AsyncStorage.clear();
        }``
    }

    /**
     * 구글 로그아웃
     */
    async function logoutWithGoogle(){

        
    }

    //탈퇴하기(연결해제) Alert
    function handleUnlink(){
        Alert.alert("", "탈퇴 하시겠습니까?",
            [
                {text: 'Cancel', onPress: () => {}, style: 'cancel'},
                {
                  text: 'OK',
                  onPress: setUnlink,
                  style: 'destructive',
                },
              ],
        );
    }

    // 로그인 경로에 따른 탈퇴 분기 처리
    async function setUnlink(){
        let howLogin =  await AsyncStorage.getItem("howLogin");

        if(howLogin === "kakao"){
            unLinkWithKakao();
        }else if(howLogin === "googole"){
            unLinkWithGoogle();    
        }        
    }

    //카카오톡 연결 해제 
    async function unLinkWithKakao(){

        const userId =  await AsyncStorage.getItem("userId");
        const userInfo = await getUser(userId);

        if(userInfo.length == 0){
            return;
        }

        removeUser(userInfo[0].id);
        const result = await unlink(userInfo[0].email);

        console.log("result", result);
        if(result === "Successfully unlinked"){
            navigation.navigate("SignInScreen");
            AsyncStorage.clear();
        }
    }

    //구글 연결 해제 
    async function unLinkWithGoogle(){

    }

    return (
        <View style={{flex : 1}}>
            {/* 사용자 정보 카드 */}
            <View style={styles.card}>
                <View style={styles.profileContainer}>
                    {userInfo.thumbnailImageUrl != null ?
                        <Image src={userInfo.thumbnailImageUrl} style={styles.profileImage}/>
                    : null}
                </View>
                <Text style={styles.greeting}>안녕하세요 {userInfo.nickname}님 :)</Text>
                <Text style={styles.description}>홍길동님의 활동내역을 통해 분석한 {"\n"}취향 카페 TOP 3 입니다.</Text>
                <View style={styles.tagContainer}>
                    <TouchableOpacity style={styles.tagButton}>
                        <Text style={styles.tagText}># 모던한</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tagButton}>
                        <Text style={styles.tagText}># 커피 맛집</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tagButton}>
                        <Text style={styles.tagText}># 노키즈존</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* 메뉴 리스트 */}
            <View style={styles.menu}>
                <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuText}>최근 조회한 카페</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuText}>찜한 카페</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuText}>카페 방문 로그</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuText}>1:1 문의내역</Text>
                </TouchableOpacity>
                <Divider style={{margin : 17}}></Divider>
                <TouchableOpacity style={styles.menuTopMarginItem} onPress={handleLogOut} >
                    <Text style={styles.menuText}>로그아웃</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={handleUnlink} >
                    <Text style={styles.menuText}>탈퇴하기</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create ({
    profileContainer : {
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden', // 부모 컨테이너에서 이미지가 넘치지 않도록 설정
        paddingBottom : 10
    }, 
    profileImage : {
        width: 50, 
        height: 50, 
        borderRadius: 50 / 2,
        resizeMode: 'cover', // 이미지를 커버로 설정하여 크기에 맞게 채움
    },
    card: {
        backgroundColor: '#57382D',
        padding: 20,
        borderRadius: 10,
        margin: 20,
        alignItems: 'center',
    },
    greeting: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    description: {
        fontSize: 14,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 20,
    },
    tagContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    tagButton: {
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        marginHorizontal: 5,
    },
    tagText: {
        fontSize: 14,
        color: '#57382D',
    },
    menu: {
        marginHorizontal: 20,
        marginTop: 20,
    },
    menuTopMarginItem :{
        backgroundColor: '#fff',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginTop : 5,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    menuItem: {
        backgroundColor: '#fff',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    menuText: {
        fontSize: 16,
        color: '#333',
    },
})


export default MyScreen;
