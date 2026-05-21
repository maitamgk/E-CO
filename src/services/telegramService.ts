import { Order } from '@/types';
import { formatMoney } from '@/utils/money';

const BOT_TOKEN = '8928288666:AAFBOwn5ebX4n_ZPlU1i6JmoLgDEJ0_f0lk';
const CHAT_ID = '-5133794263';

export const telegramService = {
  /**
   * Sends a formatted HTML notification message to the configured Telegram chat.
   */
  async sendOrderNotification(order: Order): Promise<boolean> {
    if (!BOT_TOKEN || !CHAT_ID) {
      console.warn('Telegram Bot Token or Chat ID is not configured in environment variables.');
      return false;
    }

    try {
      const itemsList = order.items
        .map(item => `▫️ <b>${item.nameSnapshot}</b>\n   ↳ Số lượng: ${item.qty}\n   ↳ Đơn giá: ${formatMoney(item.priceSnapshot)}\n   ↳ Thành tiền: ${formatMoney(item.priceSnapshot * item.qty)}`)
        .join('\n');

      const adminUrl = `${window.location.origin}/admin`;
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

      const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        console.error('Telegram API error response:', errData);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to send Telegram notification:', error);
      return false;
    }
  }
};
