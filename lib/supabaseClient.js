import { createClient } from '@supabase/supabase-js';

// Supabase 프로젝트의 URL과 익명 키(anon key)를 입력합니다.
const SUPABASE_URL = 'https://fluuquaaestqqrhixzsx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsdXVxdWFhZXN0cXFyaGl4enN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA2MzU0NzMsImV4cCI6MjA0NjIxMTQ3M30.t2dnxxBHAgLY3EgUr-vpEiF-PyPymOKsVrXykXmPaZI';

// Supabase 클라이언트 생성
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);