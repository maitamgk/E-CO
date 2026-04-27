import { Layout } from '@/components/layout/Layout';
import { ShieldCheck, RefreshCw, Lock, Mail, Phone } from 'lucide-react';
import { ScrollAnimate } from '@/components/ui/scroll-animate';

const Policies = () => {
  return (
    <Layout>
      {/* Hero Section with Background */}
      <section className="relative overflow-hidden py-16 bg-gradient-to-br from-green-950 via-emerald-900 to-teal-950">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=600&fit=crop"
            alt="Forest Canopy"
            className="w-full h-full object-cover object-center opacity-35"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-green-950/60 via-emerald-900/65 to-teal-950/70" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl lg:text-7xl font-heading font-bold text-white mb-4 drop-shadow-[0_2px_20px_rgba(0,0,0,0.5)]">
            Chính sách <span className="text-emerald-300">B-ECO</span>
          </h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
            Cam kết mang đến trải nghiệm mua sắm tốt nhất cho khách hàng
          </p>
        </div>
      </section>

      <div className="bg-[#fdfaf5] min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto space-y-16">
          {/* Warranty Policy */}
          <ScrollAnimate animation="fade-in-up">
            <section className="bg-white border-2 border-[#1e332a] rounded-none p-8 lg:p-12 relative">
              {/* Decorative sharp corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#1e332a]/5 border-l-2 border-b-2 border-[#1e332a]" />
              
              <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
                <div className="lg:col-span-4 border-b-2 lg:border-b-0 lg:border-r-2 border-[#1e332a]/10 pb-8 lg:pb-0 pr-0 lg:pr-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 bg-[#1e332a] text-white rounded-none shrink-0 shadow-[4px_4px_0px_0px_rgba(45,74,62,1)]">
                      <ShieldCheck className="h-8 w-8" />
                    </div>
                  </div>
                  <h2 className="text-4xl font-heading font-bold text-[#1e332a] mb-4">Chính sách bảo hành</h2>
                  <p className="text-gray-500 font-medium tracking-wide uppercase text-sm">Cam kết chất lượng</p>
                </div>

                <div className="lg:col-span-8 space-y-8 text-gray-700 text-lg leading-relaxed">
                <p className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-emerald-500 rounded-none"></span>
                  <strong className="text-[#1e332a] uppercase tracking-wider text-sm">Thời hạn bảo hành:</strong> 
                  <span>3 tháng kể từ ngày mua hàng.</span>
                </p>

                <div className="bg-[#fdfaf5] p-6 border border-[#1e332a]/10">
                  <strong className="text-[#1e332a] uppercase tracking-wider text-sm block mb-4 border-b border-[#1e332a]/10 pb-2">Điều kiện bảo hành:</strong>
                  <ul className="list-none mt-2 space-y-3">
                    <li className="flex items-start gap-3"><span className="text-emerald-500 mt-1">■</span> Sản phẩm bị lỗi do quá trình sản xuất (nứt, vỡ, biến dạng khi chưa sử dụng)</li>
                    <li className="flex items-start gap-3"><span className="text-emerald-500 mt-1">■</span> Sản phẩm không đúng với mô tả hoặc hình ảnh</li>
                    <li className="flex items-start gap-3"><span className="text-emerald-500 mt-1">■</span> Sản phẩm bị hư hỏng trong quá trình vận chuyển</li>
                  </ul>
                </div>

                <div className="bg-red-50/50 p-6 border border-red-900/10">
                  <strong className="text-red-900 uppercase tracking-wider text-sm block mb-4 border-b border-red-900/10 pb-2">Không áp dụng bảo hành:</strong>
                  <ul className="list-none mt-2 space-y-3">
                    <li className="flex items-start gap-3"><span className="text-red-500 mt-1">■</span> Sản phẩm hư hỏng do sử dụng sai cách</li>
                    <li className="flex items-start gap-3"><span className="text-red-500 mt-1">■</span> Sản phẩm đã qua sử dụng với thực phẩm nóng quá 80°C</li>
                    <li className="flex items-start gap-3"><span className="text-red-500 mt-1">■</span> Sản phẩm bị ngâm nước trong thời gian dài</li>
                  </ul>
                </div>
              </div>
              </div>
            </section>
          </ScrollAnimate>

          {/* Return Policy */}
          <ScrollAnimate animation="fade-in-up" delay={100}>
            <section className="bg-white border-2 border-[#1e332a] rounded-none p-8 lg:p-12 relative">
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#1e332a]/5 border-l-2 border-b-2 border-[#1e332a]" />
              <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
                <div className="lg:col-span-4 border-b-2 lg:border-b-0 lg:border-r-2 border-[#1e332a]/10 pb-8 lg:pb-0 pr-0 lg:pr-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 bg-[#1e332a] text-white rounded-none shrink-0 shadow-[4px_4px_0px_0px_rgba(45,74,62,1)]">
                      <RefreshCw className="h-8 w-8" />
                    </div>
                  </div>
                  <h2 className="text-4xl font-heading font-bold text-[#1e332a] mb-4">Chính sách đổi trả</h2>
                  <p className="text-gray-500 font-medium tracking-wide uppercase text-sm">Minh bạch & Nhanh chóng</p>
                </div>

                <div className="lg:col-span-8 space-y-8 text-gray-700 text-lg leading-relaxed">
                <p className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-emerald-500 rounded-none"></span>
                  <strong className="text-[#1e332a] uppercase tracking-wider text-sm">Thời hạn đổi trả:</strong> 
                  <span>7 ngày kể từ ngày nhận hàng.</span>
                </p>

                <div className="bg-[#fdfaf5] p-6 border border-[#1e332a]/10">
                  <strong className="text-[#1e332a] uppercase tracking-wider text-sm block mb-4 border-b border-[#1e332a]/10 pb-2">Điều kiện đổi trả:</strong>
                  <ul className="list-none mt-2 space-y-3">
                    <li className="flex items-start gap-3"><span className="text-emerald-500 mt-1">■</span> Sản phẩm còn nguyên vẹn, chưa qua sử dụng</li>
                    <li className="flex items-start gap-3"><span className="text-emerald-500 mt-1">■</span> Còn đầy đủ bao bì, tem nhãn</li>
                    <li className="flex items-start gap-3"><span className="text-emerald-500 mt-1">■</span> Có hóa đơn hoặc mã đơn hàng</li>
                  </ul>
                </div>

                <div className="bg-white p-6 border border-[#1e332a]/20">
                  <strong className="text-[#1e332a] uppercase tracking-wider text-sm block mb-4 border-b border-[#1e332a]/10 pb-2">Quy trình đổi trả:</strong>
                  <ol className="list-none mt-2 space-y-4">
                    <li className="flex items-start gap-3"><span className="font-bold text-[#1e332a] w-6">01.</span> Liên hệ hotline hoặc email để yêu cầu đổi trả</li>
                    <li className="flex items-start gap-3"><span className="font-bold text-[#1e332a] w-6">02.</span> Gửi hình ảnh sản phẩm lỗi (nếu có)</li>
                    <li className="flex items-start gap-3"><span className="font-bold text-[#1e332a] w-6">03.</span> Chờ xác nhận từ B-ECO (trong vòng 24h)</li>
                    <li className="flex items-start gap-3"><span className="font-bold text-[#1e332a] w-6">04.</span> Gửi trả sản phẩm theo hướng dẫn</li>
                    <li className="flex items-start gap-3"><span className="font-bold text-[#1e332a] w-6">05.</span> Nhận sản phẩm mới hoặc hoàn tiền trong 3-5 ngày làm việc</li>
                  </ol>
                </div>

                <div className="p-6 bg-[#1e332a] text-white">
                  <strong className="text-emerald-300 uppercase tracking-wider text-sm block mb-2">Phí đổi trả:</strong> 
                  <p>B-ECO chịu phí vận chuyển nếu lỗi từ nhà sản xuất. Khách hàng chịu phí nếu đổi trả vì lý do cá nhân.</p>
                </div>
              </div>
              </div>
            </section>
          </ScrollAnimate>

          {/* Privacy Policy */}
          <ScrollAnimate animation="fade-in-up" delay={200}>
            <section className="bg-white border-2 border-[#1e332a] rounded-none p-8 lg:p-12 relative">
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#1e332a]/5 border-l-2 border-b-2 border-[#1e332a]" />
              <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
                <div className="lg:col-span-4 border-b-2 lg:border-b-0 lg:border-r-2 border-[#1e332a]/10 pb-8 lg:pb-0 pr-0 lg:pr-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 bg-[#1e332a] text-white rounded-none shrink-0 shadow-[4px_4px_0px_0px_rgba(45,74,62,1)]">
                      <Lock className="h-8 w-8" />
                    </div>
                  </div>
                  <h2 className="text-4xl font-heading font-bold text-[#1e332a] mb-4">Chính sách bảo mật</h2>
                  <p className="text-gray-500 font-medium tracking-wide uppercase text-sm">An toàn tuyệt đối</p>
                </div>

                <div className="lg:col-span-8 space-y-8 text-gray-700 text-lg leading-relaxed">
                <div className="border-l-4 border-[#1e332a] pl-6">
                  <strong className="text-[#1e332a] font-heading text-xl block mb-2">1. Mục đích thu thập thông tin</strong>
                  <p>
                    Chúng tôi thu thập thông tin cá nhân để: xử lý đơn hàng, giao hàng,
                    liên hệ xác nhận, hỗ trợ khách hàng, và gửi thông tin khuyến mãi
                    (nếu bạn đồng ý).
                  </p>
                </div>

                <div className="border-l-4 border-[#1e332a] pl-6">
                  <strong className="text-[#1e332a] font-heading text-xl block mb-2">2. Phạm vi thu thập</strong>
                  <p>
                    Chúng tôi thu thập: họ tên, số điện thoại, địa chỉ giao hàng, email
                    (nếu có), lịch sử đơn hàng.
                  </p>
                </div>

                <div className="border-l-4 border-[#1e332a] pl-6">
                  <strong className="text-[#1e332a] font-heading text-xl block mb-2">3. Thời gian lưu trữ</strong>
                  <p>
                    Thông tin được lưu trữ trong suốt thời gian bạn là khách hàng và
                    thêm 3 năm sau giao dịch cuối cùng để phục vụ bảo hành và hỗ trợ.
                  </p>
                </div>

                <div className="border-l-4 border-[#1e332a] pl-6">
                  <strong className="text-[#1e332a] font-heading text-xl block mb-2">4. Chia sẻ thông tin</strong>
                  <p>
                    Chúng tôi không bán hoặc chia sẻ thông tin cá nhân với bên thứ ba,
                    ngoại trừ: đơn vị vận chuyển (để giao hàng), cơ quan pháp luật
                    (khi có yêu cầu hợp pháp).
                  </p>
                </div>

                <div className="border-l-4 border-[#1e332a] pl-6">
                  <strong className="text-[#1e332a] font-heading text-xl block mb-2">5. Quyền của khách hàng</strong>
                  <p>Bạn có quyền:</p>
                  <ul className="list-none mt-3 space-y-2">
                    <li className="flex items-start gap-3"><span className="text-emerald-500 mt-1">■</span> Yêu cầu xem, chỉnh sửa thông tin cá nhân</li>
                    <li className="flex items-start gap-3"><span className="text-emerald-500 mt-1">■</span> Yêu cầu xóa thông tin (trừ dữ liệu cần thiết cho nghĩa vụ pháp lý)</li>
                    <li className="flex items-start gap-3"><span className="text-emerald-500 mt-1">■</span> Từ chối nhận email marketing</li>
                    <li className="flex items-start gap-3"><span className="text-emerald-500 mt-1">■</span> Khiếu nại về việc sử dụng dữ liệu</li>
                  </ul>
                </div>

                <div className="border-l-4 border-[#1e332a] pl-6">
                  <strong className="text-[#1e332a] font-heading text-xl block mb-2">6. Bảo mật</strong>
                  <p>
                    Chúng tôi sử dụng các biện pháp bảo mật kỹ thuật và tổ chức để bảo vệ
                    thông tin của bạn khỏi truy cập trái phép, mất mát, hoặc tiết lộ.
                  </p>
                </div>
              </div>
              </div>
            </section>
          </ScrollAnimate>

          {/* Contact */}
          <ScrollAnimate animation="fade-in-up" delay={300}>
            <section className="bg-[#1e332a] text-white rounded-none border border-[#2d4a3e] p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl" />
              
              <h2 className="text-4xl font-heading font-bold mb-4 relative z-10">Liên hệ hỗ trợ</h2>
              <p className="text-emerald-100/80 mb-8 text-lg relative z-10">
                Nếu có bất kỳ câu hỏi nào về chính sách của chúng tôi, vui lòng liên hệ:
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-4 px-6">
                  <Phone className="h-5 w-5 text-emerald-300" />
                  <span className="font-bold tracking-wider">0123 456 789</span>
                </div>
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-4 px-6">
                  <Mail className="h-5 w-5 text-emerald-300" />
                  <span className="font-bold tracking-wider">support@b-eco.vn</span>
                </div>
              </div>
            </section>
          </ScrollAnimate>
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default Policies;
