import firestore from '@react-native-firebase/firestore'

const cafeImagesCollection = firestore().collection('cafeImages');

/**
 * 카페 이미지 조회 
 * @param {} id : 카페 id 
 * @returns 
 */
export async function fetchCafeImageList(id) {
    const cafeImagesSnapshot = await cafeImagesCollection.where('id','==', id).get();
    const cafeImageList = cafeImagesSnapshot.docs.map(doc => ({
        ...doc.data(),
    }));

    return cafeImageList;
};