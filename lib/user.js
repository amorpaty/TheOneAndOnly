import firestore from '@react-native-firebase/firestore'
import { supabase } from '../lib/supabaseClient';

const usersCollection = firestore().collection('users');
const userInfoTableName = "userInfo";


/**
 * 24.11.05 supabase 변경
 * @param {*} userInfo 
 */
export async function setUser(userInfo){
    if(userInfo){
        const { data: result, error } = await supabase.from(userInfoTableName).insert([
            { nickname: userInfo.nickname, email: userInfo.email } // primary key인 id는 자동 생성됨
          ]).select("userId");

        if (error) console.log('Error inserting users table data:', error.message);
        else console.log('Data inserted:', result);

        if (result && result.length > 0 && result[0].userId !== undefined) {
            const userId = result[0].userId;
            console.log('Inserted userId:', userId);
        
            // userId를 문자열로 변환하여 AsyncStorage에 저장
            return userId;
        }else{
            return null;
        }    
    }else{
        return null;
    }
}

/**
 * 24.11.05 supabase 변경
 * @param {*} userInfo 
 */
export async function getUser(userId) {
    const user  = await supabase.from(userInfoTableName).select("*").eq("userId", userId);
    return user.data;
}

/**
 * 24.11.05 supabase 변경
 * @param {*} userInfo 
 */
export async function getEmailUser(email){
    const user  = await supabase.from(userInfoTableName).select("*").eq("email", email);
    return user.data;
}

/**
 * 24.11.05 supabase 변경
 * @param {*} userInfo 
 */
export async function removeUser(userId) {
    const { data, error } = await supabase
    .from(userInfoTableName)
    .delete()
    .eq('userId', userId);

    if (error) {
        console.error('Error deleting data:', error);
    }
}


