import { supabase } from './supabaseClient';

const keywordsTableName = "keywords";

const filterList = ['제로페이', '카카오페이', '경기지역화폐'];


/**
 * 24.11.06 supabase 변경
 * @returns 
 */
export async function getKeywords() {
    const { data: result, error }  = await supabase
        .from(keywordsTableName)
        .select("*")
        .not("keywordName", "eq", "제로페이") // filterList를 배열로 직접 전달
        .not("keywordName", "eq", "카카오페이") 
        .not("keywordName", "eq", "경기지역화폐")
        .order("count", { ascending: false })
        .limit(30);

    if (error) console.log('Error select keywords table:', error);
    else console.log('Data selected:', result);

    if (result && result.length > 0 && result[0] !== undefined) {
        return result;
    }else{
        return [];
    }    
}