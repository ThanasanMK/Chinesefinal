import React from 'react';
import { Card, Button } from 'react-native-paper';

export default function WordItem({ item, onEdit, onDelete }) {
    return (
        <Card style={{ marginVertical:6 }} onPress={onEdit}>
            {item.image_url ? <Card.Cover source={{ uri: item.image_url }} /> : null}
        <Card.Title title={item.hanzi} subtitle={`${item.pinyin ?? ''} • ${item.meaning_th ?? ''}`} />
        <Card.Actions>
            <Button onPress={onEdit}>แก้ไข</Button>
            <Button textColor="red" onPress={onDelete}>ลบ</Button>
        </Card.Actions>
        </Card>
    );
}

