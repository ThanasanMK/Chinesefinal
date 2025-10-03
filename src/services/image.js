import { supabase } from '../config/supabase';

async function userId() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error('ยังไม่ได้ล็อกอิน');
    return user.id;
}

export async function createImage(image_url) {
    const uid = await userId();
    const { data, error } = await supabase
    .from('vocab_images')
    .insert([{ user_id: uid, image_url }])   // << ใส่ user_id ให้ตรงกับ auth.uid()
    .select()
    .single();
    if (error) throw error;
    return data;
}
