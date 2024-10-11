import React from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import SlidingUpPanel from "rn-sliding-up-panel";

const cafes = [
    {
      name: '카페 반하다',
      time: '10:00 ~ 22:00',
      status: '영업 중',
      tags: '#원두 로스팅 #에스프레소 바 #핸드드립 #노키즈존',
      images: []
    },
    {
        name: '카페 반하다',
        time: '10:00 ~ 22:00',
        status: '영업 중',
        tags: '#원두 로스팅 #에스프레소 바 #핸드드립 #노키즈존',
        images: []
      },
      {
        name: '카페 반하다',
        time: '10:00 ~ 22:00',
        status: '영업 중',
        tags: '#원두 로스팅 #에스프레소 바 #핸드드립 #노키즈존',
        images: []
      },
      {
        name: '카페 반하다',
        time: '10:00 ~ 22:00',
        status: '영업 중',
        tags: '#원두 로스팅 #에스프레소 바 #핸드드립 #노키즈존',
        images: []
      },
      {
        name: '카페 반하다',
        time: '10:00 ~ 22:00',
        status: '영업 중',
        tags: '#원두 로스팅 #에스프레소 바 #핸드드립 #노키즈존',
        images: []
      },
      {
        name: '카페 반하다',
        time: '10:00 ~ 22:00',
        status: '영업 중',
        tags: '#원두 로스팅 #에스프레소 바 #핸드드립 #노키즈존',
        images: []
      },
      {
        name: '카페 반하다',
        time: '10:00 ~ 22:00',
        status: '영업 중',
        tags: '#원두 로스팅 #에스프레소 바 #핸드드립 #노키즈존',
        images: []
      },
  ];

/**
 * 24.10.05
 * 카페 목록 slidingUpPanel
 * @param param
 * @returns 
 */
function CafeMenuSlidingUpPanel({panelRef}){
    return (
        <SlidingUpPanel containerStyle={{flex: 1, maxHeight : '100%', alignSelf: undefined}} ref={c => panelRef.current = c}>
            <View style={styles.slidingUpPanel}>
                <ScrollView>
                    <>
                        <View style={styles.searchContainer}>
                            <Text style={styles.search}>검색어 입력</Text>
                            <Text style={styles.sort}>인기순</Text>
                        </View>

                        {/* 카페 리스트 */}
                        {cafes.map((cafe, index) => (
                            <View key={index} style={styles.cafeItem}>
                                <Text style={styles.cafeName}>{cafe.name} {cafe.time} <Text style={styles.status}>{cafe.status}</Text></Text>
                                <Text style={styles.tags}>{cafe.tags}</Text>
                                <View style={styles.imageContainer}>
                                    {cafe.images.map((image, idx) => (
                                    <Image key={idx} style={styles.cafeImage} source={{ uri: image }} />
                                    ))}
                                </View>
                            </View>
                        ))}
                    </>
                </ScrollView>
            </View>
        </SlidingUpPanel>
    );
}

const styles = StyleSheet.create({
    slidingUpPanel: {
        height : '100%',
        color : "#fff",
        backgroundColor : "#fff",
    },
    searchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
      },
    search: {
        color: '#888',
    },
    sort: {
        color: '#888',
    },
    cafeItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    cafeName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    status: {
        color: 'red',
    },
    tags: {
        marginTop: 5,
        color: '#999',
    },
    imageContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    cafeImage: {
        width: 100,
        height: 100,
        marginRight: 10,
        borderRadius: 10,
    },
})

export default CafeMenuSlidingUpPanel;

