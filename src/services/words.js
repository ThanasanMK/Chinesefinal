import { supabase } from '../config/supabase';

async function currentUserId() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No session');
    return user.id;
}

export async function listWords({ q } = {}) {
    const uid = await currentUserId();
    let query = supabase.from('words').select('*').eq('user_id', uid)
        .order('created_at', { ascending: false });
    if (q) query = query.ilike('hanzi', `%${q}%`);
    const { data, error } = await query;
    if (error) throw error;
    return data;
}

export async function createWord(payload) {
    const uid = await currentUserId();
    const { data, error } = await supabase
        .from('words')
        .insert([{ ...payload, user_id: uid }])   // ⬅️ ใส่ user_id ให้ชัด
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateWord(id, payload) {
    const { data, error } = await supabase.from('words')
        .update(payload).eq('id', id).select().single();
    if (error) throw error; return data;
}

export async function deleteWord(id) {
    const { error } = await supabase.from('words').delete().eq('id', id);
    if (error) throw error; return true;
}
