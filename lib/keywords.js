import firestore from '@react-native-firebase/firestore'

const keywordsCollection = firestore().collection('keyword');
const filterList = ["제로페이", "카카오페이", "경기지역화폐"];

export async function getKeywords() {
    const keywords = await keywordsCollection.orderBy("count", "desc").limit(30).get();

    const keywordList = keywords.docs.map(doc => ({
        keywordId: doc.id,
        ...doc.data(),
    }));
    const keyworFilterList = keywordList.filter(s => !filterList.includes(s.keywordName))
    return keyworFilterList;
}