const { createClient } = require('@supabase/supabase-js');
const BOT_TOKEN = '8928288666:AAFBOwn5ebX4n_ZPlU1i6JmoLgDEJ0_f0lk';
const CHAT_ID = '-5133794263';
const url = process.env.VITE_SUPABASE_URL || 'https://csrtjirduftkesbogpus.supabase.co';
const key = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzcnRqaXJkdWZ0a2VzYm9ncHVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyNzIwNTcsImV4cCI6MjA5Mjg0ODA1N30.mUf9djNxDrJWIrru2g-GVFyZiazwABmfyyb4bP_gbbk';
const supabase = createClient(url, key);

const formatMoney = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

supabase.from('orders').select('*').eq('order_code', 'BCOMPF2I0UK').maybeSingle()
  .then(res => {
    const order = res.data;
    const itemsList = order.items
      .map(item => `▫️ <b>${item.nameSnapshot}</b>\n   ↳ Số lượng: ${item.qty}\n   ↳ Đơn giá: ${formatMoney(item.priceSnapshot)}\n   ↳ Thành tiền: ${formatMoney(item.priceSnapshot * item.qty)}`)
      .join('\n');

    const adminUrl = 'http://localhost:5173/admin';
    const orderDate = new Date(order.created_at).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

    const message = [
      `🌟 <b>ĐƠN HÀNG MỚI TỪ B-ECO</b> 🌟`,
      `━━━━━━━━━━━━━━━━━━`,
      `📦 <b>Mã đơn:</b> <code>#${order.order_code}</code>`,
      `⏱ <b>Thời gian:</b> ${orderDate}`,
      ``,
      `👤 <b>THÔNG TIN KHÁCH HÀNG</b>`,
      `┣ <b>Tên:</b> ${order.customer_info.fullName}`,
      `┣ <b>SĐT:</b> <code>${order.customer_info.phone}</code>`,
      `┗ <b>Địa chỉ:</b> ${order.customer_info.address}`,
      ``,
      `🛒 <b>CHI TIẾT GIỎ HÀNG</b>`,
      itemsList,
      `━━━━━━━━━━━━━━━━━━`,
      `💵 <b>TỔNG THANH TOÁN:</b> <b>${formatMoney(order.totals.total)}</b>`,
      `🏷 <b>Phương thức:</b> ${order.payment_method.toUpperCase()}`,
      order.notes ? `📝 <b>Ghi chú:</b> <i>${order.notes}</i>` : '',
      ``,
      `✨ <a href="${adminUrl}">👉 BẤM VÀO ĐÂY ĐỂ XỬ LÝ ĐƠN</a> ✨`
    ].filter(line => line !== '').join('\n');

    return fetch('https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: 'HTML', disable_web_page_preview: true })
    });
  })
  .then(res => res.json())
  .then(data => console.log('Telegram API Response:', data))
  .catch(err => console.error(err));
