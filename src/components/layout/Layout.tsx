import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { ZaloFloatingButton } from './ZaloFloatingButton';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-[100dvh] flex-col overflow-x-hidden bg-background">
      <Header />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
      <ZaloFloatingButton />
    </div>
  );
};
