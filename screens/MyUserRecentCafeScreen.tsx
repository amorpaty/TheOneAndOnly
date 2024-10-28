import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { getUserRecentCafeList } from "../lib/cafeList";

/**
 * 24.10.28
 * MY 화면 -> '최근 본 카페' 화면 생성
 * @returns 
 */
function MyUserRecentCafeScreen({navigation}) {    
    const [ userRecentCafeList, setUserRecentCafeList ] = useState([]);

    useFocusEffect (
      useCallback(() => {
        // 진입 시 최근 본 카페 목록 조회
        async function fetchUserRecentCafeList(){
          const storageRecentCafeIdList = await AsyncStorage.getItem("RECENTLY_VIEWED_KEY");
          const cafes = JSON.parse(storageRecentCafeIdList);

          if(cafes.length > 0){
            const cafeList : Object[] = await getUserRecentCafeList(cafes);

            const cafeSorted = cafes.sort((a, b) => new Date(a.viewAt) - new Date(b.viewAt));
            const resultCafe : [] = [];

            for(const cafe of cafeSorted){
               const pushCafe = cafeList.filter(s => s.id == cafe.id)
               resultCafe.push(pushCafe[0]);
            }
            setUserRecentCafeList(resultCafe);
          }
        };        
        fetchUserRecentCafeList();
      }, [])
    );

    const renderCafeItem = ({ item }) => (
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
          <View style={styles.imageContainer}>
              {/* {cafe.images && cafe.images.map((image, idx) => (
                  <FastImage
                      key={idx}
                      style={styles.cafeImage}
                      source={{ uri: image }}
                      resizeMode={FastImage.resizeMode.cover}
                  />
              ))} */}
          </View>
        </View>
      );
    
    return (
        <View style={styles.container}>
            {/* 최근 본 카페 목록 */}
            <FlatList
                data={userRecentCafeList}
                renderItem={renderCafeItem}
                keyExtractor={item => item.id.toString()}
                ListEmptyComponent={<Text style={styles.emptyText}>최근 본 카페가 없습니다.</Text>}
                contentContainerStyle={userRecentCafeList.length === 0 && styles.emptyContainer}
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
    imageContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 10,
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


export default MyUserRecentCafeScreen;
