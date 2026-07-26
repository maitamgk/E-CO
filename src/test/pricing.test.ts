import { describe, expect, it } from 'vitest';
import {
  calculateCartTotals,
  lineSavings,
  lineTotal,
  pricingSourceFromCartItem,
  resolveTier,
  resolveUnitPrice,
} from '@/utils/pricing';
import { mockProducts } from '@/data/mockProducts';
import type { CartItem } from '@/types';

/** Đĩa Sinh Học Oval (Size L): lẻ 30.000 · sỉ 28.000 từ 100 · DN 25.000 từ 1.000 */
const ovalL = {
  priceRetail: 30000,
  priceWholesale: 28000,
  priceEnterprise: 25000,
  wholesaleMinQty: 100,
  enterpriseMinQty: 1000,
};

/** Sản phẩm không công bố ngưỡng doanh nghiệp — chỉ có 2 bậc tự động. */
const noEnterpriseThreshold = {
  priceRetail: 180000,
  priceWholesale: 150000,
  priceEnterprise: 140000,
  wholesaleMinQty: 100,
};

const cartItem = (overrides: Partial<CartItem> & { qty: number }): CartItem => ({
  productId: 'p1',
  nameSnapshot: 'Sản phẩm',
  imageUrlSnapshot: '',
  priceSnapshot: overrides.priceRetail ?? 30000,
  ...ovalL,
  ...overrides,
});

describe('resolveTier', () => {
  it('áp giá lẻ khi chưa đủ số lượng sỉ', () => {
    expect(resolveTier(ovalL, 1).tier).toBe('retail');
    expect(resolveTier(ovalL, 99).unitPrice).toBe(30000);
  });

  it('áp giá sỉ ngay tại đúng ngưỡng', () => {
    const tier = resolveTier(ovalL, 100);
    expect(tier.tier).toBe('wholesale');
    expect(tier.unitPrice).toBe(28000);
  });

  it('áp giá doanh nghiệp ngay tại đúng ngưỡng', () => {
    const tier = resolveTier(ovalL, 1000);
    expect(tier.tier).toBe('enterprise');
    expect(tier.unitPrice).toBe(25000);
  });

  it('không tự hạ giá doanh nghiệp khi sản phẩm chưa công bố ngưỡng', () => {
    const tier = resolveTier(noEnterpriseThreshold, 100000);
    expect(tier.tier).toBe('wholesale');
    expect(tier.unitPrice).toBe(150000);
  });

  it('cho biết cần mua thêm bao nhiêu để lên bậc kế tiếp', () => {
    expect(resolveTier(ovalL, 60).nextTier).toMatchObject({
      tier: 'wholesale',
      minQty: 100,
      qtyNeeded: 40,
    });
    expect(resolveTier(ovalL, 400).nextTier).toMatchObject({
      tier: 'enterprise',
      minQty: 1000,
      qtyNeeded: 600,
    });
  });

  it('không gợi ý bậc tiếp theo khi đã ở bậc cao nhất', () => {
    expect(resolveTier(ovalL, 1000).nextTier).toBeUndefined();
  });

  it('coi số lượng không hợp lệ là 0 thay vì tính ra giá âm', () => {
    expect(resolveUnitPrice(ovalL, -5)).toBe(30000);
    expect(resolveUnitPrice(ovalL, Number.NaN)).toBe(30000);
    expect(lineTotal(ovalL, -5)).toBe(0);
  });
});

describe('lineTotal / lineSavings', () => {
  it('tính đúng thành tiền theo bậc giá', () => {
    expect(lineTotal(ovalL, 100)).toBe(2_800_000);
    expect(lineTotal(ovalL, 1000)).toBe(25_000_000);
  });

  it('tính đúng số tiền tiết kiệm so với giá lẻ', () => {
    expect(lineSavings(ovalL, 100)).toBe(200_000);
    expect(lineSavings(ovalL, 50)).toBe(0);
  });
});

describe('calculateCartTotals', () => {
  it('cộng dồn nhiều dòng hàng ở các bậc giá khác nhau', () => {
    const totals = calculateCartTotals([
      cartItem({ productId: 'a', qty: 100 }), // sỉ: 100 × 28.000
      cartItem({ productId: 'b', qty: 10 }), //  lẻ: 10 × 30.000
    ]);

    expect(totals.totalQty).toBe(110);
    expect(totals.retailSubtotal).toBe(3_300_000);
    expect(totals.subtotal).toBe(3_100_000);
    expect(totals.discountAmount).toBe(200_000);
    expect(totals.total).toBe(totals.subtotal);
  });

  it('trả về 0 cho giỏ hàng rỗng, không chia cho 0', () => {
    const totals = calculateCartTotals([]);
    expect(totals.total).toBe(0);
    expect(totals.discountRate).toBe(0);
  });

  it('vẫn tính đúng với giỏ hàng cũ chỉ có priceSnapshot', () => {
    const legacyItem = {
      productId: 'legacy',
      nameSnapshot: 'Giỏ hàng phiên bản cũ',
      imageUrlSnapshot: '',
      priceSnapshot: 20000,
      qty: 5,
    } as CartItem;

    const totals = calculateCartTotals([legacyItem]);
    expect(totals.subtotal).toBe(100_000);
    expect(totals.discountAmount).toBe(0);
    expect(pricingSourceFromCartItem(legacyItem).priceRetail).toBe(20000);
  });
});

describe('catalog', () => {
  it('mọi ngưỡng doanh nghiệp đều cao hơn ngưỡng sỉ và có giá rẻ hơn', () => {
    for (const product of mockProducts) {
      if (product.enterpriseMinQty === undefined) continue;

      expect(product.enterpriseMinQty).toBeGreaterThan(product.wholesaleMinQty);
      expect(product.priceEnterprise).toBeDefined();
      expect(product.priceEnterprise as number).toBeLessThan(product.priceWholesale);
    }
  });

  it('không có sản phẩm nào có giá sỉ đắt hơn giá lẻ', () => {
    for (const product of mockProducts) {
      expect(product.priceWholesale).toBeLessThanOrEqual(product.priceRetail);
    }
  });
});
