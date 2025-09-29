'use client';

import Logo from '@/components/common/Logo';
import NavIcon from '@/components/common/NavIcon';
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
  useSidebar,
} from '@/components/ui/sidebar';
import { extractUrlString, UrlConfig, urlConfig, UrlConfigItem } from '@/lib/urlUtils';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

interface AppSidebarGroupProps {
  navItems: UrlConfig[keyof UrlConfig]['links'];
  label: string;
}

function AppSidebarGroup({ navItems, label }: AppSidebarGroupProps) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {Object.entries(navItems).map(([key, item]) => {
            const navItem = item as UrlConfigItem;
            const cleanHref = extractUrlString(navItem.url);
            const isActive = pathname.startsWith(cleanHref);

            return (
              <SidebarMenuItem key={key}>
                <SidebarMenuButton asChild isActive={isActive} tooltip={navItem.title}>
                  <Link href={navItem.url}>
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
  return showDevSticker ? <div className={cn(`bg-red-600 text-white h-8 rounded-lg flex items-center justify-center`)}>dev</div> : null;
}

export function AppSidebar() {
  const router = useRouter();
  const sidebarContext = useSidebar();
  const collapsed = sidebarContext.state === 'collapsed';

  return (
    <Sidebar collapsible={'icon'}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => router.push('/')}
              className={cn('mt-3 mb-2', {
                'px-0!': collapsed,
              })}
            >
              <div
                className={cn('flex items-center justify-center transition-transform', {
                  'transform -translate-x-[0.35rem]': collapsed,
                })}
              >
                <Logo size={'lg'} />
              </div>
              <div
                className={cn('grid flex-1 text-left text-sm leading-tight', {
                  hidden: collapsed,
                })}
              >
                Pump Up
              </div>
            </SidebarMenuButton>
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
