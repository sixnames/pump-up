import { AppSidebar } from '@/components/common/AppSidebar';
import OdPageContainer from '@/components/common/OdPageContainer';
import OdSidebarTrigger from '@/components/common/OdSidebarTrigger';
import { LoaderContextProvider } from '@/components/context/LoaderContext';
import QueryProvider from '@/components/context/QueryProvider';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import React from 'react';
import { Toaster } from 'sonner';
import ThemeProvider from '../../components/context/ThemeProvider';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'Pump Up',
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true';
  const theme = cookieStore.get('payload-theme');
  const themeValue = theme?.value || 'dark';

  return (
    <html
      lang='uk'
      className={themeValue}
      style={{
        colorScheme: themeValue,
      }}
    >
      <body className={'bg-white'}>
        <QueryProvider>
          <ThemeProvider defaultTheme={'dark'} attribute={'class'} disableTransitionOnChange>
            <LoaderContextProvider>
              <SidebarProvider defaultOpen={defaultOpen}>
                <AppSidebar />
                <SidebarInset>
                  <OdSidebarTrigger />
                  <OdPageContainer>
                    <NuqsAdapter>{children}</NuqsAdapter>
                  </OdPageContainer>
                </SidebarInset>
              </SidebarProvider>
            </LoaderContextProvider>
          </ThemeProvider>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
