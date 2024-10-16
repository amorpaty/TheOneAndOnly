import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore'

const cafeCollection = firestore().collection('cafeInfo');
const cafeKeywordCollection = firestore().collection('cafeKeyword');
const userFavCafeCollection = firestore().collection('userFavCafe');

/**
 * 24.10.11 최초생성 
 * 검색 조건 태그에 맞는 카페 조회
 * @param {} selectedTag 
 * @returns 
 */
export async function getSearchKeywordCafeList(keywordId) {

    const userId = await AsyncStorage.getItem("userId");
    const cafeKeywordIds = await cafeKeywordCollection.where('keywordId','==', (keywordId ? keywordId : "")).get();
    const cafeKeywordIdList = cafeKeywordIds.docs.map(doc => ({
        cafeId: doc.id,
        ...doc.data(),
    }));

    const result = [];

    // 30개씩 쿼리 분할
    const chunkedArrays = chunkArray(cafeKeywordIdList.map(s => s.id), 30);

    for (const chunk of chunkedArrays) {
        const querySnapshot = await cafeCollection
            .where('id', 'in', chunk)
            .get();

        const cafeFavQuerySnapshot = await userFavCafeCollection
            .where('userId', '==', userId)
            .get();

        querySnapshot.forEach(doc => {

            let docData = {...doc.data()};
            docData.fav = 'N';

            cafeFavQuerySnapshot.forEach(facDoc => {
                if(facDoc.data().id == doc.data().id){
                    docData.fav = 'Y'
                }else{
                    docData.fav = 'N'
                } 
            })

            console.log("docData", docData)
            result.push(docData);
        });    
    }
    return result;
}

// 배열을 30개씩 쪼개는 함수
function chunkArray(array, size){
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};