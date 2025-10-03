// src/services/upload.js
// services/upload.js
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';
import { supabase } from '../config/supabase';

export async function pickImage() { 
    const { data: { user } } = await supabase.auth.getUser(); // ต้องได้ user.id

  
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') throw new Error('ต้องอนุญาตเข้าถึงรูปภาพ');

    const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.85,
    base64: true,                // ✅ เอา base64 มาตรงๆ
    });
    if (result.canceled) return null;

    const asset = result.assets[0];
  // เดาว่านามสกุลไฟล์จาก fileName/type ถ้าไม่มี ใช้ jpg
    const ext =
    asset.fileName?.split('.').pop()?.toLowerCase() ||
    asset.type?.split('/')[1]?.toLowerCase() ||
    'jpg';

    return {
    uri: asset.uri,          // ใช้แสดง preview
    base64: asset.base64,    // ✅ ใช้นี่อัปโหลด
    ext,
    };
}

export async function uploadToSupabase(picked, userId) {
    if (!picked?.base64) throw new Error('ไม่พบข้อมูลรูป (base64)');

    const arrayBuffer = decode(picked.base64);
    const path = `${userId}/${Date.now()}.${picked.ext}`;
    const contentType =
    picked.ext === 'png' ? 'image/png'
    : picked.ext === 'heic' ? 'image/heic'
    : 'image/jpeg';

    const { error } = await supabase
    .storage
    .from('vocab-images')            // <-- ชื่อ bucket ต้องตรง
    .upload(path, arrayBuffer, { contentType, upsert: true });

    if (error) throw error;

    const { data } = supabase.storage.from('vocab-images').getPublicUrl(path);
  return data.publicUrl; // เก็บลง words.image_url
}



