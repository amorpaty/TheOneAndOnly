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

    const cafeInfos = await cafeCollection.where("id", "in", cafeKeywordIdList.map(s => s.id)).get();
    const cafeInfoList = cafeInfos.docs.map(doc => ({
        cafeId: doc.id,
        ...doc.data(),
    }));    

    return cafeInfoList;
}