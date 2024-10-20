import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { Alert, Button, FlatList, Image, Modal, Platform, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';

/**
 * 24.10.19 방문로그 UI 생성
 * @returns 
 */

const data = [
    {
        date: '2023.11.11',
        reviews: [
        {
            title: '카페 반하다',
            tags: ['#원두 로스팅', '#에스프레소 바', '#엔틱한', '#노키즈존'],
            description: '에스프레소가',
            buttonText: '리뷰 작성',
        },
        {
            title: 'LOWE',
            tags: ['#백색 소음', '#노출 콘크리트', '#아인슈페너', '#노트북'],
            description: '노트북 작업이 집중 잘 되는 곳.',
            buttonText: '리뷰 보기',
        },
        ],
    },
    {
        date: '2023.10.25',
        reviews: [
        {
            title: '카페 비밀',
            tags: ['#라떼 맛집', '#에스프레소 바', '#중후한', '#뷰 맛집'],
            description: '산이 있는 원두에 마운틴 뷰가 멋있었다.',
            buttonText: '리뷰 작성',
        },
        ],
    },
];

const cafeList = [
    { id: '1', name: '카페 반하다', address: '서울 송파구 방이동 49-6', imageUrl: 'image1_url' },
    { id: '2', name: '반딧불이', address: '경기도 오산시 운암로 65', imageUrl: 'image2_url' },
    { id: '3', name: 'Banana79', address: '서울 중랑구 양원역로 3', imageUrl: 'image3_url' },
    { id: '4', name: '커피에 반하다', address: '서울 송파구 충민로 66', imageUrl: 'image4_url' },
    { id: '5', name: '카페 반원', address: '서울 송파구 법원로11길 25', imageUrl: 'image5_url' },
    { id: '6', name: '반헤이브', address: '광주 북구 운전안일길 23-6', imageUrl: 'image6_url' },
];

function VisitLogScreen({navigation}) {

    const [modalVisible, setModalVisible] = useState(false); // 기존 방문로그 작성 모달
    const [isSearchModalVisible, setSearchModalVisible] = useState(false); // 카페 찾아보기 모달
    const [searchText, setSearchText] = useState('');
    const [comment, setComment] = useState('');


    //해당 화면이 디바이스에서 보여질때만 실행되는 로직이 필요
    useFocusEffect(
        useCallback(() => {
           //TODO 방문로그 조회 로직 필요

        }, [])
    );

    const renderReview = ({ item }) => (
        <View style={styles.reviewCard}>
            <Text style={styles.reviewTitle}>{item.title}</Text>
            
            {/* item.tags.join(' ') 부분을 <Text>로 감싸줍니다 */}
            <Text style={styles.tags}>{item.tags.join(' ')}</Text>
        
            <Text style={styles.description}>{item.description}</Text>
            <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>{item.buttonText}</Text>
            </TouchableOpacity>
        </View>
    );

    const renderItem = ({ item, index }) => (
        <View style={styles.timelineItem}>
            {/* 타임라인의 빨간 선 및 점 */}
            <View style={styles.timelineLineContainer}>
            <View style={styles.timelineDot} />
            
            {/* 마지막 항목엔 선을 그리지 않음 */}
            {index !== data.length - 1 && <View style={styles.timelineLine} />}
            </View>
        
            <View style={styles.content}>
                {/* 날짜도 <Text>로 감싸줍니다 */}
                <Text style={styles.dateText}>{item.date}</Text>
            
                {item.reviews.map((review, index) => (
                    <View key={index}>
                        {renderReview({ item: review })}
                    </View>
                ))}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
            />
            <View style={styles.wrapper}>
                {/* 하단에 동그란 추가 버튼 */}
                <Pressable style = {({pressed})=> [
                        styles.addButton,
                        Platform.OS === 'ios' && {
                            opacity : pressed ? 0.1 : 0.2,
                        }
                    ]}
                    android_ripple={{color :  '#57382D'}}
                    onPress={() => setModalVisible(true)}
                >
                    <Icon name="add" size={24} style={styles.icon} />
                </Pressable>
            </View>

            {/* 모달 구현 */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <TouchableOpacity style={styles.searchButton} onPress={() => setSearchModalVisible(true)}>
                                <Text style={styles.searchButtonText}>카페 찾아보기</Text>
                            </TouchableOpacity>

                            {/* 카페 정보 */}
                            <Text style={styles.cafeTitle}>카페 반하다</Text>
                            <Text style={styles.tags}>#원두 로스팅 #에스프레소 바 #엔틱한 #노키즈존</Text>

                            {/* 이미지 섹션 */}
                            <View style={styles.imageContainer}>
                                <Image
                                    source={{ uri: 'https://example.com/cafe1.jpg' }}
                                    style={styles.cafeImage}
                                />
                                <Image
                                    source={{ uri: 'https://example.com/cafe2.jpg' }}
                                    style={styles.cafeImage}
                                />
                                <Image
                                    source={{ uri: 'https://example.com/cafe3.jpg' }}
                                    style={styles.cafeImage}
                                />
                            </View>

                            {/* 한줄평 입력 */}
                            <TextInput
                                style={styles.input}
                                placeholder="한줄평"
                                value={comment}
                                onChangeText={setComment}
                            />

                            {/* 버튼 섹션 */}
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                                    <Text style={styles.buttonText}>취소하기</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.submitButton}>
                                    <Text style={styles.buttonText}>등록하기</Text>
                                </TouchableOpacity>
                            </View>
                        </View>    
                    </View>
                </View>
            </Modal>

            {/* 카페 검색 모달 */}
            <Modal
                visible={isSearchModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setSearchModalVisible(false)}
            >
                <View style={styles.searchModalContainer}>
                    <View style={styles.searchModalContent}>
                        <View style={styles.searchHeader}>
                            <Text style={styles.title}>카페 찾아보기</Text>
                            <TouchableOpacity onPress={() => setSearchModalVisible(false)}>
                                <Text style={styles.closeButton}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        
                        <View style={styles.searchBar}>
                            <TextInput
                            style={styles.searchInput}
                            placeholder="카페명 입력"
                            value={searchText}
                            onChangeText={setSearchText}
                            />
                        </View>

                        <FlatList
                            data={cafeList}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <View style={styles.cafeItem}>
                                    {/* <Image source={{ uri: item.imageUrl }} style={styles.cafeImage} /> */}
                                    <View style={styles.cafeTextContainer}>
                                    <Text style={styles.cafeName}>{item.name}</Text>
                                    <Text style={styles.cafeAddress}>{item.address}</Text>
                                    </View>
                            </View>
                            )}
                        />
                    </View>                    
                </View>
            </Modal>
        </View> 
    );
}

const styles = StyleSheet.create({
    container: {
        flex : 1,
        padding : 20
    },
    timelineItem: {
        flexDirection: 'row',
        marginBottom: 30,
    },
    timelineLineContainer: {
        alignItems: 'center',
        width: 20,  // 점과 선을 그릴 공간의 너비
    },
    timelineLine: {
        position: 'absolute',
        top: 20,  // 점의 아래에서 시작
        width: 2,
        height: '100%',
        backgroundColor: '#e74c3c',
        zIndex: 0,
    },
    timelineDot: {
        width: 10,
        height: 10,
        backgroundColor: '#e74c3c',
        borderRadius: 5,
        marginTop: 10,
    },
    content: {
        marginLeft: 20,
        flex: 1,
    },
    dateText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    reviewCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    reviewTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    tags: {
        color: '#666',
        marginBottom: 10,
    },
    description: {
        marginBottom: 15,
        fontSize: 14,
        color: '#333',
    },
    button: {
        alignSelf: 'flex-end',
        backgroundColor: '#e74c3c',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
    },
     // Floating Action Button 스타일
    fab: {
        position: 'absolute',
        zIndex : 10,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#f00', // 버튼 색상 (빨강)
        alignItems: 'center',
        justifyContent: 'center',
        right: 20, // 오른쪽에서 20px 떨어진 위치
        bottom: 20, // 아래에서 20px 떨어진 위치
        elevation: 8, // 안드로이드에서 그림자 효과
        shadowColor: '#000', // iOS에서 그림자 효과
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
    },
    wrapper : {
        position : 'absolute',
        bottom : 16,
        right : 16,
        width : 48,
        height : 48,
        borderRadius : 30,
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
    addButton : {
        width : 48,
        height : 48,
        borderRadius : 10,
        backgroundColor : 'white',
        justifyContent : 'center',
        alignItems : 'center',
    },
    icon : {
        color : 'black'
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 배경
    },
    modalContainer: {
        width: '90%', // 화면 너비의 90%를 차지하도록 설정
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        elevation: 10, // 그림자 효과 추가
    },
    searchButton: {
        width: '100%',
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        marginBottom: 15,
        alignItems: 'center',
      },
    searchButtonText: {
        color: '#333',
        fontSize: 16,
    },
    modalContent: {
        justifyContent: 'center',
    },
    cafeTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    imageContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    cafeImage: {
        width: 90,
        height: 90,
        borderRadius: 10,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelButton: {
        backgroundColor: '#ff6347',
        padding: 10,
        borderRadius: 5,
        width: '45%',
    },
    submitButton: {
        backgroundColor: '#8b4513',
        padding: 10,
        borderRadius: 5,
        width: '45%',
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
    search: {
        color: '#888',
    },
    sort: {
        color: '#888',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    closeButton: {
        fontSize: 20,
    },
    searchModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    searchModalContent: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
    },
    searchHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },    
    searchBar: {
        marginVertical: 15,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingHorizontal: 10,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 5,
    },
    cafeTextContainer: {
        flex: 1,
    },
    cafeAddress: {
        color: '#555',
    },
});

export default VisitLogScreen;
