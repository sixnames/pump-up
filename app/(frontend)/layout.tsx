import { getSessionUser } from '@/collections/Users/actions';
import { AppSidebar } from '@/components/common/AppSidebar';
import OdPageContainer from '@/components/common/OdPageContainer';
import OdSidebarTrigger from '@/components/common/OdSidebarTrigger';
import { GlobalConfigContextProvider } from '@/components/context/GlobalConfigContext';
import { LoaderContextProvider } from '@/components/context/LoaderContext';
import QueryProvider from '@/components/context/QueryProvider';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import React from 'react';
import ThemeProvider from '../../components/context/ThemeProvider';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'PUMP UP',
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true';
  const theme = cookieStore.get('payload-theme');
  const themeValue = theme?.value || 'dark';
  const authResult = await getSessionUser(undefined);

  return (
    <html
      lang='uk'
      className={themeValue}
      style={{
        colorScheme: themeValue,
      }}
    >
      <body>
        <QueryProvider>
          <ThemeProvider defaultTheme={'dark'} attribute={'class'} disableTransitionOnChange>
            <LoaderContextProvider>
              <GlobalConfigContextProvider user={authResult?.user}>
                <SidebarProvider defaultOpen={defaultOpen}>
                  <AppSidebar />
                  <SidebarInset>
                    <OdSidebarTrigger />
                    <OdPageContainer>
                      <NuqsAdapter>{children}</NuqsAdapter>
                    </OdPageContainer>
                  </SidebarInset>
                </SidebarProvider>
              </GlobalConfigContextProvider>
            </LoaderContextProvider>
          </ThemeProvider>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
