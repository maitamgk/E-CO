import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { CartProvider, useCart } from '@/context/CartContext';
import { mockProducts } from '@/data/mockProducts';
import type { Product } from '@/types';

const ovalL = mockProducts.find(p => p.sku === 'TW-OVL-01') as Product;

const renderCart = () => renderHook(() => useCart(), { wrapper: CartProvider });

beforeEach(() => {
  localStorage.clear();
});

describe('CartContext', () => {
  it('thêm sản phẩm với giá lẻ khi số lượng nhỏ', () => {
    const { result } = renderCart();

    act(() => result.current.addToCart(ovalL, 10));

    expect(result.current.itemCount).toBe(10);
    expect(result.current.items[ovalL.id].priceSnapshot).toBe(ovalL.priceRetail);
    expect(result.current.totals.total).toBe(ovalL.priceRetail * 10);
  });

  it('tự hạ xuống giá sỉ khi tăng số lượng qua ngưỡng', () => {
    const { result } = renderCart();

    act(() => result.current.addToCart(ovalL, 50));
    expect(result.current.items[ovalL.id].tierSnapshot).toBe('retail');

    act(() => result.current.updateQuantity(ovalL.id, 100));

    expect(result.current.items[ovalL.id].tierSnapshot).toBe('wholesale');
    expect(result.current.items[ovalL.id].priceSnapshot).toBe(ovalL.priceWholesale);
    expect(result.current.totals.total).toBe(ovalL.priceWholesale * 100);
    expect(result.current.totals.discountAmount).toBe((ovalL.priceRetail - ovalL.priceWholesale) * 100);
  });

  it('quay lại giá lẻ khi giảm số lượng xuống dưới ngưỡng', () => {
    const { result } = renderCart();

    act(() => result.current.addToCart(ovalL, 100));
    expect(result.current.items[ovalL.id].priceSnapshot).toBe(ovalL.priceWholesale);

    act(() => result.current.updateQuantity(ovalL.id, 99));

    expect(result.current.items[ovalL.id].priceSnapshot).toBe(ovalL.priceRetail);
    expect(result.current.totals.discountAmount).toBe(0);
  });

  it('cộng dồn khi thêm lại cùng một sản phẩm', () => {
    const { result } = renderCart();

    act(() => result.current.addToCart(ovalL, 60));
    act(() => result.current.addToCart(ovalL, 40));

    expect(result.current.items[ovalL.id].qty).toBe(100);
    expect(result.current.items[ovalL.id].tierSnapshot).toBe('wholesale');
  });

  it('không cho vượt quá tồn kho', () => {
    const { result } = renderCart();

    act(() => result.current.addToCart(ovalL, ovalL.stock + 500));

    expect(result.current.items[ovalL.id].qty).toBe(ovalL.stock);
  });

  it('xóa dòng hàng khi số lượng về 0', () => {
    const { result } = renderCart();

    act(() => result.current.addToCart(ovalL, 5));
    act(() => result.current.updateQuantity(ovalL.id, 0));

    expect(result.current.items[ovalL.id]).toBeUndefined();
    expect(result.current.itemCount).toBe(0);
  });

  it('lưu và khôi phục giỏ hàng từ localStorage', () => {
    const first = renderCart();
    act(() => first.result.current.addToCart(ovalL, 100));

    const restored = renderCart();

    expect(restored.result.current.items[ovalL.id].qty).toBe(100);
    expect(restored.result.current.totals.total).toBe(ovalL.priceWholesale * 100);
  });

  it('tính lại đơn giá khi khôi phục giỏ hàng có priceSnapshot cũ', () => {
    // Giỏ lưu qty đủ mức sỉ nhưng priceSnapshot vẫn là giá lẻ (giỏ từ phiên
    // bản trước). Nếu không tính lại khi hydrate, đơn giá sai này bị ghi
    // thẳng vào đơn hàng vì Checkout gửi nguyên Object.values(items).
    localStorage.setItem(
      'bco_cart',
      JSON.stringify({
        [ovalL.id]: {
          productId: ovalL.id,
          nameSnapshot: ovalL.name,
          imageUrlSnapshot: '',
          priceSnapshot: ovalL.priceRetail,
          priceRetail: ovalL.priceRetail,
          priceWholesale: ovalL.priceWholesale,
          priceEnterprise: ovalL.priceEnterprise,
          wholesaleMinQty: ovalL.wholesaleMinQty,
          enterpriseMinQty: ovalL.enterpriseMinQty,
          qty: 100,
        },
      }),
    );

    const { result } = renderCart();

    expect(result.current.items[ovalL.id].priceSnapshot).toBe(ovalL.priceWholesale);
    expect(result.current.items[ovalL.id].tierSnapshot).toBe('wholesale');
  });

  it('bỏ qua dòng hàng có số lượng không hợp lệ khi khôi phục', () => {
    localStorage.setItem(
      'bco_cart',
      JSON.stringify({
        bad: { productId: 'bad', nameSnapshot: 'x', imageUrlSnapshot: '', priceSnapshot: 1000, qty: 0 },
      }),
    );

    const { result } = renderCart();

    expect(result.current.items.bad).toBeUndefined();
  });

  it('không vỡ khi localStorage chứa dữ liệu hỏng', () => {
    localStorage.setItem('bco_cart', '{ khong-phai-json');

    const { result } = renderCart();

    expect(result.current.itemCount).toBe(0);
  });
});
