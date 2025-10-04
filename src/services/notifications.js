// src/services/notifications.js
const delay = (ms) => new Promise(r => setTimeout(r, ms));

// ✅ เปลี่ยน BASE_URL เป็น API จริงของคุณเมื่อต้องการ
const BASE_URL = process.env.EXPO_PUBLIC_API_URL; // เช่น http://192.168.x.x:3000

export async function listNotifications() {
  if (!BASE_URL) {
    // --- MOCK ข้อมูลให้ลองก่อน ---
    await delay(400);
    return [
      { id: 'n1', title: 'คำศัพท์ใหม่ถูกเพิ่ม', body: 'คุณเพิ่ม “学习 (xuéxí)” สำเร็จ', read: false, ts: Date.now()-1000*60*3 },
      { id: 'n2', title: 'ยินดีต้อนรับ!', body: 'เริ่มบันทึกคำศัพท์จีนคำแรกกันเลย', read: true,  ts: Date.now()-1000*60*60*10 },
    ];
  }
  const res = await fetch(`${BASE_URL}/api/notifications`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function markRead(id) {
  if (!BASE_URL) { await delay(200); return { ok:true }; }
  const res = await fetch(`${BASE_URL}/api/notifications/${id}/read`, { method: 'POST' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function removeNotification(id) {
  if (!BASE_URL) { await delay(200); return { ok:true }; }
  const res = await fetch(`${BASE_URL}/api/notifications/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
