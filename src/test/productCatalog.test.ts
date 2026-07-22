import { describe, expect, it } from 'vitest';
import { mockProducts } from '@/data/mockProducts';

const expectedPrices = {
  'TW-OVL-01': [30000, 28000, 25000],
  'TW-RND-01': [29000, 26000, 22000],
  'TW-OVM-01': [25000, 22000, 19000],
  'TW-BWL-01': [20000, 19000, 16000],
  'TW-SET-01': [99000, 85000, 80000],
  'CG-SIG-01': [15000, 12000, 10000],
  'AR-POR-01': [30000, 28000, 26000],
  'AR-CLK-01': [180000, 150000, 140000],
  'AR-FAN-01': [35000, 30000, 29000],
  'AR-ART-01': [159000, 130000, 130000],
  'DC-LEF-01': [20000, 18000, 18000],
} as const;

describe('B-ECO product catalog', () => {
  it('matches the 11 SKUs and three price tiers from the approved price list', () => {
    expect(mockProducts).toHaveLength(11);

    for (const product of mockProducts) {
      expect(product.sku).toBeDefined();
      expect([
        product.priceRetail,
        product.priceWholesale,
        product.priceEnterprise,
      ]).toEqual(expectedPrices[product.sku as keyof typeof expectedPrices]);
    }

    expect(mockProducts.map(product => product.sku).sort()).toEqual(
      Object.keys(expectedPrices).sort(),
    );
  });

  it('keeps the first four tableware products in packs of 10', () => {
    expect(mockProducts.slice(0, 4).every(product => product.salesUnit === 'gói 10 cái')).toBe(true);
  });

  it('does not use landscape photos as product images', () => {
    expect(mockProducts.every(product => !product.imageUrl.includes('collection-display-2'))).toBe(true);
  });
});
