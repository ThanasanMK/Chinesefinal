// services/chat.js
export async function sendChatMessage({ text, userId, wordsContext = [] }) {
  const BASE_URL = process.env.EXPO_PUBLIC_API_URL; // ต้องตั้งค่าให้ถูก
  if (!BASE_URL) throw new Error('BASE_URL ไม่ถูกตั้งค่า (EXPO_PUBLIC_API_URL)');

  const ctrl = new AbortController();
  const timeout = setTimeout(() => ctrl.abort(), 15000); // 15s timeout

  try {
    const url = `${BASE_URL.replace(/\/+$/, '')}/api/chat`;
    console.log('[chat] POST =>', url);

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, userId, context: { words: wordsContext } }),
      signal: ctrl.signal,
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new Error(errText || `Chat API error: HTTP ${res.status}`);
    }
    return await res.json(); // { reply: string }
  } catch (e) {
    // แปล error ให้เข้าใจง่าย
    if (e.name === 'AbortError') throw new Error('เชื่อมต่อช้า/หมดเวลา (timeout)');
    if (String(e.message).includes('Network request failed')) {
      throw new Error('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ (ตรวจ IP/BASE_URL และการเปิดพอร์ต)');
    }
    throw e;
  } finally {
    clearTimeout(timeout);
  }
}
