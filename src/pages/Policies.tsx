import { Layout } from '@/components/layout/Layout';
import { ShieldCheck, RefreshCw, Lock, Mail, Phone } from 'lucide-react';

const Policies = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-[#fcf9f4] border-b border-border/40 py-16 text-center">
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-3xl md:text-4xl font-heading text-primary mb-4">
            Chính sách B-ECO
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto font-light">
            Cam kết mang đến trải nghiệm mua sắm tốt nhất cho khách hàng
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Warranty Policy */}
          <section className="bg-white border border-border/40 p-8">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="h-6 w-6 text-primary stroke-[1.5]" />
              <h2 className="text-2xl font-heading text-primary">Chính sách bảo hành</h2>
            </div>

            <div className="space-y-4 text-muted-foreground font-light text-[15px]">
              <p>
                <strong className="text-foreground font-medium">Thời hạn bảo hành:</strong> 3 tháng kể từ ngày mua hàng.
              </p>

              <div>
                <strong className="text-foreground font-medium">Điều kiện bảo hành:</strong>
                <ul className="list-disc list-inside mt-2 space-y-2">
                  <li>Sản phẩm bị lỗi do quá trình sản xuất (nứt, vỡ, biến dạng khi chưa sử dụng)</li>
                  <li>Sản phẩm không đúng với mô tả hoặc hình ảnh</li>
                  <li>Sản phẩm bị hư hỏng trong quá trình vận chuyển</li>
                </ul>
              </div>

              <div className="pt-2">
                <strong className="text-foreground font-medium">Không áp dụng bảo hành:</strong>
                <ul className="list-disc list-inside mt-2 space-y-2">
                  <li>Sản phẩm hư hỏng do sử dụng sai cách</li>
                  <li>Sản phẩm đã qua sử dụng với thực phẩm nóng quá 80°C</li>
                  <li>Sản phẩm bị ngâm nước trong thời gian dài</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Return Policy */}
          <section className="bg-[#fcf9f4] border border-border/40 p-8">
            <div className="flex items-center gap-3 mb-6">
              <RefreshCw className="h-6 w-6 text-primary stroke-[1.5]" />
              <h2 className="text-2xl font-heading text-primary">Chính sách đổi trả</h2>
            </div>

            <div className="space-y-4 text-muted-foreground font-light text-[15px]">
              <p>
                <strong className="text-foreground font-medium">Thời hạn đổi trả:</strong> 7 ngày kể từ ngày nhận hàng.
              </p>

              <div>
                <strong className="text-foreground font-medium">Điều kiện đổi trả:</strong>
                <ul className="list-disc list-inside mt-2 space-y-2">
                  <li>Sản phẩm còn nguyên vẹn, chưa qua sử dụng</li>
                  <li>Còn đầy đủ bao bì, tem nhãn</li>
                  <li>Có hóa đơn hoặc mã đơn hàng</li>
                </ul>
              </div>

              <div className="pt-2">
                <strong className="text-foreground font-medium">Quy trình đổi trả:</strong>
                <ol className="list-decimal list-inside mt-2 space-y-2">
                  <li>Liên hệ hotline hoặc email để yêu cầu đổi trả</li>
                  <li>Gửi hình ảnh sản phẩm lỗi (nếu có)</li>
                  <li>Chờ xác nhận từ B-ECO (trong vòng 24h)</li>
                  <li>Gửi trả sản phẩm theo hướng dẫn</li>
                  <li>Nhận sản phẩm mới hoặc hoàn tiền trong 3-5 ngày làm việc</li>
                </ol>
              </div>

              <p className="pt-2">
                <strong className="text-foreground font-medium">Phí đổi trả:</strong> B-ECO chịu phí vận chuyển 
                nếu lỗi từ nhà sản xuất. Khách hàng chịu phí nếu đổi trả vì lý do cá nhân.
              </p>
            </div>
          </section>

          {/* Privacy Policy */}
          <section className="bg-white border border-border/40 p-8">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="h-6 w-6 text-primary stroke-[1.5]" />
              <h2 className="text-2xl font-heading text-primary">Chính sách bảo mật</h2>
            </div>

            <div className="space-y-6 text-muted-foreground font-light text-[15px]">
              <div>
                <strong className="text-foreground font-medium">1. Mục đích thu thập thông tin</strong>
                <p className="mt-2">
                  Chúng tôi thu thập thông tin cá nhân để: xử lý đơn hàng, giao hàng,
                  liên hệ xác nhận, hỗ trợ khách hàng, và gửi thông tin khuyến mãi
                  (nếu bạn đồng ý).
                </p>
              </div>

              <div>
                <strong className="text-foreground font-medium">2. Phạm vi thu thập</strong>
                <p className="mt-2">
                  Chúng tôi thu thập: họ tên, số điện thoại, địa chỉ giao hàng, email
                  (nếu có), lịch sử đơn hàng.
                </p>
              </div>

              <div>
                <strong className="text-foreground font-medium">3. Thời gian lưu trữ</strong>
                <p className="mt-2">
                  Thông tin được lưu trữ trong suốt thời gian bạn là khách hàng và
                  thêm 3 năm sau giao dịch cuối cùng để phục vụ bảo hành và hỗ trợ.
                </p>
              </div>

              <div>
                <strong className="text-foreground font-medium">4. Chia sẻ thông tin</strong>
                <p className="mt-2">
                  Chúng tôi không bán hoặc chia sẻ thông tin cá nhân với bên thứ ba,
                  ngoại trừ: đơn vị vận chuyển (để giao hàng), cơ quan pháp luật
                  (khi có yêu cầu hợp pháp).
                </p>
              </div>

              <div>
                <strong className="text-foreground font-medium">5. Quyền của khách hàng</strong>
                <p className="mt-2 mb-2">Bạn có quyền:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Yêu cầu xem, chỉnh sửa thông tin cá nhân</li>
                  <li>Yêu cầu xóa thông tin (trừ dữ liệu cần thiết cho nghĩa vụ pháp lý)</li>
                  <li>Từ chối nhận email marketing</li>
                  <li>Khiếu nại về việc sử dụng dữ liệu</li>
                </ul>
              </div>

              <div>
                <strong className="text-foreground font-medium">6. Bảo mật</strong>
                <p className="mt-2">
                  Chúng tôi sử dụng các biện pháp bảo mật kỹ thuật và tổ chức để bảo vệ
                  thông tin của bạn khỏi truy cập trái phép, mất mát, hoặc tiết lộ.
                </p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-primary p-8 text-center text-primary-foreground">
            <h2 className="text-2xl font-heading mb-4">Liên hệ hỗ trợ</h2>
            <p className="text-primary-foreground/80 mb-6 font-light">
              Nếu có bất kỳ câu hỏi nào về chính sách của chúng tôi, vui lòng liên hệ:
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 stroke-[1.5]" />
                <span className="font-medium tracking-wide">0123 456 789</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 stroke-[1.5]" />
                <span className="font-medium tracking-wide">support@b-eco.vn</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Policies;
