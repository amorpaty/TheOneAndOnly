import firestore from '@react-native-firebase/firestore'

const menusCollection = firestore().collection('cafeMenuInfo');

export async function getMenus(id) {
    const menus = await menusCollection.where("id", "==", id).get();
    const menuList = menus.docs.map(doc => ({
        ...doc.data(),
    }));
    
    return menuList;
}