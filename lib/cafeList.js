import firestore from '@react-native-firebase/firestore'

const cafeCollection = firestore().collection('cafeInfo');
const cafeKeywordCollection = firestore().collection('cafeKeyword');

/**
 * 24.10.11 최초생성 
 * 검색 조건 태그에 맞는 카페 조회
 * @param {} selectedTag 
 * @returns 
 */
export async function getSearchKeywordCafeList(keywordId) {

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

        querySnapshot.forEach(doc => {
            result.push(doc.data());  // 결과를 병합
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