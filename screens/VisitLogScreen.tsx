import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { Alert, FlatList, Image, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import searchImage from '../assets/src/image/search.png';
import closeBtnImage from '../assets/src/image/close_btn.png';
import { getSearchCafeList } from "../lib/cafeList";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteUserVisitLog, getUserVisitLogList, saveUserVisitLog, updateUserVisitLog } from "../lib/userVisitLog";


/**
 * 24.10.19 방문로그 UI 생성
 * @returns 
 */
function VisitLogScreen(){
    const [modalVisible, setModalVisible] = useState(false); // 기존 방문로그 작성 모달
    const [updateInsertFlag, setUpdateInsertFlag] = useState('insert'); //방문로그 목록
    const [isSearchModalVisible, setSearchModalVisible] = useState(false); // 카페 찾아보기 모달
    const [searchText, setSearchText] = useState(''); // 카페 찾아보기 검색어 
    const [searchCafeList, setSearchCafeList] = useState([]); //카페 찾아보기 카페 목록
    const [choiceCafeItem, setChoiceCafeItem] = useState(null); //카페 찾아보기에서 선택한 카페 
    const [comment, setComment] = useState(''); //한줄평 
    const [visitLog, setVisitLog] = useState([]); //방문로그 목록


    //해당 화면이 디바이스에서 보여질때만 실행되는 로직이 필요
    useFocusEffect(
        useCallback(() => {
           //TODO 방문로그 조회 로직 필요
           fetchUserVisitLogList();
        }, [])
    );

    /**
     * 방문 로그 목록 조회
     */
    async function fetchUserVisitLogList (){
       const result : Object[] = await getUserVisitLogList();
       setVisitLog(result);
    }

    /**
     * 방문 로그 등록 모달 오픈
     */
    function openModalVisible(){
        setUpdateInsertFlag("insert");
        setModalVisible(true);
    }

    /**
     * 카페 찾아보기 모달 검색 조회
     * @param searchText 
     */
    async function fetchCafeData(searchText : string = ""){
        const result : Object[] = await getSearchCafeList(searchText);
        setSearchCafeList(result);
    };

    /**
     * 카페 찾아보기 모달 
     * 카페 선택
     */
    function choiceSearchCafeItem(cafeItem : {} = {}){
        setChoiceCafeItem(cafeItem);
        closeSearchModal();
    }

    /**
     * 방문로그 한줄평 등록
     */
    async function saveVisitLog(){
        
        try{
            if(comment.trim().length == 0){
                Alert.alert("한줄 평을 입력바랍니다.");
                return;
            }
    
            const userId = await AsyncStorage.getItem("userId");
    
            let params = {
                userId : userId,
                id : choiceCafeItem.id,
                date : choiceCafeItem.date,
                comment : comment
            }        
    
            if(updateInsertFlag == "insert"){
                await saveUserVisitLog(params);
            }else if(updateInsertFlag == "update"){
                await updateUserVisitLog(params);
            }

            const visitLog : Object [] = await getUserVisitLogList();
            setVisitLog(visitLog);
            closeVisitLogModal();
        }catch(error) {
            console.error(error);
        }
    }

    /**
     * 방문로그 수정
     * @param cafe 
     */
    async function updateVisitLog(cafe : Object = {}){
        setChoiceCafeItem(cafe);
        setComment(cafe.comment);
        setUpdateInsertFlag("update");
        setModalVisible(true);
    }

    /**
     * 방문로그 삭제 확인 문의 창 
     * @param cafe 
     */
    async function confirmDeleteVisitLog(cafe : Object = {}){
        Alert.alert("" ,"방문로그를 삭제 하겠습니까?", 
            [
                { text: "취소" },
                { text: "확인", onPress: () => deleteVisitLog(cafe) }
            ],
            { cancelable: true }    // 바깥쪽을 눌렀을 때 창을 닫을 수 있는지 여부
        )
    }

    /**
     * 방문로그 삭제 
     */
    async function deleteVisitLog(cafe : Object = {}){
        await deleteUserVisitLog(cafe);
        fetchUserVisitLogList();
    }

    /**
     * 방문로그 등록 모달 닫힐때 
     * 초기화 
     */
    function closeVisitLogModal(){
        setChoiceCafeItem(null);
        setModalVisible(false);
    }

    /**
     * 카페 찾아보기 
     * 모달이 닫힐 때 검색한 리스트 초기화
     */
    function closeSearchModal(){
        setSearchText("");
        setSearchCafeList([]);
        setSearchModalVisible(false)
    }

    const renderReview = ({ item }) => (
        <View style={styles.reviewCard}>
            <Text style={styles.reviewTitle}>{item.place_name}</Text>
            {/* item.tags.join(' ') 부분을 <Text>로 감싸줍니다 */}
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
            <Text style={styles.description}>{item.comment}</Text>
            <View style={{ flexDirection: 'row', alignSelf: 'flex-end'}}>
                <TouchableOpacity style={styles.updateButton} onPress={() => updateVisitLog(item)}>
                    <Text style={styles.buttonText}>수정</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDeleteVisitLog(item)}>
                    <Text style={styles.buttonText}>삭제</Text>
                </TouchableOpacity>
            </View>
            
        </View>
    );

    const renderItem = ({ item, index }) => (
        <View style={styles.timelineItem}>
            {/* 타임라인의 빨간 선 및 점 */}
            <View style={styles.timelineLineContainer}>
                <View style={styles.timelineDot} />
                
                {/* 마지막 항목엔 선을 그리지 않음 */}
                {index !== visitLog.length - 1 && <View style={styles.timelineLine} />}
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
                data={visitLog}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={<Text style={styles.emptyText}>등록된 방문로그가 없습니다.</Text>}
                contentContainerStyle={visitLog.length === 0 && styles.emptyContainer}
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
                    onPress={() => openModalVisible()}
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
                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContentContainer}
                    >
                        <View style={styles.modalContent}>
                            <TouchableOpacity disabled={updateInsertFlag == 'update' ? true : false}   style={styles.searchButton} onPress={() => setSearchModalVisible(true)}>
                                <Text style={styles.searchButtonText}>카페 찾아보기</Text>
                            </TouchableOpacity>

                            {/* 카페 정보 */}
                            {choiceCafeItem != null && choiceCafeItem != undefined ? 
                                <View style={styles.choiceCafeItemContainer}>
                                    <Text style={styles.cafeTitle}>{choiceCafeItem.place_name}</Text>
                                    <View style={styles.tags}>
                                        <ScrollView
                                            horizontal={true} // 가로 스크롤 활성화
                                            showsHorizontalScrollIndicator={false} // 스크롤바 숨기기 (선택 사항)
                                            contentContainerStyle={styles.scrollContent} // 스크롤 내용의 스타일
                                        >
                                            {choiceCafeItem.keywords.map((tag) => (
                                                <Text key={tag.keywordId} style={styles.tagText}> #{tag.keywordName} </Text>
                                            ))}
                                        </ScrollView>
                                    </View>

                                    {/* 이미지 섹션 */}
                                    <View style={styles.imageContainer}>
                                        {choiceCafeItem.images!=null && choiceCafeItem.images.length > 0 ? (
                                            <ScrollView
                                                horizontal={true} // 가로 스크롤 활성화
                                                showsHorizontalScrollIndicator={false} // 스크롤바 숨기기 (선택 사항)
                                                contentContainerStyle={styles.scrollContent} // 스크롤 내용의 스타일
                                            >
                                                {choiceCafeItem.images.map((image) => (
                                                    <Image 
                                                        key={image.imgId}  
                                                        source={{ uri: image.imgSrc }} 
                                                        style={styles.image}
                                                    /> 
                                                ))}
                                            </ScrollView>
                                        ) : null}
                                    </View>

                                    {/* 한줄평 입력 */}
                                    <TextInput
                                        style={styles.input}
                                        placeholder="한줄평"
                                        value={comment}
                                        onChangeText={setComment}
                                    />
                                </View>
                                : 
                                (
                                    <View style={styles.choiceNoCafeItemContainer}>
                                        <Text style={styles.emptyText}>카페를 선택바랍니다.</Text>
                                    </View>
                                )
                            }
                            {/* 버튼 섹션 */}
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.cancelButton} onPress={() => closeVisitLogModal()}>
                                    <Text style={styles.buttonText}>취소하기</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.submitButton} onPress={() => saveVisitLog()}>
                                    <Text style={styles.buttonText}>{updateInsertFlag == "update" ? '수정하기' : '등록하기'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>    
                    </ScrollView>    
                    </View>    
                </View>
            </Modal>

            {/* 카페 검색 모달 */}
            <Modal
                visible={isSearchModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => closeSearchModal()}
            >
                <View style={styles.searchModalContainer}>
                    <View style={styles.searchModalContent}>
                        <View style={styles.searchHeader}>
                            <Text style={styles.title}>카페 찾아보기</Text>
                            <TouchableOpacity onPress={() => closeSearchModal()}>
                                <Text style={styles.closeButton}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        
                        <View style={styles.searchBar}>
                            <Image source={searchImage} style={styles.searchImage}/>
                            <TextInput
                            style={styles.searchInput}
                            placeholder="카페명 입력"
                            value={searchText}
                            onChangeText={setSearchText}
                            onSubmitEditing={() => {
                                // 검색어를 기반으로 데이터를 조회하는 함수 호출
                                fetchCafeData(searchText);
                            }}
                            />
                            <TouchableOpacity onPress={() => setSearchText("")}>
                                <Image source={closeBtnImage} style={styles.searchImage} />
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={searchCafeList}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => choiceSearchCafeItem(item)}>
                                    <View style={styles.cafeItem}>
                                        {   item.images != null ? 
                                            <Image source={{ uri: item.images[0].imgSrc }} style={styles.oneCafeImage} />
                                            : null
                                        }
                                        <View style={styles.cafeTextContainer}>
                                            <Text style={styles.cafeName}>{item.place_name}</Text>
                                            <Text style={styles.cafeAddress}>{item.road_address_name}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={<Text style={styles.emptyText}>검색어를 입력바랍니다.</Text>}
                            contentContainerStyle={searchCafeList.length === 0 && styles.emptyContainer}
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
    updateButton: {
        alignSelf: 'flex-end',
        backgroundColor: '#e74c3c',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    deleteButton : {
        alignSelf: 'flex-end',
        backgroundColor: '#8b4513',
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
        height : '42%',
        justifyContent: 'center', // 모달을 아래쪽에 위치
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 배경
    },
    modalContainer: {
        width: '90%', // 화면 너비의 90%를 차지하도록 설정
        height : '42%',
        maxHeight : '42%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        elevation: 10, // 그림자 효과 추가
        overflow: "scroll"
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
        flex : 1,
        height : '100%',
        maxHeight : '100%',
        overflow: "scroll",
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
    choiceImageContainer : {
        flexDirection: 'row',
        marginTop: 10,
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
        flexDirection: 'row',
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
    oneCafeImage : {
        width: 55,
        height: 55,
        borderRadius: 10,
        marginRight : 5,
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
        height : '80%',
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
    searchImage : {
        marginLeft : 10,
        marginRight : 5,
    },
    choiceCafeItemContainer : {
        width : '100%',
        height: '70%',
        maxHeight : '70%',
    },
    choiceNoCafeItemContainer : {
        width : '100%',
        height: '70%',
        maxHeight : '70%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    tagText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#3a3b3a',
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 5,
    },
    // ScrollView의 스타일
    scrollView: {
        flex: 1, // ScrollView가 전체 공간을 차지하도록 설정
        width: '100%', // 화면 너비에 맞추기
    },

    // ScrollView의 contentContainer 스타일
    scrollContentContainer: {
        flexGrow: 1, // 스크롤 뷰 내용물이 적더라도 화면을 채우도록 설정
        justifyContent: 'center', // 내용을 가운데 정렬
    },
});

export default VisitLogScreen;
