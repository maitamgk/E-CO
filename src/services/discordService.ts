import { Order } from '@/types';
import { formatMoney } from '@/utils/money';

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  COD: '💵 COD',
  BANK_TRANSFER: '🏦 Chuyển khoản',
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  unpaid: '⏳ Chưa thanh toán',
  deposit_50: '💰 Đã cọc 50%',
  paid_100: '✅ Đã thanh toán 100%',
};

export const discordService = {
  /**
   * Sends a formatted rich Embed notification message to the configured Discord webhook.
   */
  async sendOrderNotification(order: Order): Promise<boolean> {
    try {
      const itemsList = order.items
        .map(item => `▫️ **${item.nameSnapshot}**\n   ↳ Số lượng: ${item.qty} | Đơn giá: ${formatMoney(item.priceSnapshot)}\n   ↳ Thành tiền: ${formatMoney(item.priceSnapshot * item.qty)}`)
        .join('\n');

      const adminUrl = `${window.location.origin}/admin`;
      const orderDate = new Date(order.createdAt).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
      
      const embed = {
        title: '🌟 ĐƠN HÀNG MỚI TỪ B-ECO 🌟',
        color: 3066993, // Green color Hex #2ecc71 -> decimal 3066993
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
            value: PAYMENT_METHOD_LABELS[order.paymentMethod] || order.paymentMethod,
            inline: true
          },
          {
            name: '📊 TRẠNG THÁI TT',
            value: PAYMENT_STATUS_LABELS[order.paymentStatus] || order.paymentStatus,
            inline: true
          }
        ],
        timestamp: new Date(order.createdAt).toISOString()
      };

      if (order.notes) {
        embed.fields.push({
          name: '📝 GHI CHÚ',
          value: `*${order.notes}*`,
          inline: false
        });
      }

      embed.fields.push({
        name: '✨ HÀNH ĐỘNG',
        value: `[👉 BẤM VÀO ĐÂY ĐỂ XỬ LÝ ĐƠN](${adminUrl})`,
        inline: false
      });

      const response = await fetch('/api/notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'B-ECO Order Bot',
          avatar_url: `${window.location.origin}/favicon.jpg`,
          embeds: [embed],
        }),
      });

      if (!response.ok) {
        const errData = await response.text();
        console.error('Discord Webhook API error response:', errData);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to send Discord notification:', error);
      return false;
    }
  },

  /**
   * Sends a payment confirmation notification to Discord.
   */
  async sendPaymentConfirmation(order: Order, depositType: 'deposit_50' | 'paid_100'): Promise<boolean> {
    try {
      const depositLabel = depositType === 'paid_100' ? '💯 THANH TOÁN 100%' : '5️⃣0️⃣ ĐẶT CỌC 50%';
      const amount = depositType === 'paid_100' ? order.totals.total : Math.round(order.totals.total / 2);
      const confirmTime = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

      const embed = {
        title: '🏦 XÁC NHẬN CHUYỂN KHOẢN 🏦',
        color: 16750848, // Orange #FFB800
        description: [
          `**Mã đơn:** \`#${order.orderCode}\``,
          `**Khách hàng:** ${order.customer.fullName}`,
          `**SĐT:** \`${order.customer.phone}\``,
        ].join('\n'),
        fields: [
          { name: '💳 Loại', value: depositLabel, inline: true },
          { name: '💰 Số tiền CK', value: `**${formatMoney(amount)}**`, inline: true },
          { name: '⏱ Thời điểm XN', value: confirmTime, inline: true },
          { name: '📝 Nội dung CK', value: `\`${order.orderCode}\``, inline: true },
          { name: '⚠️ HÀNH ĐỘNG', value: '**Kiểm tra tài khoản MBBank (0385959294 - TRAN BIEU) để xác nhận!**', inline: false },
        ],
        timestamp: new Date().toISOString(),
      };

      const response = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'B-ECO Payment Bot',
          avatar_url: `${window.location.origin}/favicon.jpg`,
          embeds: [embed],
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to send Discord payment confirmation:', error);
      return false;
    }
  },
};
