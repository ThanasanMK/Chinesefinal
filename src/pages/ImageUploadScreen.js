import React, { useState, useEffect } from 'react';
import { View, Image, Alert, FlatList } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { supabase } from '../config/supabase';
import { pickImage, uploadToSupabase } from '../services/upload';
import { createImage, listImages, deleteImage } from '../services/image';

export default function ImageUploadScreen() {
    const [picked, setPicked] = useState(null); // { uri, base64, ext } | null
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);

    async function refresh() {
    try { setItems(await listImages()); }
    catch (e) { Alert.alert('โหลดรูปไม่สำเร็จ', e.message); }
    }

    useEffect(() => { refresh(); }, []);

    async function onPick() {
    try {
        const p = await pickImage();
        if (p) setPicked(p);
    } catch (e) { Alert.alert('เลือกภาพไม่ได้', e.message); }
    }

    async function onUpload() {
    if (!picked) return Alert.alert('ยังไม่ได้เลือกรูป');
    setLoading(true);
    try {
        const { data: { user } } = await supabase.auth.getUser();
        const url = await uploadToSupabase(picked, user.id);   // อัปขึ้น Storage
        await createImage(url);                                 // บันทึก URL ลง DB
        setPicked(null);
        await refresh();
        Alert.alert('สำเร็จ', 'อัปโหลดรูปแล้ว');
        } catch (e) { Alert.alert('อัปโหลดไม่สำเร็จ', e.message); }
        finally { setLoading(false); }
    }

    return (
    <View style={{ flex:1, padding:16 }}>
        {picked && (
        <Image source={{ uri: picked.uri }} style={{ width:'100%', height:180, borderRadius:8, marginBottom:12 }} />
        )}
        <Button mode="outlined" onPress={onPick}>เลือกรูป</Button>
        <Button mode="contained" loading={loading} style={{ marginTop:8 }} onPress={onUpload}>
        อัปโหลดรูป
        </Button>

        <FlatList
        style={{ marginTop:16 }}
        data={items}
        keyExtractor={(it) => it.id}
        renderItem={({ item }) => (
            <Card style={{ marginBottom:10 }}>
            <Card.Cover source={{ uri: item.image_url }} />
            <Card.Actions>
                <Button onPress={() =>
                Alert.alert('ลบรูปนี้?', '', [
                    { text:'ยกเลิก' },
                    { text:'ลบ', style:'destructive', onPress: async () => { await deleteImage(item.id); refresh(); } }
                ])
                }>ลบ</Button>
                </Card.Actions>
            </Card>
            )}
        />
    </View>
    );
}
