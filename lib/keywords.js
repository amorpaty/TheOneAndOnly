import firestore from '@react-native-firebase/firestore'

const keywordsCollection = firestore().collection('keywords');

export async function getKeywords() {
    const keywords = await keywordsCollection.get();
    const keywordList = keywords.docs.map(doc => ({
        keywordId: doc.id,
        ...doc.data(),
    }));
    return keywordList;
}