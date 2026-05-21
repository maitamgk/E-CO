const BOT_TOKEN = '8928288666:AAFBOwn5ebX4n_ZPlU1i6JmoLgDEJ0_f0lk';
const CHAT_ID = '-5133794263';

const order = {
  orderCode: 'BCOMPF26ZOT',
  customer: { fullName: 'MAI TRAN THIEN TAM', phone: '0877724374', address: '392 Đường Cao Thắng' },
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
