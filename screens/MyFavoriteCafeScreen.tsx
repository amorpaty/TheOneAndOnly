import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Touchable, ScrollView, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { getUserFavCafeList, removeUserFavCafe } from "../lib/userFavCafe";
import { useFocusEffect } from "@react-navigation/native";

/**
 * 24.10.17
 * MY 화면 -> '찜한 카페' 화면 생성
 * @returns 
 */
function MyFavoriteCafeScreen({navigation}) {

    const [userFavCafeList, setUserFavCafeList] = useState([]); //찜한 카페 목록 저장
    
    // 진입 시 user정보로 찜한 카페 목록 져오기
    useFocusEffect (
      useCallback(() => {
        fetchUserFavCafeList();
      }, [])
    );

    async function fetchUserFavCafeList(){
      const favCafeList : Object[] = await getUserFavCafeList();
      setUserFavCafeList(favCafeList);
    }

    //카페 찜하기 해제 핸들
    function handleFavoriteCafe(seletedCafe : Object = {}){
      updateUserFavCafe(seletedCafe);
    }

    //카페 찜 delete
    async function updateUserFavCafe(seletedCafe : Object = {}) {

      const userId = await AsyncStorage.getItem("userId");
      const id = seletedCafe.id;
      //찜삭제
      removeUserFavCafe(userId, id);

      //카페 찜 목록 재조회
      fetchUserFavCafeList();
    }

    const renderCafeItem = ({ item, index }) => (
      <View style={styles.cafeItem}>
          <View style={styles.headerContainer}>
              <View style={{}}>
                  <TouchableOpacity onPress={() => navigation.navigate('CafeDetailTab', { cafe : item })}>
                    <Text style={styles.cafeName}>{item.place_name}</Text>
                  </TouchableOpacity>
              </View>
              <View style={styles.iconContainer}>
                  <Icon name="location-on" size={20} onPress={() => navigation.navigate('Home', { cafe : item })} />
                  <Icon name={item.fav === "Y" ? "favorite" : "favorite-border"} size={20} style={{color : item.fav === "Y" ? "red" : "black" }} onPress={() => handleFavoriteCafe(item)}/>
              </View>
          </View>
          <View style={styles.tags}>
              <ScrollView
                  horizontal={true} // 가로 스크롤 활성화
                  showsHorizontalScrollIndicator={false} // 스크롤바 숨기기 (선택 사항)
                  contentContainerStyle={styles.scrollContent} // 스크롤 내용의 스타일
              >
                  {item.keywords.map((tag) => (
                      <Text key={tag.keywordId} style={styles.tagText}> #{tag.keywordName} </Text>
                  ))}
              </ScrollView>
          </View>
          <View style={styles.imagesContainer}>
            {item.images.length > 0 ? (
                item.images.map((image) => (
                <Image 
                    key={image.imgId}  
                    source={{ uri: image.imgSrc }} 
                    style={styles.image}
                /> 
                ))
            ) : null}
          </View>
        </View>
      );
    
    return (
        <View style={styles.container}>
            {/* 검색 바 */}
            <View style={styles.userCard}>
                {/* <Text style={styles.userDesc}>찜한 카페 목록을 확인하세요!</Text> */}
            </View>

            {/* 찜한 카페 목록 */}
            <FlatList
                data={userFavCafeList}
                renderItem={renderCafeItem}
                keyExtractor={item => item.id.toString()}
                ListEmptyComponent={<Text style={styles.emptyText}>찜한 카페가 없습니다.</Text>}
                contentContainerStyle={userFavCafeList.length === 0 && styles.emptyContainer}
            />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
      padding: 20,
    },
    userCard: {
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 10,
      marginBottom: 20,
      alignItems: 'center',
    },
    headerContainer : {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop : 10,
    },
    iconContainer:{
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    imagesContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 10,
    },
    image: {
      width: 80,
      height: 80,
      borderRadius: 5,
    },
    tags: {
      marginTop: 10,
      color: '#999',
    },
    tagText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#3a3b3a',
    },
    cafeItem: {
      backgroundColor: '#fff',
      padding: 15,
      borderRadius: 10,
      marginBottom: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
    },
    cafeName: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    cafeInfo: {
      fontSize: 14,
      color: '#888',
      marginTop: 5,
    },
    scrollContent: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 5,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 16,
      color: '#888',
    },
  });


export default MyFavoriteCafeScreen;
