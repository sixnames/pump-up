'use client';

import Logo from '@/components/common/Logo';
import NavIcon from '@/components/common/NavIcon';
import { useGlobalConfigContext } from '@/components/context/GlobalConfigContext';
import { Separator } from '@/components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { extractUrlString, UrlConfig, urlConfig, UrlConfigItem } from '@/lib/urlUtils';
import { cn } from '@/lib/utils';
import { useProgress } from '@bprogress/next';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

interface AppSidebarGroupProps {
  navItems: UrlConfig[keyof UrlConfig]['links'];
  label: string;
}

function AppSidebarGroup({ navItems, label }: AppSidebarGroupProps) {
  const pathname = usePathname();
  const sidebarContext = useSidebar();
  const { user } = useGlobalConfigContext();
  if (!user) {
    return null;
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {Object.entries(navItems).map(([key, item]) => {
            if (item.hidden) {
              return null;
            }

            if (item.url === '/migrate' && !user.isAdmin) {
              return null;
            }

            const navItem = item as UrlConfigItem;
            const cleanHref = extractUrlString(navItem.url);
            const isActive = pathname.startsWith(cleanHref);

            return (
              <SidebarMenuItem key={key}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={navItem.title}
                  onClick={() => {
                    if (sidebarContext.isMobile) {
                      sidebarContext.toggleSidebar();
                    }
                  }}
                >
                  <Link href={navItem.url} tabIndex={-1}>
                    {item.icon ? <NavIcon icon={item.icon} /> : null}
                    <span>{navItem.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

const showDevSticker = process.env.NOdE_ENV === 'development';

function DevLabel() {
  return showDevSticker ? (
    <div className={cn(`bg-red-600 text-white h-8 rounded-lg flex items-center justify-center`)}>dev</div>
  ) : null;
}

export function AppSidebar() {
  const { start } = useProgress();
  const router = useRouter();
  const sidebarContext = useSidebar();
  const collapsed = sidebarContext.state === 'collapsed';

  return (
    <Sidebar collapsible={'icon'} variant={'floating'}>
      <SidebarHeader>
        <div className={cn('px-0.5 pt-2')}>
          <SidebarTrigger tabIndex={-1} className={'cursor-pointer'} />
        </div>
        <SidebarMenu>
          <SidebarMenuItem
            onClick={() => {
              if (sidebarContext.isMobile) {
                start();
                sidebarContext.toggleSidebar();
              }
            }}
          >
            <button
              className={cn('cursor-pointer flex gap-2 pl-0.5 mb-3 items-center')}
              onClick={() => router.push('/')}
            >
              <span className={'pt-0.5'}>
                <Logo size={'lg'} />
              </span>
              <span
                className={cn('grid flex-1 text-left text-sm leading-tight', {
                  'md:hidden': collapsed,
                })}
              >
                <span className='truncate font-semibold'>PUMP UP</span>
              </span>
            </button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {Object.entries(urlConfig).map(([key, value]) => {
          return (
            <div key={key}>
              <Separator
                className={cn('transition-all', {
                  'mb-3': collapsed,
                  'mb-1': !collapsed,
                })}
              />
              <AppSidebarGroup navItems={value.links} label={value.title} />
            </div>
          );
        })}
      </SidebarContent>
      <SidebarFooter>
        <DevLabel />
      </SidebarFooter>
    </Sidebar>
  );
}
