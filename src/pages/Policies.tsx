import { Layout } from '@/components/layout/Layout';
import { ShieldCheck, RefreshCw, Lock, Mail, Phone } from 'lucide-react';

const Policies = () => {
  return (
    <Layout>
      {/* Hero Section with Background */}
      <section className="relative overflow-hidden py-16 bg-gradient-to-br from-green-950 via-emerald-900 to-teal-950">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=600&fit=crop"
            alt="Forest Canopy"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-green-950/60 via-emerald-900/65 to-teal-950/70" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl lg:text-5xl font-black italic text-white mb-4 drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]">
            <span className="bg-gradient-to-r from-emerald-300 via-green-300 to-teal-300 bg-clip-text text-transparent">Chính sách</span> B-ECO
          </h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
            Cam kết mang đến trải nghiệm mua sắm tốt nhất cho khách hàng
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Warranty Policy */}
          <section className="bg-card border border-border rounded-xl p-6 lg:p-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-bold">Chính sách bảo hành</h2>
            </div>
            
            <div className="space-y-4 text-muted-foreground">
              <p>
                <strong className="text-foreground">Thời hạn bảo hành:</strong> 3 tháng kể từ ngày mua hàng.
              </p>
              
              <div>
                <strong className="text-foreground">Điều kiện bảo hành:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Sản phẩm bị lỗi do quá trình sản xuất (nứt, vỡ, biến dạng khi chưa sử dụng)</li>
                  <li>Sản phẩm không đúng với mô tả hoặc hình ảnh</li>
                  <li>Sản phẩm bị hư hỏng trong quá trình vận chuyển</li>
                </ul>
              </div>

              <div>
                <strong className="text-foreground">Không áp dụng bảo hành:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Sản phẩm hư hỏng do sử dụng sai cách</li>
                  <li>Sản phẩm đã qua sử dụng với thực phẩm nóng quá 80°C</li>
                  <li>Sản phẩm bị ngâm nước trong thời gian dài</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Return Policy */}
          <section className="bg-card border border-border rounded-xl p-6 lg:p-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <RefreshCw className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-bold">Chính sách đổi trả</h2>
            </div>
            
            <div className="space-y-4 text-muted-foreground">
              <p>
                <strong className="text-foreground">Thời hạn đổi trả:</strong> 7 ngày kể từ ngày nhận hàng.
              </p>
              
              <div>
                <strong className="text-foreground">Điều kiện đổi trả:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Sản phẩm còn nguyên vẹn, chưa qua sử dụng</li>
                  <li>Còn đầy đủ bao bì, tem nhãn</li>
                  <li>Có hóa đơn hoặc mã đơn hàng</li>
                </ul>
              </div>

              <div>
                <strong className="text-foreground">Quy trình đổi trả:</strong>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Liên hệ hotline hoặc email để yêu cầu đổi trả</li>
                  <li>Gửi hình ảnh sản phẩm lỗi (nếu có)</li>
                  <li>Chờ xác nhận từ B-ECO (trong vòng 24h)</li>
                  <li>Gửi trả sản phẩm theo hướng dẫn</li>
                  <li>Nhận sản phẩm mới hoặc hoàn tiền trong 3-5 ngày làm việc</li>
                </ol>
              </div>

              <p>
                <strong className="text-foreground">Phí đổi trả:</strong> B-ECO chịu phí vận chuyển 
                nếu lỗi từ nhà sản xuất. Khách hàng chịu phí nếu đổi trả vì lý do cá nhân.
              </p>
            </div>
          </section>

          {/* Privacy Policy */}
          <section className="bg-card border border-border rounded-xl p-6 lg:p-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-bold">Chính sách bảo mật</h2>
            </div>
            
            <div className="space-y-4 text-muted-foreground">
              <div>
                <strong className="text-foreground">1. Mục đích thu thập thông tin</strong>
                <p className="mt-2">
                  Chúng tôi thu thập thông tin cá nhân để: xử lý đơn hàng, giao hàng, 
                  liên hệ xác nhận, hỗ trợ khách hàng, và gửi thông tin khuyến mãi 
                  (nếu bạn đồng ý).
                </p>
              </div>

              <div>
                <strong className="text-foreground">2. Phạm vi thu thập</strong>
                <p className="mt-2">
                  Chúng tôi thu thập: họ tên, số điện thoại, địa chỉ giao hàng, email 
                  (nếu có), lịch sử đơn hàng.
                </p>
              </div>

              <div>
                <strong className="text-foreground">3. Thời gian lưu trữ</strong>
                <p className="mt-2">
                  Thông tin được lưu trữ trong suốt thời gian bạn là khách hàng và 
                  thêm 3 năm sau giao dịch cuối cùng để phục vụ bảo hành và hỗ trợ.
                </p>
              </div>

              <div>
                <strong className="text-foreground">4. Chia sẻ thông tin</strong>
                <p className="mt-2">
                  Chúng tôi không bán hoặc chia sẻ thông tin cá nhân với bên thứ ba, 
                  ngoại trừ: đơn vị vận chuyển (để giao hàng), cơ quan pháp luật 
                  (khi có yêu cầu hợp pháp).
                </p>
              </div>

              <div>
                <strong className="text-foreground">5. Quyền của khách hàng</strong>
                <p className="mt-2">Bạn có quyền:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Yêu cầu xem, chỉnh sửa thông tin cá nhân</li>
                  <li>Yêu cầu xóa thông tin (trừ dữ liệu cần thiết cho nghĩa vụ pháp lý)</li>
                  <li>Từ chối nhận email marketing</li>
                  <li>Khiếu nại về việc sử dụng dữ liệu</li>
                </ul>
              </div>

              <div>
                <strong className="text-foreground">6. Bảo mật</strong>
                <p className="mt-2">
                  Chúng tôi sử dụng các biện pháp bảo mật kỹ thuật và tổ chức để bảo vệ 
                  thông tin của bạn khỏi truy cập trái phép, mất mát, hoặc tiết lộ.
                </p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-primary/5 rounded-xl p-6 lg:p-8 text-center">
            <h2 className="text-xl font-bold mb-4">Liên hệ hỗ trợ</h2>
            <p className="text-muted-foreground mb-4">
              Nếu có bất kỳ câu hỏi nào về chính sách của chúng tôi, vui lòng liên hệ:
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>0123 456 789</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>support@bco.vn</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Policies;
