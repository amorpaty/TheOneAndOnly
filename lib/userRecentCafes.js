import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabaseClient';
const userRecentCafesTableName = "userRecentCafes"


// 최근 본 카페 관련 

/**
 * 최근 본 카페 목록 조회
 * 24.11.06 supabase 변경
 * @returns 
 */
export async function getUserRecentCafeList(){
    
    const userId = await AsyncStorage.getItem("userId");
    const { data : result, error } = await supabase
        .rpc("get_user_recent_cafe_info_list", { user_id : userId});  // 함수 이름과 인자 전달

    if (error) console.log("Error fetching userRecentCafe orders:", error);
    else console.log("userRecentCafe orders:", result);

    if (result && result.length > 0 && result[0] !== undefined) {
        return result;
    }else{
        return [];
    }    
}

/**
 * 최근 본 카페 저장 (insert, update, delete)
 * 24.11.06 supabase 변경
 */
export async function saveUserRecentCafes(cafe){
    try {
        const userId = await AsyncStorage.getItem("userId");

        const { error } = await supabase
        .from(userRecentCafesTableName)
        .upsert(
            { userId: userId, id: cafe.id },
            { onConflict: ['userId', 'id'] }  // userId와 id가 일치하는 항목이 있을 경우 업데이트
        );

        // 최신 20개 까지만 컷!!
        // Step 1: 최신 20개의 데이터 중 가장 낮은 `viewAt` 값 가져오기
        const { data: recentCafes, error: selectError } = await supabase
            .from(userRecentCafesTableName)
            .select("viewAt")
            .eq("userId", userId)
            .order("viewAt", { ascending: false })
            .limit(20);

        if (selectError) {
            console.log("Error fetching recent cafes:", selectError);
        } else if (recentCafes && recentCafes.length === 20) {
            // 20번째 데이터의 `viewAt` 값을 기준으로 설정
            const minViewAtToKeep = recentCafes[19].viewAt;

            // Step 2: 최신 20개 이후의 오래된 데이터 삭제
            const { error: deleteError } = await supabase
                .from(userRecentCafesTableName)
                .delete()
                .eq("userId", userId)
                .lt("viewAt", minViewAtToKeep); // 기준 viewAt 값보다 작은 데이터만 삭제

            if (deleteError) {
                console.log("Error deleting excess cafes:", deleteError);
            } else {
                console.log("Excess cafes deleted successfully");
            }
        } else {
            console.log("Less than 20 records found, no deletion necessary.");
        }         
    } catch (error) {
        console.error(error);
    }
}