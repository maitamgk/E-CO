import { Order } from '@/types';
import { formatMoney } from '@/utils/money';

export const discordService = {
  /**
   * Sends a formatted rich Embed notification message to the configured Discord webhook.
   */
  async sendOrderNotification(order: Order): Promise<boolean> {
    const webhookUrl = import.meta.env.VITE_DISCORD_WEBHOOK_URL;
    
    if (!webhookUrl) {
      console.warn('Discord Webhook URL is not configured in environment variables.');
      return false;
    }

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
            value: order.paymentMethod.toUpperCase(),
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

      // Add Admin redirect button/link
      embed.fields.push({
        name: '✨ HÀNH ĐỘNG',
        value: `[👉 BẤM VÀO ĐÂY ĐỂ XỬ LÝ ĐƠN](${adminUrl})`,
        inline: false
      });

      const response = await fetch(webhookUrl, {
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
  }
};
