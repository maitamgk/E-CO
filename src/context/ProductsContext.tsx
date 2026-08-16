import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Product } from '@/types';
import { mockProducts } from '@/data/mockProducts';
import { productService, generateProductId } from '@/services/productService';
import { supabase } from '@/lib/supabase';

interface ProductsContextType {
  products: Product[];
  isLoading: boolean;
  /** true khi bảng products chưa chạy migration — website đang dùng dữ liệu fallback. */
  isUsingFallback: boolean;
  getProduct: (id: string) => Product | undefined;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  const loadProducts = useCallback(async () => {
    const data = await productService.getProducts();

    if (data === null) {
      // Chưa chạy migration — lùi về catalog fallback để website vẫn chạy.
      setProducts(mockProducts.filter(p => p.active));
      setIsUsingFallback(true);
    } else {
      setProducts(data);
      setIsUsingFallback(false);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadProducts();

    // Admin sửa sản phẩm ở tab khác → cửa hàng tự refresh, không cần F5.
    const subscription = productService.subscribeToProducts(() => {
      loadProducts();
    });

    return () => {
      void supabase.removeChannel(subscription);
    };
  }, [loadProducts]);

  const getProduct = (id: string) => {
    return products.find(p => p.id === id);
  };

  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: generateProductId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const success = await productService.createProduct(newProduct);
    if (success) {
      if (newProduct.active) setProducts(prev => [...prev, newProduct]);
      return true;
    }
    return false;
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    // Cập nhật lạc quan cho UI mượt, hoàn tác nếu DB từ chối.
    const snapshot = products;
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p)),
    );

    const success = await productService.updateProduct(id, updates);
    if (!success) {
      setProducts(snapshot);
    } else if (updates.active === false) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
    return success;
  };

  const deleteProduct = async (id: string) => {
    const success = await productService.deleteProduct(id);
    if (success) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
    return success;
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        isLoading,
        isUsingFallback,
        getProduct,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};
