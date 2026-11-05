import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { NavLink } from '@/components/NavLink';
import {
  Home,
  LayoutDashboard,
  Calculator,
  PieChart,
  MessageSquare,
  FileText,
  Shield,
} from 'lucide-react';

export function AppSidebar() {
  const { t } = useTranslation();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();

  const navItems = [
    { title: t('nav.home'), url: '/', icon: Home },
    { title: t('nav.dashboard'), url: '/dashboard', icon: LayoutDashboard },
    { title: t('nav.simulator'), url: '/simulator', icon: Calculator },
    { title: t('nav.financial'), url: '/financial', icon: PieChart },
    { title: t('nav.assistant'), url: '/assistant', icon: MessageSquare },
    { title: t('nav.digilocker'), url: '/digilocker', icon: FileText },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {!collapsed && t('app_name')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === '/'}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-accessible transition-colors hover:bg-sidebar-accent"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                    >
                      <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!collapsed && (
          <div className="mt-auto p-4">
            <div className="flex items-center gap-2 rounded-lg bg-secondary p-3 text-sm text-secondary-foreground">
              <Shield className="h-4 w-4 shrink-0" />
              <span className="text-xs">Secured by PFRDA</span>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
