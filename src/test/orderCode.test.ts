import { describe, expect, it } from 'vitest';
import { generateOrderCode } from '@/utils/orderCode';

describe('generateOrderCode', () => {
  it('theo đúng định dạng BCO-yymmdd-XXXXX', () => {
    const code = generateOrderCode(new Date(2026, 6, 26));
    expect(code).toMatch(/^BCO-260726-[A-Z2-9]{5}$/);
  });

  it('không chứa ký tự dễ đọc nhầm (I, O, 0, 1)', () => {
    for (let i = 0; i < 200; i += 1) {
      expect(generateOrderCode().split('-')[2]).not.toMatch(/[IO01]/);
    }
  });

  it('không đoán được tuần tự — 500 mã sinh liên tiếp đều khác nhau', () => {
    const codes = new Set(Array.from({ length: 500 }, () => generateOrderCode()));
    expect(codes.size).toBe(500);
  });

  it('đệm 0 cho tháng và ngày một chữ số', () => {
    expect(generateOrderCode(new Date(2026, 0, 5))).toMatch(/^BCO-260105-/);
  });
});
