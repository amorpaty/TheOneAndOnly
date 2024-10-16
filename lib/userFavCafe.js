import firestore from '@react-native-firebase/firestore'

const userFavCafeCollection = firestore().collection('userFavCafe');

/**
 * 사용자 찜한 카페 조회
 * @param {*} userId 
 * @returns 
 */
export async function getUserFavCafe(userId, id) {
    const userCafeFav  = await userFavCafeCollection.where("userId", '==', userId).get();
    const resultUserCafeFav = userCafeFav.docs.filter(s => s.data().id == id);
    return resultUserCafeFav;
}

/**
 * 사용자 찜한 카페 저장
 * @param {} userFavCafeInfo 
 * @returns 
 */
export function setUserFavCafe(userId, id) {    
    userFavCafeCollection.add({userId : userId, id : id});
}

/**
 * 사용자 찜한 카페 삭제
 * @param {*} userId, id 
 */
export async function removeUserFavCafe(userId, id) {
    const rows = await userFavCafeCollection.where('userId', '==', userId).get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        if(doc.data().id == id){
            doc.ref.delete();
        }
      });
    });
}


