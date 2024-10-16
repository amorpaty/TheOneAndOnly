import React from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import SlidingUpPanel from "rn-sliding-up-panel";

const cafes = [
    {
      place_name: '카페 반하다',
      tags: '#원두 로스팅 #에스프레소 바 #핸드드립 #노키즈존',
      images: []
    },
    {
        name: '카페 반하다',
        tags: '#원두 로스팅 #에스프레소 바 #핸드드립 #노키즈존',
        images: []
      },
      {
        name: '카페 반하다',
        tags: '#원두 로스팅 #에스프레소 바 #핸드드립 #노키즈존',
        images: []
      },
      {
        name: '카페 반하다',
        tags: '#원두 로스팅 #에스프레소 바 #핸드드립 #노키즈존',
        images: []
      },
      {
        name: '카페 반하다',
        tags: '#원두 로스팅 #에스프레소 바 #핸드드립 #노키즈존',
        images: []
      },
      {
        name: '카페 반하다',
        tags: '#원두 로스팅 #에스프레소 바 #핸드드립 #노키즈존',
        images: []
      },
      {
        name: '카페 반하다',
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
function CafeMenuSlidingUpPanel({cafeListPanelRef, panelContent, cafeList, handleFavoriteCafe}){
    return (
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

