import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore'

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

        console.log("cafeKeywords", cafeKeyWordQuerySnapshot.docs.map(s => ({...s.data()})))

        if(cafeKeywords.length > 0){
            // 키워드명 조회    
            const keywordsQuerySnapshot = await keywordColection.
                where('keywordId', 'in', cafeKeywords.map(doc => doc.keywordId))
                .get();  

            docData.keywords = keywordsQuerySnapshot.docs.map(doc => ({...doc.data()}))    
        }else{
            docData.keywords = [];
        }    

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
 * 검색 조건 태그에 맞는 카페 조회
 * @param {} selectedTag 
 * @returns 
 */
export async function getSearchKeywordCafeList(keywordId = "") {

    const userId = await AsyncStorage.getItem("userId");
    const cafeKeywordIds = await cafeKeywordCollection.where('keywordId','==', (keywordId ? keywordId : "")).get();
    const cafeKeywordIdList = cafeKeywordIds.docs.map(doc => ({
        cafeId: doc.id,
        ...doc.data(),
    }));
   
    const cafeFavQuerySnapshot = await userFavCafeCollection
        .where('userId', '==', userId)
        .get();

    const cafeFavList = cafeFavQuerySnapshot.docs.map(doc => ({
        ...doc.data(),
    }));

    const result = [];

    // 30개씩 쿼리 분할
    const chunkedArrays = chunkArray(cafeKeywordIdList.map(s => s.id), 30);

    for (const chunk of chunkedArrays) {

        // cafe 정보 조회
        const querySnapshot = await cafeCollection
            .where('id', 'in', chunk)
            .get(); 

        let cafeList = querySnapshot.docs.map(doc => ({
            ...doc.data(),
        }));            

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

            cafeFavList.forEach(facDoc => {
                if(facDoc.id == cafe.id){
                    docData.fav = 'Y'
                }else{
                    docData.fav = 'N'
                } 
            });

            result.push(docData);
        }
    }

    return result;
}

/**
 * 최근 본 카페 조회 function 
 */
export async function getUserRecentCafeList(cafeIdList){
    const result = [];

    const userId = await AsyncStorage.getItem("userId");

    // 카페 목록 조회
    const querySnapshot = await cafeCollection
        .where('id', 'in', cafeIdList.map(s => s.id))
        .get();
    
    const cafeList = querySnapshot.docs.map(doc => ({
        ...doc.data(),
    }));

    const cafeFavQuerySnapshot = await userFavCafeCollection
        .where('userId', '==', userId)
        .get();

    const cafeFavList = cafeFavQuerySnapshot.docs.map(doc => ({
        ...doc.data(),
    }));
    
    for(const cafe of cafeList){
        // 카페 키워드 조회 : 키워드 ID
        const cafeKeyWordQuerySnapshot = await cafeKeywordCollection
            .where('id', '==', cafe.id)
            .get();    

        const cafeKeywords = cafeKeyWordQuerySnapshot.docs.map(doc => ({
            ...doc.data(),
        }));

        if(cafeKeywords.length > 0){
            // 키워드명 조회    
            const keywordsQuerySnapshot = await keywordColection.
                where('keywordId', 'in', cafeKeywords.map(doc => doc.keywordId))
                .get();  

            cafe.keywords = keywordsQuerySnapshot.docs.map(doc => ({...doc.data()}))    
        }else{
            cafe.keywords = [];
        }
        
        cafeFavList.forEach(facDoc => {
            if(facDoc.id == cafe.id){
                cafe.fav = 'Y'
            }else{
                cafe.fav = 'N'
            } 
        });

        result.push(cafe);
    }  

    return result; 
}

/**
 * 찜한 카페 조회 function 
 */
export async function getCafeFavList(userFavCafeIdList) {

    const result = [];
    //30개씩 쿼리 분할
    const chunkedArrays = chunkArray(userFavCafeIdList.map(s => s.id), 30);

    for (const chunk of chunkedArrays) {
        // 카페 목록 조회
        const querySnapshot = await cafeCollection
            .where('id', 'in', chunk)
            .get();
        
        const cafeList = querySnapshot.docs.map(doc => ({
            ...doc.data(),
        }));            

        for(const cafe of cafeList){
            // 카페 키워드 조회 : 키워드 ID
            const cafeKeyWordQuerySnapshot = await cafeKeywordCollection
                .where('id', '==', cafe.id)
                .get();    

            const cafeKeywords = cafeKeyWordQuerySnapshot.docs.map(doc => ({
                ...doc.data(),
            }));

            if(cafeKeywords.length > 0){
                // 키워드명 조회    
                const keywordsQuerySnapshot = await keywordColection.
                    where('keywordId', 'in', cafeKeywords.map(doc => doc.keywordId))
                    .get();  

                cafe.keywords = keywordsQuerySnapshot.docs.map(doc => ({...doc.data()}))    
            }else{
                cafe.keywords = [];
            }

            cafe.fav = "Y";        
            result.push(cafe);
        }   
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