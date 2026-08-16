import { describe, expect, it } from 'vitest';
import { draftFromProduct, emptyDraft, parseDraft } from '@/utils/productForm';
import { mockProducts } from '@/data/mockProducts';
import { Product } from '@/types';

const validDraft = () => ({
  ...emptyDraft(),
  name: 'Đĩa Sinh Học Oval (Size L)',
  description: 'Đĩa oval từ lá bàng biển Phú Yên, dùng một lần và phân hủy sinh học.',
  priceRetail: '30000',
  priceWholesale: '28000',
  stock: '5000',
  imageUrl: '/images/products/leaf-plates-closeup.webp',
});

describe('ProductManagement form validation', () => {
  it('chấp nhận một draft hợp lệ đầy đủ bậc giá', () => {
    const draft = {
      ...validDraft(),
      priceEnterpriseEnabled: true,
      priceEnterprise: '25000',
      enterpriseMinQtyEnabled: true,
      enterpriseMinQty: '1000',
    };

    const { values, errors } = parseDraft(draft);

    expect(errors).toEqual({});
    expect(values.priceRetail).toBe(30000);
    expect(values.priceEnterprise).toBe(25000);
    expect(values.enterpriseMinQty).toBe(1000);
  });

  it('tắt bậc doanh nghiệp thì giá & ngưỡng thành null (không tự hạ giá)', () => {
    const { values, errors } = parseDraft(validDraft());

    expect(errors).toEqual({});
    expect(values.priceEnterprise).toBeNull();
    expect(values.enterpriseMinQty).toBeNull();
  });

  it('từ chối giá sỉ vượt giá lẻ', () => {
    const draft = { ...validDraft(), priceWholesale: '31000' };
    const { errors } = parseDraft(draft);
    expect(errors.priceWholesale).toBe('Giá sỉ không được vượt giá lẻ');
  });

  it('từ chối giá doanh nghiệp vượt giá sỉ', () => {
    const draft = { ...validDraft(), priceEnterpriseEnabled: true, priceEnterprise: '29000' };
    const { errors } = parseDraft(draft);
    expect(errors.priceEnterprise).toBe('Giá doanh nghiệp không được vượt giá sỉ');
  });

  it('từ chối ngưỡng doanh nghiệp thấp hơn ngưỡng sỉ', () => {
    const draft = {
      ...validDraft(),
      enterpriseMinQtyEnabled: true,
      enterpriseMinQty: '50', // nhỏ hơn wholesaleMinQty mặc định 100
    };
    const { errors } = parseDraft(draft);
    expect(errors.enterpriseMinQty).toBe('Ngưỡng doanh nghiệp phải ≥ ngưỡng sỉ');
  });

  it('từ chối tồn kho âm và giá bằng 0', () => {
    const stockErrors = parseDraft({ ...validDraft(), stock: '-5' }).errors;
    expect(stockErrors.stock).toBeDefined();

    const priceErrors = parseDraft({ ...validDraft(), priceRetail: '0' }).errors;
    expect(priceErrors.priceRetail).toBeDefined();
  });

  it('báo thiếu ảnh và mô tả quá ngắn', () => {
    const { errors } = parseDraft({ ...validDraft(), imageUrl: '', description: 'Ngắn' });
    expect(errors.imageUrl).toBe('Chưa có ảnh sản phẩm');
    expect(errors.description).toBe('Mô tả tối thiểu 10 ký tự');
  });

  it('draft rỗng bắn lỗi đúng các trường bắt buộc', () => {
    const { errors } = parseDraft(emptyDraft());
    expect(errors.name).toBeDefined();
    expect(errors.description).toBeDefined();
    expect(errors.priceRetail).toBeDefined();
    expect(errors.priceWholesale).toBeDefined();
    expect(errors.imageUrl).toBeDefined();
    // tồn kho 0 hợp lệ, không nằm trong lỗi
    expect(errors.stock).toBeUndefined();
  });
});

describe('draftFromProduct', () => {
  it('hỗ trợ sản phẩm có giá doanh nghiệp nhưng không tự hạ giá (liên hệ chốt)', () => {
    // TW-SET-01: có priceEnterprise nhưng không có enterpriseMinQty
    const product = mockProducts.find(p => p.sku === 'TW-SET-01') as Product;
    const draft = draftFromProduct(product);

    expect(draft.priceEnterpriseEnabled).toBe(true);
    expect(draft.enterpriseMinQtyEnabled).toBe(false);

    const { values, errors } = parseDraft(draft);
    expect(errors).toEqual({});
    expect(values.priceEnterprise).toBe(80000);
    expect(values.enterpriseMinQty).toBeNull();
  });

  it('giữ nguyên bậc doanh nghiệp cho sản phẩm có khai báo', () => {
    const product = mockProducts.find(p => p.sku === 'TW-OVL-01') as Product;
    const draft = draftFromProduct(product);

    expect(draft.priceEnterpriseEnabled).toBe(true);
    expect(draft.enterpriseMinQtyEnabled).toBe(true);

    const { values, errors } = parseDraft(draft);
    expect(errors).toEqual({});
    expect(values.priceEnterprise).toBe(25000);
    expect(values.enterpriseMinQty).toBe(1000);
  });

  it('toàn bộ catalog thật đều vượt qua xác thực form', () => {
    for (const product of mockProducts) {
      const { errors } = parseDraft(draftFromProduct(product));
      expect(errors, `Sản phẩm ${product.sku} không hợp lệ: ${JSON.stringify(errors)}`).toEqual({});
    }
  });
});
