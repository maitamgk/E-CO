// Token và chat id đọc từ biến môi trường — không hardcode secret vào file được commit.
//   PowerShell: $env:TELEGRAM_BOT_TOKEN="..."; $env:TELEGRAM_CHAT_ID="..."; node test-telegram.js
//   Bash:       TELEGRAM_BOT_TOKEN=... TELEGRAM_CHAT_ID=... node test-telegram.js
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (!BOT_TOKEN || !CHAT_ID) {
  console.error('Thiếu TELEGRAM_BOT_TOKEN hoặc TELEGRAM_CHAT_ID trong biến môi trường.');
  process.exit(1);
}

const order = {
  orderCode: 'BCO-260726-TEST1',
  customer: { fullName: 'Khách Hàng Thử Nghiệm', phone: '0900000000', address: 'Địa chỉ thử nghiệm' },
  paymentMethod: 'COD',
  notes: 'Giao hàng giờ hành chính',
  items: [
    { nameSnapshot: 'Lá Bàng Sinh Thái', qty: 5, priceSnapshot: 3500 },
    { nameSnapshot: 'Phân Bón Hữu Cơ B-ECO', qty: 1, priceSnapshot: 10000 }
  ],
  totals: { total: 27500 },
  createdAt: new Date().toISOString()
};

const formatMoney = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

const itemsList = order.items
  .map(item => `▫️ <b>${item.nameSnapshot}</b>\n   ↳ Số lượng: ${item.qty}\n   ↳ Đơn giá: ${formatMoney(item.priceSnapshot)}\n   ↳ Thành tiền: ${formatMoney(item.priceSnapshot * item.qty)}`)
  .join('\n');

const adminUrl = 'http://localhost:5173/admin';
const orderDate = new Date(order.createdAt).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

const message = [
  `🌟 <b>ĐƠN HÀNG MỚI TỪ B-ECO</b> 🌟`,
  `━━━━━━━━━━━━━━━━━━`,
  `📦 <b>Mã đơn:</b> <code>#${order.orderCode}</code>`,
  `⏱ <b>Thời gian:</b> ${orderDate}`,
  ``,
  `👤 <b>THÔNG TIN KHÁCH HÀNG</b>`,
  `┣ <b>Tên:</b> ${order.customer.fullName}`,
  `┣ <b>SĐT:</b> <code>${order.customer.phone}</code>`,
  `┗ <b>Địa chỉ:</b> ${order.customer.address}`,
  ``,
  `🛒 <b>CHI TIẾT GIỎ HÀNG</b>`,
  itemsList,
  `━━━━━━━━━━━━━━━━━━`,
  `💵 <b>TỔNG THANH TOÁN:</b> <b>${formatMoney(order.totals.total)}</b>`,
  `🏷 <b>Phương thức:</b> ${order.paymentMethod.toUpperCase()}`,
  order.notes ? `📝 <b>Ghi chú:</b> <i>${order.notes}</i>` : '',
  ``,
  `✨ <a href="${adminUrl}">👉 BẤM VÀO ĐÂY ĐỂ XỬ LÝ ĐƠN</a> ✨`
].filter(line => line !== '').join('\n');

const url = 'https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage';
fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: 'HTML', disable_web_page_preview: true })
})
.then(res => res.json())
.then(data => console.log('Telegram API Response:', data))
.catch(err => console.error(err));
