import { Order } from '@/types';
import { formatMoney } from '@/utils/money';

const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

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
        .map(item => `• ${item.nameSnapshot} x${item.qty} (${formatMoney(item.priceSnapshot * item.qty)})`)
        .join('\n');

      const adminUrl = `${window.location.origin}/admin`;
      
      const message = [
        `<b>🔔 CÓ ĐƠN HÀNG MỚI! (#${order.orderCode})</b>\n`,
        `<b>👤 Khách hàng:</b> ${order.customer.fullName}`,
        `<b>📞 Số điện thoại:</b> ${order.customer.phone}`,
        `<b>📍 Địa chỉ:</b> ${order.customer.address}`,
        `<b>💳 Thanh toán:</b> ${order.paymentMethod.toUpperCase()}`,
        order.notes ? `<b>📝 Ghi chú:</b> <i>${order.notes}</i>` : '',
        `\n<b>📦 Chi tiết sản phẩm:</b>`,
        itemsList,
        `\n<b>💰 Tổng thanh toán: ${formatMoney(order.totals.total)}</b>\n`,
        `👉 <a href="${adminUrl}">Nhấn vào đây để duyệt đơn hàng</a>`
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
