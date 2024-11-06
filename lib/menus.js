import { supabase } from './supabaseClient';

const cafeMenuInfoTableName = "cafeMenuInfo"

/**
 * 카페 메뉴 목록 조회
 * 24.11.06 supabase 변경
 * @param {*} id 
 * @returns 
 */
export async function getMenus(id) {
    const {data : result, error} = await supabase
        .from(cafeMenuInfoTableName)
        .select("*")
        .eq("id", id)
        .order("id", { ascending: true });

    if (error) console.log('Error select cafeMenuInfo table:', error);
    else console.log('Data selected:', result);

    if (result && result.length > 0 && result[0] !== undefined) {
        return result;
    }else{
        return [];
    }    
}