import { Order } from '@/types';
import { formatMoney } from '@/utils/money';

const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  COD: '💵 COD (Thanh toán khi nhận hàng)',
  BANK_TRANSFER: '🏦 Chuyển khoản ngân hàng',
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  unpaid: '⏳ Chưa thanh toán',
  deposit_50: '💰 Đã cọc 50%',
  paid_100: '✅ Đã thanh toán 100%',
};

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

      const paymentLine = PAYMENT_METHOD_LABELS[order.paymentMethod] || order.paymentMethod;
      const statusLine = PAYMENT_STATUS_LABELS[order.paymentStatus] || order.paymentStatus;
      
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
        `🏷 <b>Phương thức:</b> ${paymentLine}`,
        `📊 <b>Trạng thái TT:</b> ${statusLine}`,
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
  },

  /**
   * Sends a payment confirmation notification when customer confirms bank transfer.
   */
  async sendPaymentConfirmation(order: Order, depositType: 'deposit_50' | 'paid_100'): Promise<boolean> {
    if (!BOT_TOKEN || !CHAT_ID) return false;

    try {
      const depositLabel = depositType === 'paid_100' ? '💯 THANH TOÁN 100%' : '5️⃣0️⃣ ĐẶT CỌC 50%';
      const amount = depositType === 'paid_100' ? order.totals.total : Math.round(order.totals.total / 2);
      const confirmTime = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

      const message = [
        `🏦 <b>XÁC NHẬN CHUYỂN KHOẢN</b> 🏦`,
        `━━━━━━━━━━━━━━━━━━`,
        `📦 <b>Mã đơn:</b> <code>#${order.orderCode}</code>`,
        `👤 <b>Khách hàng:</b> ${order.customer.fullName}`,
        `📱 <b>SĐT:</b> <code>${order.customer.phone}</code>`,
        ``,
        `💳 <b>Loại:</b> ${depositLabel}`,
        `💰 <b>Số tiền CK:</b> <b>${formatMoney(amount)}</b>`,
        `⏱ <b>Thời điểm XN:</b> ${confirmTime}`,
        `📝 <b>Nội dung CK:</b> <code>${order.orderCode}</code>`,
        ``,
        `⚠️ <b>VUI LÒNG KIỂM TRA TÀI KHOẢN MBBANK ĐỂ XÁC NHẬN!</b>`,
        `🏦 STK: <code>0385959294</code> | TRAN BIEU`,
      ].join('\n');

      const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to send payment confirmation:', error);
      return false;
    }
  },
};
