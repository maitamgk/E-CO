import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/types';
import { mockProducts } from '@/data/mockProducts';

interface ProductsContextType {
  products: Product[];
  isLoading: boolean;
  getProduct: (id: string) => Product | undefined;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load products (mock for now, will be Firebase onSnapshot later)
  useEffect(() => {
    const loadProducts = async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      setProducts(mockProducts.filter(p => p.active));
      setIsLoading(false);
    };

    loadProducts();
  }, []);

  const getProduct = (id: string) => {
    return products.find(p => p.id === id);
  };

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev =>
      prev.map(p =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        isLoading,
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
