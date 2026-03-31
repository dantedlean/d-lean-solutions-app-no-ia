import { Link, Outlet, useLocation } from 'react-router-dom'
import { LayoutDashboard, FilePlus2, Users, BookOpen, Wifi, Database, Menu } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useIsMobile } from '@/hooks/use-mobile'

function AppSidebar() {
  const location = useLocation()

  const menuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, url: '/' },
    { title: 'Novo Orçamento', icon: FilePlus2, url: '/new-budget' },
    { title: 'Banco de Clientes', icon: Users, url: '/clients' },
    { title: 'Catálogo Técnico', icon: BookOpen, url: '/catalog' },
  ]

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="h-16 flex items-center justify-center border-b border-border/50">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-primary-foreground">
            D
          </div>
          D-Lean
        </Link>
      </SidebarHeader>
      <SidebarContent className="pt-4">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === item.url}
                tooltip={item.title}
              >
                <Link to={item.url}>
                  <item.icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground mb-1">Vendedor Ativo</p>
          <p>João Silva</p>
          <p>Matrícula: 4892</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

function GlobalHeader() {
  const isMobile = useIsMobile()
  const { toggleSidebar } = useSidebar()

  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-4 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <SidebarTrigger className="hidden md:flex" />
        <h1 className="text-lg font-semibold text-foreground hidden sm:block">
          Plataforma de Engenharia
        </h1>
      </div>

      <div className="flex items-center gap-6 overflow-x-auto no-scrollbar mask-edges pr-4">
        <div className="flex flex-col items-end min-w-max">
          <span className="text-[10px] uppercase text-muted-foreground font-semibold">
            Orçamentos Mês
          </span>
          <span className="text-sm font-bold text-primary">124</span>
        </div>
        <div className="flex flex-col items-end min-w-max">
          <span className="text-[10px] uppercase text-muted-foreground font-semibold">
            Hit Rate
          </span>
          <span className="text-sm font-bold text-green-600">68%</span>
        </div>
        <div className="flex flex-col items-end min-w-max">
          <span className="text-[10px] uppercase text-muted-foreground font-semibold">
            Aguardando Eng.
          </span>
          <span className="text-sm font-bold text-destructive">12</span>
        </div>
      </div>
    </header>
  )
}

function GlobalFooter() {
  return (
    <footer className="h-10 border-t bg-background flex items-center justify-between px-4 text-xs text-muted-foreground mt-auto">
      <span>D-Lean Solutions © 2026</span>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5" title="Maxiprod ERP Connected">
          <Database className="w-3.5 h-3.5 text-green-500" />
          <span className="hidden sm:inline">Maxiprod ERP</span>
        </div>
        <div className="flex items-center gap-1.5" title="AI Validation Active">
          <Wifi className="w-3.5 h-3.5 text-blue-500" />
          <span className="hidden sm:inline">AI Engine Ativa</span>
        </div>
      </div>
    </footer>
  )
}

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col min-h-screen w-full bg-[#f4f7fa]">
        <GlobalHeader />
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          <Outlet />
        </main>
        <GlobalFooter />
      </SidebarInset>
    </SidebarProvider>
  )
}
