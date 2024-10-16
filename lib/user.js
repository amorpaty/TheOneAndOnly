import firestore from '@react-native-firebase/firestore'

const usersCollection = firestore().collection('users');

/**
 * user 저장
 * @param {} userInfo 
 * @returns 
 */
export function setUser(userInfo) {    
    if(userInfo){
        usersCollection.add(userInfo);
    }
}

/**
 * user 조회
 * @param {*} userId 
 * @returns 
 */
export async function getUser(userId) {
    const user  = await usersCollection.where("id", '==', userId).get();
    const resultUser = user.docs.map(doc => ({
        ...doc.data(),
    }));
    return resultUser;
}

export async function getEmailUser(email){
    const user  = await usersCollection.where("email", '==', email).get();
    const resultUser = user.docs.map(doc => ({
        ...doc.data(),
    }));
    return resultUser;
}

/**
 * user 삭제
 * @param {*} userId 
 */
export async function removeUser(userId) {
    const rows = await usersCollection.where('id', '==', userId).get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        doc.ref.delete();
      });
    });
}


