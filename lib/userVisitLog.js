import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabaseClient';
const userVisitLogTableName = "userVisitLog"


// 방문 로그 관련
// 24.11.08 최초 생성

/**
 * 방문 로그 목록 조회
 * @returns 
 */
export async function getUserVisitLogList(){
    const userId = await AsyncStorage.getItem("userId");
    
    const { data : result, error } = await supabase
      .rpc("get_user_visit_log_list_by_userid", {user_id : userId});  // 함수 이름과 인자 전달

    if (error) console.log("Error fetching userVisitLog orders:", error);
    else console.log("userVisitLog orders:", result);

    if (result && result.length > 0 && result[0] !== undefined) {
      return result;
    }else{
      return [];
    }    
}

/**
 * 방문 로그 저장 (insert)
 * 24.11.06 supabase 변경
 */
export async function saveUserVisitLog(params){
    try {
        const { error } = await supabase
        .from(userVisitLogTableName)
        .insert(
            { userId: params.userId, 
                id: params.id,  
                comment : params.comment
            },
        );
    } catch (error) {
        console.error(error);
    }
}

/**
 * 방문 로그 수정 (update)
 */
export async function updateUserVisitLog(params){
  try {

    console.log("date", params)
    const { data, error } = await supabase
      .from(userVisitLogTableName)
      .update({ comment: params.comment })
      .eq('userId', params.userId)
      .eq('id', params.id)
      .eq('created_at', params.date)
      .select()
  } catch (error) {
      console.error(error);
  }
}

/**
 * 방문 로그 삭제 (delete)
 * @param {*} params 
 */
export async function deleteUserVisitLog(params){
  try {
      const { error } = await supabase
      .from(userVisitLogTableName)
      .delete()
      .eq("userId", params.userId)
      .eq("id", params.id)
      .eq("created_at", params.date);

  } catch (error) {
      console.error(error);
  }
}