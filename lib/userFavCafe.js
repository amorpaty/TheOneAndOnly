import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabaseClient';

const userFavCafeTableName = "userFavCafe";


/**
 * 사용자 찜한 카페 조회 (특정 카페)
 * 24.11.06 supabase 변경
 * @param {*} userId 
 * @returns 
 */
export async function getUserFavCafe(userId, id) {
  const { data: result, error } = await supabase
    .from(userFavCafeTableName)
    .select("*")
    .eq("userId",userId)
    .eq("id", id);
  
  if (error) console.log('Error select userFavCafe table:', error);
  else console.log('Data selected:', result);

  if (result && result.length > 0 && result[0] !== undefined) {
      return result;
  }else{
      return [];
  }    
}

/**
 * 사용자 찜한 카페 목록 조회
 * 24.11.06 supabase 변경
 * @param {} userId
 * @returns 
 */
export async function getUserFavCafeList() {
  const userId = await AsyncStorage.getItem("userId");
  const { data : result, error } = await supabase
         .rpc("get_user_fav_cafe_info_list", { user_id : userId});  // 함수 이름과 인자 전달

  if (error) console.log("Error fetching userFavCafe orders:", error);
  else console.log("userFavCafe orders:", result);

  if (result && result.length > 0 && result[0] !== undefined) {
      return result;
  }else{
      return [];
  }    
}

/**
 * 사용자 찜한 카페 저장
 * 24.11.06 supabase 변경
 * @param {} userFavCafeInfo 
 * @returns 
 */
export async function setUserFavCafe(userId, id) {    
    const { data, error } = await supabase
      .from(userFavCafeTableName)
      .insert([
        { id : id, userId : userId }
      ])

    if (error) {
      console.error('Error inserting data:', error);
    }
}

/**
 * 사용자 찜한 카페 삭제
 * 24.11.06 supabase 변경
 * @param {*} userId, id 
 */
export async function removeUserFavCafe(userId, id) {
  const { data, error } = await supabase
    .from(userFavCafeTableName)
    .delete()
    .eq('userId', userId)
    .eq('id', id);

  if (error) {
    console.error('Error deleting data:', error);
  }
}


