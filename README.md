# B-ECO - Chén Dĩa Sinh Học từ Lá Bàng

## Mô tả dự án
B-ECO là một nền tảng thương mại điện tử chuyên bán các sản phẩm sinh học thân thiện với môi trường được làm từ lá bàng tự nhiên. 

- **Tên sản phẩm chính**: Chén dĩa sinh học từ lá bàng
- **Xuất xứ**: Phú Yên, Việt Nam
- **Cam kết**: Phân hủy sinh học hoàn toàn trong 45 ngày

## Công nghệ sử dụng
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **Package Manager**: Bun
- **UI Components**: shadcn/ui
- **Routing**: React Router v6
- **Testing**: Vitest
- **Linting**: ESLint

## Cài đặt và chạy dự án

### Yêu cầu
- Node.js 16+ hoặc Bun
- npm/yarn/bun

### Hướng dẫn cài đặt

```bash
# Clone repository
git clone https://github.com/maitamgk/E-CO.git
cd E-CO

# Cài đặt dependencies (sử dụng bun)
bun install

# Chạy development server
bun run dev

# Build cho production
bun run build

# Preview production build
bun run preview

# Chạy tests
bun run test

# Lint code
bun run lint
```

## Deployment trên Vercel

### Cách 1: Qua Vercel Dashboard
1. Truy cập https://vercel.com và đăng nhập
2. Click "New Project"
3. Chọn repository `maitamgk/E-CO`
4. Cấu hình:
   - **Framework Preset**: Vite
   - **Build Command**: `bun run build`
   - **Output Directory**: `dist`
   - **Install Command**: `bun install`
5. Click "Deploy"

### Cách 2: Sử dụng Vercel CLI

```bash
# Cài đặt Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy cho production
vercel --prod
```

## Project Structure

```
src/
├── components/          # React components
│   ├── layout/         # Header, Footer, Layout
│   ├── product/        # Product-related components
│   ├── cart/           # Shopping cart components
│   ├── ui/             # shadcn/ui components
│   └── NavLink.tsx
├── pages/              # Page components (route pages)
├── context/            # React Context (Auth, Cart, Products)
├── hooks/              # Custom React hooks
├── data/               # Mock data
├── assets/             # Images and static files
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── lib/                # Library functions
└── main.tsx           # App entry point
```

## Tính năng chính
✅ Hiển thị sản phẩm với bộ lọc
✅ Giỏ hàng
✅ Xác thực người dùng
✅ Trang chi tiết sản phẩm
✅ Reviews sản phẩm
✅ Tính năng responsive design
✅ Animations và transitions mượt mà

## Liên hệ & Support
- **Email**: contact@b-eco.vn
- **GitHub**: https://github.com/maitamgk/E-CO
- **Vercel**: (link deployment)

## License
MIT
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
