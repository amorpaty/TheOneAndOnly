import React from "react";
import { Image, Platform, StyleSheet, TextInput, View } from "react-native";
import searchImage from '../assets/src/image/search.png';
import FloatingRegionButtion from "./FloatingRegionButtion";

function KeywordSearchBar(){
    return (
        <View style={styles.searchBar}>
            <Image source={searchImage} style={styles.searchImage}/>
            <TextInput
                style={styles.input}
                placeholder="키워드 검색"
                //
                //value={searchQuery}
                //onChangeText={setSearchQuery} // 검색어 업데이트
            />
            <FloatingRegionButtion />
        </View>
    )
}

const styles = StyleSheet.create({
    searchBar: {
        position: 'absolute',
        top: 20,
        left: 15,
        right: 15,
        zIndex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 2,
        borderRadius: 8,
        alignItems: 'center',
        //ios 전용 그림자 설정
        shadowColor : 'black',
        shadowOffset :{width : 0, height:4},
        shadowOpacity : 0.3,
        shadowRadius : 4,
        elevation : 5,
        overflow : Platform.select({android : 'hidden'})
    },
    searchImage : {
        marginLeft : 10,
        marginRight : 5,
    },
    input: {
        flex: 1,
        padding: 8,
        borderColor: 'white',
        borderWidth: 1,
        marginRight: 10,
        borderRadius: 5,
    },
});

export default KeywordSearchBar;