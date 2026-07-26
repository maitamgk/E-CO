import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Leaf } from 'lucide-react';
import { Seo } from '@/components/Seo';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <Seo
        title="Không tìm thấy trang"
        description="Trang bạn tìm không tồn tại. Quay lại trang chủ B-ECO để tiếp tục khám phá sản phẩm sinh học từ lá bàng biển."
        noindex
      />
      <div className="min-h-[80vh] flex items-center justify-center bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            {/* 404 Visual */}
            <div className="relative mb-8 inline-block">
              <h1 className="text-[120px] md:text-[180px] font-heading text-primary leading-none select-none">
                404
              </h1>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
                <div className="p-6 bg-white border border-border/40 inline-block">
                  <Leaf className="h-16 w-16 text-primary stroke-[1.5]" />
                </div>
              </div>
            </div>

            {/* Content */}
            <h2 className="text-3xl font-heading mb-4 text-primary">
              Không tìm thấy trang
            </h2>
            <p className="text-muted-foreground font-light text-lg mb-10 max-w-md mx-auto">
              Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không thể truy cập.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="w-full sm:w-auto rounded-none uppercase tracking-widest font-normal text-xs px-8" asChild>
                <Link to="/">
                  <Home className="h-4 w-4 mr-2 stroke-[1.5]" />
                  Trang chủ
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-none uppercase tracking-widest font-normal text-xs px-8" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-4 w-4 mr-2 stroke-[1.5]" />
                Quay lại
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
