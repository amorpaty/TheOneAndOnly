import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore'

const userRecentCafesCollection = firestore().collection('userRecentCafes');
// 최근 본 카페 관련 


/**
 * 최근 본 카페 목록 조회
 * @returns 
 */
export async function fetchUserRecentCafes(){
    try {
        const userId = await AsyncStorage.getItem("userId");
        const cafeLists = await userRecentCafesCollection.where("userId", "==", userId).get(); 
        const recentCafeList = cafeLists.docs.map(doc => ({...doc.data()}));        
        return recentCafeList;    
    } catch (error) {
        console.error(error);
        return [];
    }
}

/**
 * 최근 본 카페 저장 (insert, update, delete)
 */
export async function saveUserRecentCafes(cafe){
    try {
        const userId = await AsyncStorage.getItem("userId");

        let updateSuccess = false;

        // DB에 이미 최근 본 카페가 있으면 update
        await userRecentCafesCollection.where("userId", "==", userId).where("id", "==", cafe.id).get().then(function (querySnapshot) {
            querySnapshot.forEach(function(doc){
                if(doc.data().id == cafe.id){
                    doc.ref.update(cafe);
                    updateSuccess = true;
                }
            })  
        });

        //최근 본 카페 목록 저장
        if(!updateSuccess){
            await userRecentCafesCollection.add({userId : userId, id : cafe.id, viewAt : cafe.viewAt});
        }

        // 최신 20개 까지만 컷!!
        const recentQuerySnapshot = await userRecentCafesCollection    
            .orderBy("id")
            .orderBy("viewAt", "desc")
            .where("userId", "==", userId).get();
        
        // 쿼리 결과가 20개를 초과할 경우, 초과된 문서들을 삭제
        const docsToDelete = recentQuerySnapshot.docs.slice(20);
        docsToDelete.forEach(async (doc) => {
            await doc.ref.delete();
        });    
        
    } catch (error) {
        console.error(error);
    }
}
