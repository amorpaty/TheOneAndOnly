import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabaseClient';

/**
 * 카페 조회 paging 처리 필요 
 * @param {} keywordId 
 * @returns 
 */
export async function getSearchCafeList(keyword) {
    const result = null;
    return result;
}

/**
 * 24.10.11 최초생성 
 * 24.11.06 supabase 변경
 * 검색 조건 태그에 맞는 카페 조회
 * @param {} selectedTag 
 * @returns 
 */
export async function getSearchKeywordCafeList(keywordId) {

    const userId = await AsyncStorage.getItem("userId");
    const { data : result, error } = await supabase
           .rpc("get_cafe_info_list_by_keyword", { keyword_id : keywordId, user_id : userId});  // 함수 이름과 인자 전달

    if (error) console.log("Error fetching user orders:", error);
    else console.log("User orders:", result);

    if (result && result.length > 0 && result[0] !== undefined) {
        return result;
    }else{
        return [];
    }    
}

// 배열을 30개씩 쪼개는 함수
function chunkArray(array, size){
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};