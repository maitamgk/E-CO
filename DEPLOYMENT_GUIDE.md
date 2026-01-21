# 📚 Hướng dẫn Push lên GitHub và Deploy Vercel

## ⚠️ Bước 1: Push Code lên GitHub (Bắt buộc)

### Cách làm:

1. **Tạo Personal Access Token trên GitHub**
   - Truy cập: https://github.com/settings/tokens
   - Click "Generate new token" → "Generate new token (classic)"
   - Chọn scopes: `repo` (full control of private repositories)
   - Copy token (lưu ở nơi an toàn)

2. **Push code từ máy tính**
   ```bash
   cd c:\Users\Asus\b-co-commerce
   
   # Configure git
   git config --global user.name "maitamgk"
   git config --global user.email "your-email@gmail.com"
   
   # Thay <TOKEN> bằng token vừa tạo
   git remote set-url origin https://<TOKEN>@github.com/maitamgk/E-CO.git
   
   # Push code
   git push -u origin main
   ```

3. **Xác nhận trên GitHub**
   - Truy cập: https://github.com/maitamgk/E-CO
   - Kiểm tra xem code đã xuất hiện chưa

---

## 🚀 Bước 2: Deploy lên Vercel

### Cách 1: Sử dụng Vercel CLI (Đơn giản nhất)

```bash
# Cài đặt Vercel CLI
npm i -g vercel
# hoặc
bun add -g vercel

# Đăng nhập vào Vercel
vercel login

# Deploy project
cd c:\Users\Asus\b-co-commerce
vercel --prod
```

### Cách 2: Sử dụng Vercel Dashboard

1. Truy cập: https://vercel.com
2. Đăng nhập/Đăng ký tài khoản
3. Click "New Project"
4. Chọn "Import Git Repository"
5. Kết nối GitHub account và chọn repository `E-CO`
6. Cấu hình:
   - Framework: **Vite**
   - Build Command: **npm run build**
   - Output Directory: **dist**
   - Install Command: **npm install**
7. Click "Deploy"

---

## ✅ Kiểm tra sau khi Deploy

- Sau 2-3 phút, dự án sẽ có URL công khai trên Vercel
- URL sẽ có dạng: `https://e-co-xxx.vercel.app`
- Mỗi lần push code mới lên GitHub, Vercel sẽ tự động build và deploy

---

## 📝 Các file đã chuẩn bị

✅ `vercel.json` - Cấu hình Vercel  
✅ `README.md` - Hướng dẫn dự án  
✅ `vite.config.ts` - Cấu hình Vite  
✅ `.gitignore` - Ignore files  
✅ `package.json` - Dependencies và scripts  

---

## 🔗 Useful Links

- GitHub Repo: https://github.com/maitamgk/E-CO
- Vercel Dashboard: https://vercel.com/dashboard
- GitHub Tokens: https://github.com/settings/tokens
- Vercel Docs: https://vercel.com/docs

---

## ❓ Troubleshooting

### Lỗi "Permission denied"
→ Sử dụng Personal Access Token thay vì password

### Lỗi build trên Vercel
→ Kiểm tra `vercel.json` và đảm bảo build command đúng

### Build không thành công
→ Chạy `bun run build` trên máy để test trước

---

## 💡 Tips

1. Luôn test build locally trước khi push:
   ```bash
   npm run build
   npm run preview
   ```

2. Kiểm tra logs trên Vercel Dashboard nếu có lỗi

3. Có thể tùy chỉnh domain sau khi deploy

---

## 🎯 Lệnh npm hay dùng

```bash
npm install          # Cài đặt dependencies
npm run dev         # Chạy development server (port 8080)
npm run build       # Build production
npm run preview     # Xem preview của build
npm run lint        # Check linting errors
npm run test        # Chạy tests
npm run test:watch  # Watch mode tests
```
