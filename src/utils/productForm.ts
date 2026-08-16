import { z } from 'zod';
import { Product } from '@/types';

/**
 * Schema xác thực form sản phẩm — nguồn sự thật duy nhất cho dữ liệu
 * admin nhập vào. Dùng chung bởi ProductManagement và test.
 */
export const productSchema = z
  .object({
    name: z.string().trim().min(3, 'Tên sản phẩm tối thiểu 3 ký tự').max(120, 'Tên sản phẩm tối đa 120 ký tự'),
    sku: z.string().trim().max(40, 'Mã SKU tối đa 40 ký tự'),
    description: z.string().trim().min(10, 'Mô tả tối thiểu 10 ký tự').max(2000, 'Mô tả tối đa 2000 ký tự'),
    category: z.string().trim().min(1, 'Chọn danh mục'),
    salesUnit: z.string().trim().max(30, 'Đơn vị bán tối đa 30 ký tự'),
    wholesaleThresholdLabel: z.string().trim().max(40, 'Nhãn ngưỡng tối đa 40 ký tự'),
    priceRetail: z.number({ invalid_type_error: 'Nhập giá lẻ' }).int('Giá phải là số nguyên').positive('Giá lẻ phải > 0'),
    priceWholesale: z.number({ invalid_type_error: 'Nhập giá sỉ' }).int('Giá phải là số nguyên').positive('Giá sỉ phải > 0'),
    priceEnterprise: z.number().int('Giá phải là số nguyên').positive('Giá doanh nghiệp phải > 0').nullable(),
    wholesaleMinQty: z.number({ invalid_type_error: 'Nhập ngưỡng sỉ' }).int().positive('Ngưỡng sỉ phải > 0'),
    enterpriseMinQty: z.number().int().positive('Ngưỡng doanh nghiệp phải > 0').nullable(),
    stock: z.number({ invalid_type_error: 'Nhập tồn kho' }).int('Tồn kho phải là số nguyên').min(0, 'Tồn kho không âm'),
    imageUrl: z.string().trim().min(1, 'Chưa có ảnh sản phẩm'),
    active: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.priceWholesale > data.priceRetail) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['priceWholesale'], message: 'Giá sỉ không được vượt giá lẻ' });
    }
    if (data.priceEnterprise !== null && data.priceEnterprise > data.priceWholesale) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['priceEnterprise'], message: 'Giá doanh nghiệp không được vượt giá sỉ' });
    }
    if (data.enterpriseMinQty !== null && data.enterpriseMinQty < data.wholesaleMinQty) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['enterpriseMinQty'], message: 'Ngưỡng doanh nghiệp phải ≥ ngưỡng sỉ' });
    }
  });

export type ProductFormValues = z.infer<typeof productSchema>;

/** Form giữ mọi ô nhập dạng chuỗi để input number không nhảy số khi đang gõ. */
export interface ProductDraft {
  name: string;
  sku: string;
  description: string;
  category: string;
  salesUnit: string;
  wholesaleThresholdLabel: string;
  priceRetail: string;
  priceWholesale: string;
  priceEnterprise: string;
  priceEnterpriseEnabled: boolean;
  wholesaleMinQty: string;
  enterpriseMinQty: string;
  enterpriseMinQtyEnabled: boolean;
  stock: string;
  imageUrl: string;
  active: boolean;
}

export const emptyDraft = (): ProductDraft => ({
  name: '',
  sku: '',
  description: '',
  category: 'dia',
  salesUnit: 'cái',
  wholesaleThresholdLabel: '',
  priceRetail: '',
  priceWholesale: '',
  priceEnterprise: '',
  priceEnterpriseEnabled: false,
  wholesaleMinQty: '100',
  enterpriseMinQty: '',
  enterpriseMinQtyEnabled: false,
  stock: '0',
  imageUrl: '',
  active: true,
});

export const draftFromProduct = (product: Product): ProductDraft => ({
  name: product.name,
  sku: product.sku ?? '',
  description: product.description,
  category: product.category,
  salesUnit: product.salesUnit ?? '',
  wholesaleThresholdLabel: product.wholesaleThresholdLabel ?? '',
  priceRetail: String(product.priceRetail),
  priceWholesale: String(product.priceWholesale),
  priceEnterprise: product.priceEnterprise !== undefined ? String(product.priceEnterprise) : '',
  priceEnterpriseEnabled: product.priceEnterprise !== undefined,
  wholesaleMinQty: String(product.wholesaleMinQty),
  enterpriseMinQty: product.enterpriseMinQty !== undefined ? String(product.enterpriseMinQty) : '',
  enterpriseMinQtyEnabled: product.enterpriseMinQty !== undefined,
  stock: String(product.stock),
  imageUrl: product.imageUrl,
  active: product.active,
});

/** Chuyển draft (chuỗi) → giá trị schema (số/null), trả lỗi gắn theo tên field. */
export const parseDraft = (
  draft: ProductDraft,
): { values: ProductFormValues; errors: Record<string, string> } => {
  const optionalNumber = (raw: string, enabled: boolean): number | null =>
    enabled && raw.trim() !== '' ? Number(raw) : null;

  const candidate = {
    name: draft.name,
    sku: draft.sku,
    description: draft.description,
    category: draft.category,
    salesUnit: draft.salesUnit,
    wholesaleThresholdLabel: draft.wholesaleThresholdLabel,
    priceRetail: Number(draft.priceRetail),
    priceWholesale: Number(draft.priceWholesale),
    priceEnterprise: optionalNumber(draft.priceEnterprise, draft.priceEnterpriseEnabled),
    wholesaleMinQty: Number(draft.wholesaleMinQty),
    enterpriseMinQty: optionalNumber(draft.enterpriseMinQty, draft.enterpriseMinQtyEnabled),
    stock: Number(draft.stock),
    imageUrl: draft.imageUrl,
    active: draft.active,
  };

  const result = productSchema.safeParse(candidate);
  if (result.success) {
    return { values: result.data, errors: {} };
  }

  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? 'form');
    if (!errors[key]) errors[key] = issue.message;
  }
  return { values: candidate as ProductFormValues, errors };
};
