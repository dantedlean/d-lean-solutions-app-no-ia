import { Link, Outlet, useLocation } from 'react-router-dom'
import { FilePlus2, Users, BookOpen, Wifi, Database, Menu, LayoutDashboard } from 'lucide-react'
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

function AppSidebar() {
  const location = useLocation()

  const menuItems = [
    { title: 'Novo Orçamento', icon: FilePlus2, url: '/' },
    { title: 'Banco de Clientes', icon: Users, url: '/clients' },
    { title: 'Catálogo Técnico', icon: BookOpen, url: '/catalog' },
    { title: 'Gestão Admin', icon: LayoutDashboard, url: '/admin' },
  ]

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="h-16 flex items-center justify-center border-b border-border/50">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-[#1e4b8f]">
          <div className="w-8 h-8 bg-[#d62828] rounded-md flex items-center justify-center text-white">
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
        <div className="bg-muted/50 rounded-lg p-3 text-xs flex items-center gap-3">
          <img
            src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=1"
            alt="Avatar"
            className="w-10 h-10 rounded-full border-2 border-[#1e4b8f]"
          />
          <div>
            <p className="font-semibold text-[#1e4b8f] mb-0.5">João Silva</p>
            <p className="text-[#d62828] font-bold text-[10px] uppercase">Consultor Técnico</p>
            <p className="text-muted-foreground text-[10px] mt-0.5">ID: 4892</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

function GlobalHeader() {
  const { toggleSidebar } = useSidebar()
  const orderNumber = `#ORC-2026-${Math.floor(Math.random() * 900) + 100}`

  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-4 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <SidebarTrigger className="hidden md:flex" />
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold text-[#1e4b8f] hidden sm:block leading-tight">
            Plataforma de Engenharia
          </h1>
          <span className="text-xs font-bold text-[#d62828] hidden sm:block">{orderNumber}</span>
        </div>
      </div>

      <div className="flex items-center gap-6 overflow-x-auto no-scrollbar mask-edges pr-4">
        <div className="flex flex-col items-end min-w-max">
          <span className="text-[10px] uppercase text-muted-foreground font-semibold">
            Orçamentos Mês
          </span>
          <span className="text-sm font-bold text-[#1e4b8f]">124</span>
        </div>
        <div className="flex flex-col items-end min-w-max">
          <span className="text-[10px] uppercase text-muted-foreground font-semibold">
            Hit Rate
          </span>
          <span className="text-sm font-bold text-green-600">68%</span>
        </div>
        <div className="flex flex-col items-end min-w-max text-[#d62828]">
          <span className="text-[10px] uppercase font-semibold">Aguardando Eng.</span>
          <span className="text-sm font-bold">12</span>
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
        <div className="flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-green-500" />
          <span className="hidden sm:inline">Maxiprod ERP Connected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Wifi className="w-3.5 h-3.5 text-blue-500" />
          <span className="hidden sm:inline">Nano Banana AI Ativa</span>
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
