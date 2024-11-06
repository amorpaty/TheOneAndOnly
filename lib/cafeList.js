import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore'
import { fetchCafeImageList } from '../lib/cafeImages'
import { supabase } from './supabaseClient';

const cafeCollection = firestore().collection('cafeInfo');
const cafeKeywordCollection = firestore().collection('cafeKeyword');
const keywordColection = firestore().collection('keyword');
const userFavCafeCollection = firestore().collection('userFavCafe');

/**
 * 카페 조회 paging 처리 필요 
 * @param {} keywordId 
 * @returns 
 */
export async function getSearchCafeList(keyword) {

    const userId = await AsyncStorage.getItem("userId");
    const cafeLists = await cafeCollection.orderBy("id").startAt(1000).limit(30).get();
    const cafeFavQuerySnapshot = await userFavCafeCollection
        .where('userId', '==', userId)
        .get();

    const cafeList = cafeLists.docs.map(doc => ({
        ...doc.data(),
    }));

    const result = [];

    for(const cafe of cafeList){
        let docData = {...cafe};
        docData.fav = 'N';

        // cafe 별 키워드 리스트 조회
        const cafeKeyWordQuerySnapshot = await cafeKeywordCollection
            .where('id', '==', docData.id)
            .get(); 

        const cafeKeywords = cafeKeyWordQuerySnapshot.docs.map(doc => ({
            ...doc.data(),
        }));

        if(cafeKeywords.length > 0){
            // 키워드명 조회    
            const keywordsQuerySnapshot = await keywordColection.
                where('keywordId', 'in', cafeKeywords.map(doc => doc.keywordId))
                .get();  

            docData.keywords = keywordsQuerySnapshot.docs.map(doc => ({...doc.data()}))    
        }else{
            docData.keywords = [];
        }    

        docData.images = fetchCafeImageList(docData.id);

        cafeFavQuerySnapshot.forEach(facDoc => {
            if(facDoc.data().id == docData.id){
                docData.fav = 'Y'
            }else{
                docData.fav = 'N'
            } 
        })

        result.push(docData);
    }

    return result;
}

/**
 * 24.10.11 최초생성 
 * 24.11.06 supabase 변경
 * 검색 조건 태그에 맞는 카페 조회
 * @param {} selectedTag 
 * @returns 
 */
export async function getSearchKeywordCafeList(keywordId) {

    const userId = await AsyncStorage.getItem("userId");
    const { data : result, error } = await supabase
           .rpc("get_cafe_info_list_by_keyword", { keyword_id : keywordId, user_id : userId});  // 함수 이름과 인자 전달

    if (error) console.log("Error fetching user orders:", error);
    else console.log("User orders:", result);

    if (result && result.length > 0 && result[0] !== undefined) {
        return result;
    }else{
        return [];
    }    
}

// 배열을 30개씩 쪼개는 함수
function chunkArray(array, size){
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};