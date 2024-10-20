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
    const cafeLists = await cafeCollection.orderBy("id").startAt(0).limit(30).get();
    const cafeList = cafeLists.docs.map(doc => ({
        ...doc.data(),
    }));

    const result = [];

    const cafeFavQuerySnapshot = await userFavCafeCollection
        .where('userId', '==', userId)
        .get();

    cafeList.forEach(doc => {
        let docData = doc;
        docData.fav = 'N';

        cafeFavQuerySnapshot.forEach(facDoc => {
            if(facDoc.data().id == docData.id){
                docData.fav = 'Y'
            }else{
                docData.fav = 'N'
            } 
        })
        result.push(docData);
    });    
    return result;
}


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

        // cafe 정보 조회
        const querySnapshot = await cafeCollection
            .where('id', 'in', chunk)
            .get();

        // cafe 별 키워드 리스트 조회
        const cafeKeyWordQuerySnapshot = await cafeKeywordCollection
            .where('id', 'in', chunk).orderBy("id")
            .get(); 
 

        const cafeFavQuerySnapshot = await userFavCafeCollection
            .where('userId', '==', userId)
            .get();

        querySnapshot.forEach(doc => {

            let docData = {...doc.data()};
            let keyword = [];

            docData.fav = 'N';

            // cafeKeywords.forEach(cafeKeywordDoc =>{
            //     console.log("cafeKeywordDoc",cafeKeywordDoc)
            //     if(cafeKeywordDoc.id == docData.id){
            //         keyword.push(cafeKeywordDoc);
            //     }
            // })   

            cafeFavQuerySnapshot.forEach(facDoc => {
                if(facDoc.data().id == doc.data().id){
                    docData.fav = 'Y'
                }else{
                    docData.fav = 'N'
                } 
            })

            //docData.keywords = keyword;
            result.push(docData);
        });    
    }

    console.log("result", result)

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
        const querySnapshot = await cafeCollection
            .where('id', 'in', chunk)
            .get();

        // 카페 키워드 조회 : 키워드 ID
        // const cafeKeyWordQuerySnapshot = await cafeKeywordCollection
        //     .where('id', 'in', chunk)
        //     .get();    

        // // 키워드명 조회    
        // const keywordsQuerySnapshot = await keywordColection.
        //     where('keywordId', 'in', cafeKeyWordQuerySnapshot.docs.map(doc => ({...doc.data()})).map(doc => doc.keywordId))
        //     .get();  

        // // 카페 키워드 Id와 명 조합    
        // const cafeKeywords = [];

        // cafeKeyWordQuerySnapshot.forEach(doc => {
        //     let docData = {...doc.data()};

        //     keywordsQuerySnapshot.forEach(keywordDoc => {
        //         let keyword = {...keywordDoc.data()};
        //         if(keyword.keywordId === docData.keywordId){
        //             docData.keywordName = keyword.keywordName;
        //             cafeKeywords.push(docData);
        //         }
        //     })
        // })    
            
        querySnapshot.forEach(doc => {
            let docData = {...doc.data()};
            let keyword = [];
            docData.fav = 'Y';

            // cafeKeywords.forEach(cafeKeywordDoc =>{

            //     console.log("cafeKeywordDoc",cafeKeywordDoc)
            //     if(cafeKeywordDoc.id == docData.id){
            //         keyword.push(cafeKeywordDoc);
            //     }
            // })   
            
            docData.keywords = keyword;

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