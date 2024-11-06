import { supabase } from './supabaseClient';

const cafeImagesTableName = "cafeImages"

/**
 * 카페 이미지 조회 
 * 24.11.06 supabase 변경
 * @param {} id : 카페 id 
 * @returns 
 */
export async function fetchCafeImageList(id) {
    const { data: result, error }  = await supabase
        .from(cafeImagesTableName)
        .select("*")
        .eq('id', id)
        .order("imgNum", { ascending: true })
    ;

    if (error) console.log('Error select cafeImages table:', error);
    else console.log('Data selected:', result);

    if (result && result.length > 0 && result[0] !== undefined) {
        return result[0];
    }else{
        return null;
    }    
};