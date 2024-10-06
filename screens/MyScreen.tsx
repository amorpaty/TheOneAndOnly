import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

/**
 * 24.10.06
 * MY 화면 UI 생성
 * @returns 
 */
function MyScreen() {
    return (
        <View style={{flex : 1}}>
            {/* 사용자 정보 카드 */}
            <View style={styles.card}>
                <Text style={styles.greeting}>안녕하세요 홍길동님 :)</Text>
                <Text style={styles.description}>홍길동님의 활동내역을 통해 분석한 취향 카페 TOP 3 입니다.</Text>
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
            </View>
        </View>
    )
}

const styles = StyleSheet.create ({
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
