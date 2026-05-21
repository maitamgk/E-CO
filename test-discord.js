// Nhập Webhook URL của bạn vào đây để test nhanh
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || '';

if (!DISCORD_WEBHOOK_URL) {
  console.error('Vui lòng cung cấp DISCORD_WEBHOOK_URL. Ví dụ chạy:');
  console.error('Windows PowerShell: $env:DISCORD_WEBHOOK_URL="your_webhook_url"; node test-discord.js');
  process.exit(1);
}

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
  .map(item => `▫️ **${item.nameSnapshot}**\n   ↳ Số lượng: ${item.qty} | Đơn giá: ${formatMoney(item.priceSnapshot)}\n   ↳ Thành tiền: ${formatMoney(item.priceSnapshot * item.qty)}`)
  .join('\n');

const adminUrl = 'https://e-co.shop/admin';
const orderDate = new Date(order.createdAt).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

const embed = {
  title: '🌟 ĐƠN HÀNG MỚI TỪ B-ECO 🌟',
  color: 3066993, // Green color hex #2ecc71 -> decimal 3066993
  url: adminUrl,
  description: `**Mã đơn:** \`#${order.orderCode}\`\n**Thời gian:** ${orderDate}`,
  fields: [
    {
      name: '👤 THÔNG TIN KHÁCH HÀNG',
      value: `• **Tên:** ${order.customer.fullName}\n• **SĐT:** \`${order.customer.phone}\`\n• **Địa chỉ:** ${order.customer.address}`,
      inline: false
    },
    {
      name: '🛒 CHI TIẾT GIỎ HÀNG',
      value: itemsList,
      inline: false
    },
    {
      name: '💵 TỔNG THANH TOÁN',
      value: `**${formatMoney(order.totals.total)}**`,
      inline: true
    },
    {
      name: '🏷 PHƯƠNG THỨC',
      value: order.paymentMethod.toUpperCase(),
      inline: true
    }
  ],
  timestamp: order.createdAt
};

if (order.notes) {
  embed.fields.push({
    name: '📝 GHI CHÚ',
    value: `*${order.notes}*`,
    inline: false
  });
}

// Bấm vào đây để xử lý đơn
embed.fields.push({
  name: '✨ HÀNH ĐỘNG',
  value: `[👉 BẤM VÀO ĐÂY ĐỂ XỬ LÝ ĐƠN](${adminUrl})`,
  inline: false
});

fetch(DISCORD_WEBHOOK_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'B-ECO Order Bot',
    avatar_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Green_leaf_icon.svg/512px-Green_leaf_icon.svg.png',
    embeds: [embed]
  })
})
.then(res => {
  if (res.ok) {
    console.log('Discord API Webhook gửi thành công!');
  } else {
    res.text().then(text => console.error('Discord API Error:', text));
  }
})
.catch(err => console.error(err));
