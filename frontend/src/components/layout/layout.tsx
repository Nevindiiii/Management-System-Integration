import type { ReactNode } from 'react';
import {
  SidebarProvider,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/navbar/app-sidebar';
import { LayoutHeader } from './layout-header';


type LayoutProps = {
  children: ReactNode;
};

const MainContent = ({ children }: { children: ReactNode }) => {
  const { open, isMobile } = useSidebar();

  return (
    <SidebarInset
      className="transition-all duration-300 ease-in-out"
      style={{
        marginLeft: !isMobile && open ? '11rem' : '4rem',
        width: !isMobile && open ? 'calc(100vw - 11rem)' : '100vw',
      }}
    >
      <LayoutHeader />
      <main className="min-h-screen bg-gradient-to-br from-slate-50/50 via-blue-50/30 to-indigo-50/20 p-6">
        <div className="w-full max-w-full overflow-x-auto">{children}</div>
      </main>
    </SidebarInset>
  );
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <MainContent>{children}</MainContent>
    </SidebarProvider>
  );
};

export default Layout;
