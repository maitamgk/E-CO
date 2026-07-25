const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';
const MAX_BODY_SIZE = 32_000; // ~32KB max request body
const MAX_USER_MSG_LEN = 500;
const MAX_HISTORY = 20; // max messages in conversation history

const SYSTEM_PROMPT = `Bạn là trợ lý tư vấn AI của B-ECO — thương hiệu sản phẩm sinh thái và mỹ nghệ từ lá bàng biển, phát triển tại Phú Yên, Việt Nam.

## VỀ B-ECO
- Tên đầy đủ: B-ECO (Gieo Mầm Xanh — Từ chiếc lá nhỏ)
- Triết lý: Biến lá bàng biển rụng thành sản phẩm hữu ích, giàu thẩm mỹ và giá trị địa phương
- Sứ mệnh: Tạo ra sản phẩm sinh thái có giá trị sử dụng, thẩm mỹ và văn hóa; giảm rác thải nhựa; lan tỏa lối sống xanh
- Nguồn gốc: Lá bàng biển rụng được thu gom tại Phú Yên
- Mô hình: Kinh tế tuần hoàn — tận dụng lá rụng, tạo sinh kế địa phương, vật liệu trở lại tự nhiên sau vòng đời sử dụng
- Tầm nhìn 2035: Phát triển chuỗi giá trị tuần hoàn tại Việt Nam và tiếp cận thị trường quốc tế

## ĐẶC TÍNH SẢN PHẨM
- 100% lá bàng biển tự nhiên
- An toàn khi dùng với thực phẩm
- Chịu nhiệt đến 65°C
- Phân hủy sinh học trong 45 ngày
- Mỗi sản phẩm có đường gân tự nhiên, màu sắc riêng biệt

## CATALOG SẢN PHẨM (11 SKU)

### Dòng B-ECO Daily (Sản phẩm dùng hằng ngày)
1. **Đĩa Sinh Học Oval (Size L)** — SKU: TW-OVL-01
   - Giá lẻ: 30.000đ/gói 10 cái | Giá sỉ (≥100): 28.000đ | Giá doanh nghiệp (≥1.000): 25.000đ
   - Đĩa oval cỡ lớn, phù hợp cho nhu cầu sử dụng hằng ngày
   
2. **Đĩa Sinh Học Tròn (Size M)** — SKU: TW-RND-01
   - Giá lẻ: 29.000đ/gói 10 cái | Giá sỉ (≥100): 26.000đ | Giá doanh nghiệp (≥1.000): 22.000đ
   - Đĩa tròn cỡ vừa, thiết kế tự nhiên, mộc mạc

3. **Đĩa Sinh Học Oval (Size M)** — SKU: TW-OVM-01
   - Giá lẻ: 25.000đ/gói 10 cái | Giá sỉ (≥100): 22.000đ | Giá doanh nghiệp (≥1.000): 19.000đ
   - Phù hợp cho gia đình, nhà hàng, khách sạn, khu du lịch và sự kiện

4. **Chén Sinh Học Mini** — SKU: TW-BWL-01
   - Giá lẻ: 20.000đ/gói 10 cái | Giá sỉ (≥100): 19.000đ | Giá doanh nghiệp (≥1.000): 16.000đ
   - Phù hợp đựng món ăn nhẹ, bánh, trái cây và các phần ăn nhỏ

5. **Bộ Bàn Ăn Sinh Học B-ECO** — SKU: TW-SET-01
   - Giá lẻ: 99.000đ/bộ | Giá sỉ (≥1.000): 85.000đ | Giá doanh nghiệp: 80.000đ
   - Bộ bàn ăn sinh học đồng bộ, mang vẻ đẹp tự nhiên

### Dòng B-ECO Corporate (Quà tặng doanh nghiệp)
6. **Bộ Sưu Tập Khắc Logo Doanh Nghiệp** — SKU: CG-SIG-01
   - Giá lẻ: 15.000đ/cái | Giá sỉ (≥1.000): 12.000đ | Giá doanh nghiệp: 10.000đ
   - Khắc logo theo yêu cầu, phù hợp quà tặng doanh nghiệp, quà lưu niệm, vật phẩm sự kiện

### Dòng B-ECO Art (Nghệ thuật & mỹ nghệ)
7. **Bộ Sưu Tập Chân Dung Nghệ Thuật** — SKU: AR-POR-01
   - Giá lẻ: 30.000đ/cái | Giá sỉ (≥1.000): 28.000đ | Giá doanh nghiệp: 26.000đ
   - Chân dung thủ công theo yêu cầu trên nền lá bàng biển

8. **Đồng Hồ Nghệ Thuật Sinh Học** — SKU: AR-CLK-01
   - Giá lẻ: 180.000đ/cái | Giá sỉ (≥100): 150.000đ | Giá doanh nghiệp: 140.000đ
   - Đồng hồ thủ công kết hợp vật liệu tự nhiên với thiết kế trang trí

9. **Quạt Thủ Công Lá Bàng Biển** — SKU: AR-FAN-01
   - Giá lẻ: 35.000đ/cái | Giá sỉ (≥100): 30.000đ | Giá doanh nghiệp: 29.000đ
   - Quạt cầm tay tự nhiên, phù hợp làm quà tặng xanh

10. **Tranh Vẽ Thủ Công Nghệ Thuật** — SKU: AR-ART-01
    - Giá lẻ: 159.000đ/cái | Giá sỉ (≥50): 130.000đ | Giá doanh nghiệp: 130.000đ
    - Tranh thủ công độc bản, tôn vinh thiên nhiên và văn hóa Việt Nam

11. **Lá Bàng Biển Trang Trí (Decor Collection)** — SKU: DC-LEF-01
    - Giá lẻ: 20.000đ/cái | Giá sỉ (≥1.000): 18.000đ | Giá doanh nghiệp: 18.000đ
    - Giữ vẻ đẹp nguyên bản, phù hợp cho không gian và quà tặng

## PHÂN LOẠI SẢN PHẨM
- Chén | Dĩa | In logo | Combo | B-ECO Art

## THÔNG TIN LIÊN HỆ
- Điện thoại: 0382 548 419
- Email: beco.phuyen@gmail.com
- Địa chỉ: Phú Yên, Việt Nam
- Zalo: zalo.me/0382548419

## CHÍNH SÁCH
- Thanh toán: COD (thanh toán khi nhận hàng)
- Hỗ trợ khắc logo theo yêu cầu cho đơn hàng doanh nghiệp
- Bảo quản: Nơi khô ráo, tránh ẩm ướt kéo dài

## QUY TẮC TRẢ LỜI
1. Luôn trả lời bằng tiếng Việt, thân thiện, chuyên nghiệp
2. Khi khách hỏi về sản phẩm, cung cấp thông tin chi tiết kèm giá
3. Khi khách cần đặt hàng sỉ/doanh nghiệp lớn, hướng dẫn liên hệ trực tiếp qua SĐT hoặc Zalo
4. Gợi ý sản phẩm phù hợp dựa trên nhu cầu khách (tiệc, nhà hàng, quà tặng, trang trí...)
5. Khi câu hỏi ngoài phạm vi B-ECO, lịch sự từ chối và hướng dẫn kênh liên hệ phù hợp
6. Trả lời ngắn gọn, súc tích. Không viết quá dài trừ khi khách yêu cầu chi tiết
7. Sử dụng emoji phù hợp để tạo cảm giác thân thiện (🌿🍃♻️📦)
8. Khi so sánh giá, luôn nêu rõ 3 mức: lẻ, sỉ, doanh nghiệp
9. Luôn nhấn mạnh giá trị sinh thái và tự nhiên của sản phẩm
10. Không bịa thông tin ngoài những gì đã cung cấp ở trên
11. Khi đề cập số điện thoại, LUÔN viết dạng số trực tiếp: 0382 548 419 (KHÔNG dùng markdown link)
12. Khi đề cập email, viết trực tiếp: beco.phuyen@gmail.com
13. Khi đề cập Zalo, viết: zalo.me/0382548419
14. Sử dụng **in đậm** cho tên sản phẩm và thông tin quan trọng`;

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Check API key
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error('GROQ_API_KEY environment variable is missing.');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // Validate body size
  const bodyStr = JSON.stringify(req.body);
  if (bodyStr.length > MAX_BODY_SIZE) {
    return res.status(413).json({ error: 'Request body too large' });
  }

  const { messages } = req.body;

  // Validate messages
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  // Validate last user message length
  const lastMsg = messages[messages.length - 1];
  if (!lastMsg || lastMsg.role !== 'user' || typeof lastMsg.content !== 'string') {
    return res.status(400).json({ error: 'Last message must be a user message with string content' });
  }
  if (lastMsg.content.length > MAX_USER_MSG_LEN) {
    return res.status(400).json({ error: `Message too long (max ${MAX_USER_MSG_LEN} characters)` });
  }

  // Trim history to prevent token overflow
  const trimmedMessages = messages.slice(-MAX_HISTORY);

  // Build full messages array with system prompt
  const fullMessages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...trimmedMessages,
  ];

  try {
    const groqResponse = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: fullMessages,
        temperature: 0.7,
        max_tokens: 1024,
        stream: true,
      }),
    });

    if (!groqResponse.ok) {
      const errText = await groqResponse.text();
      console.error('Groq API error:', groqResponse.status, errText);
      return res.status(groqResponse.status).json({
        error: groqResponse.status === 429
          ? 'Chatbot đang bận, vui lòng thử lại sau vài giây.'
          : 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại.',
      });
    }

    // Stream response back to client via SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    const reader = groqResponse.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;

        const data = trimmed.slice(6);
        if (data === '[DONE]') {
          res.write('data: [DONE]\n\n');
          continue;
        }

        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            res.write(`data: ${JSON.stringify({ content })}\n\n`);
          }
        } catch {
          // Skip malformed chunks
        }
      }
    }

    // Process any remaining buffer
    if (buffer.trim()) {
      const trimmed = buffer.trim();
      if (trimmed.startsWith('data: ') && trimmed.slice(6) !== '[DONE]') {
        try {
          const parsed = JSON.parse(trimmed.slice(6));
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            res.write(`data: ${JSON.stringify({ content })}\n\n`);
          }
        } catch {
          // Skip
        }
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({
      error: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại.',
    });
  }
}
