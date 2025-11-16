import type React from "react"

import { useState } from "react"
import { Button } from "../../ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar"
import { Badge } from "../../ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "../../ui/sheet"
import { Icon } from "@iconify/react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../../../redux/features/auth/auth.api"

interface DashboardLayoutProps {
  children: React.ReactNode
}

const navigationItems = {
  USER: [
    { icon: "solar:home-2-bold", label: "Dashboard", href: "/dashboard" },
    { icon: "solar:plain-2-bold", label: "Send Money", href: "/dashboard/send" },
    { icon: "solar:card-bold", label: "Add Money", href: "/dashboard/add-money" },
    { icon: "solar:arrow-right-down-bold", label: "Withdraw Money", href: "/dashboard/withdraw" },
    { icon: "solar:arrow-left-down-bold", label: "Cash Out", href: "/dashboard/cash-out" },
    { icon: "solar:history-bold", label: "Transactions", href: "/dashboard/transactions" },
    { icon: "solar:user-bold", label: "Profile", href: "/dashboard/profile" },
  ],
  AGENT: [
    { icon: "solar:home-2-bold", label: "Dashboard", href: "/dashboard" },
    { icon: "solar:graph-up-bold", label: "Cash In", href: "/dashboard/cash-in" },
    { icon: "solar:history-bold", label: "My Transactions", href: "/dashboard/transactions" },
    { icon: "solar:user-bold", label: "Profile", href: "/dashboard/profile" },
  ],
  ADMIN: [
    { icon: "solar:home-2-bold", label: "Dashboard", href: "/dashboard" },
    { icon: "solar:users-group-two-rounded-bold", label: "Manage Users", href: "/dashboard/users" },
    { icon: "solar:user-check-rounded-bold", label: "Manage Agents", href: "/dashboard/agents" },
    { icon: "solar:history-bold", label: "All Transactions", href: "/dashboard/transactions" },
    { icon: "solar:settings-bold", label: "System Settings", href: "/dashboard/settings" },
    { icon: "solar:shield-check-bold", label: "Security", href: "/dashboard/security" },
  ],
}

const roleColors = {
  USER: "bg-blue-100 text-blue-800",
  AGENT: "bg-green-100 text-green-800",
  ADMIN: "bg-purple-100 text-purple-800",
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useAuth()
  const location = useLocation()
  
  // Hide sidebar on dashboard route and form routes
  const hideSidebarRoutes = ['/dashboard', '/dashboard/send', '/dashboard/add-money', '/dashboard/withdraw', '/dashboard/cash-out']
  const isDashboardRoute = hideSidebarRoutes.includes(location.pathname)

  if (!user) {
    return null; // This should not happen as ProtectedRoute should handle this
  }

  const currentNavItems = navigationItems[user.role]
  const displayName = user.name || user.email?.split('@')[0] || 'User'
  const displayPhone = user.phoneNumber || user.email || 'No phone'
  const displayRole = user.role


  const Sidebar = ({ className = "" }: { className?: string }) => (
    <div className={`flex flex-col h-full bg-card border-r border-border ${className}`}>
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
            <Icon icon="solar:wallet-money-bold" className="w-12 h-12 text-primary-foreground" />
          </div>
          <span className="font-bold text-2xl">E-Wallet MFS</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {currentNavItems.map((item) => (
          <Link key={item.href} to={item.href}>
            <Button
              variant="ghost"
              className="w-full justify-start gap-4 h-14 text-lg font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              <Icon icon={item.icon} className="w-12 h-12" />
              {item.label}
            </Button>
          </Link>
        ))}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="bg-primary text-primary-foreground text-lg">
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold truncate">{displayName}</p>
            <p className="text-sm text-muted-foreground truncate">{displayPhone}</p>
          </div>
        </div>
        <Badge className={`w-full justify-center text-base py-2 ${roleColors[displayRole]}`}>
          {displayRole.charAt(0).toUpperCase() + displayRole.slice(1)}
        </Badge>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar - Hide on dashboard route */}
      {!isDashboardRoute && (
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <Sidebar />
        </div>
      )}

      {/* Mobile Sidebar */}
      {!isDashboardRoute && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 w-72">
            <Sidebar />
          </SheetContent>
        </Sheet>
      )}

      {/* Main Content */}
      <div className={isDashboardRoute ? "" : "lg:pl-72"}>
        {/* Header - Hide on dashboard route */}
        {!isDashboardRoute && (
          <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 bg-card px-4 sm:gap-x-6 sm:px-6 lg:px-8 !border-none shadow-none">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                  <Icon icon="solar:hamburger-menu-bold" className="w-12 h-12" />
                  <span className="sr-only">Open sidebar</span>
                </Button>
              </SheetTrigger>
            </Sheet>
          </header>
        )}

        {/* Page Content */}
        <main className={isDashboardRoute ? "" : "ml-12"}>
          <div className="">{children}</div>
        </main>
      </div>
    </div>
  )
}
