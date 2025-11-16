import type React from "react"

import { useState } from "react"
import { Button } from "../../ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar"
import { Badge } from "../../ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "../../ui/sheet"
import {
  Home,
  CreditCard,
  Send,
  History,
  User,
  Users,
  Settings,
  Menu,
  Wallet,
  TrendingUp,
  Shield,
  UserCheck,
  ArrowDownLeft,
  ArrowDownRight,
} from "lucide-react"
import { Link } from "react-router-dom"
import { useAuth } from "../../../redux/features/auth/auth.api"

interface DashboardLayoutProps {
  children: React.ReactNode
}

const navigationItems = {
  USER: [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: Send, label: "Send Money", href: "/dashboard/send" },
    { icon: CreditCard, label: "Add Money", href: "/dashboard/add-money" },
    { icon: ArrowDownRight, label: "Withdraw Money", href: "/dashboard/withdraw" },
    { icon: ArrowDownLeft, label: "Cash Out", href: "/dashboard/cash-out" },
    { icon: History, label: "Transactions", href: "/dashboard/transactions" },
    { icon: User, label: "Profile", href: "/dashboard/profile" },
  ],
  AGENT: [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: TrendingUp, label: "Cash In", href: "/dashboard/cash-in" },
    { icon: History, label: "My Transactions", href: "/dashboard/transactions" },
    { icon: User, label: "Profile", href: "/dashboard/profile" },
  ],
  ADMIN: [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: Users, label: "Manage Users", href: "/dashboard/users" },
    { icon: UserCheck, label: "Manage Agents", href: "/dashboard/agents" },
    { icon: History, label: "All Transactions", href: "/dashboard/transactions" },
    { icon: Settings, label: "System Settings", href: "/dashboard/settings" },
    { icon: Shield, label: "Security", href: "/dashboard/security" },
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
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Wallet className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg">E-Wallet MFS</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {currentNavItems.map((item) => (
          <Link key={item.href} to={item.href}>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-11 text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Button>
          </Link>
        ))}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{displayName}</p>
            <p className="text-xs text-muted-foreground truncate">{displayPhone}</p>
          </div>
        </div>
        <Badge className={`w-full justify-center ${roleColors[displayRole]}`}>
          {displayRole.charAt(0).toUpperCase() + displayRole.slice(1)}
        </Badge>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-72">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4  bg-card px-4  sm:gap-x-6 sm:px-6 lg:px-8">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu className="w-5 h-5" />
                <span className="sr-only">Open sidebar</span>
              </Button>
            </SheetTrigger>
          </Sheet>
        </header>

        {/* Page Content */}
        <main className="ml-12">
          <div className="">{children}</div>
        </main>
      </div>
    </div>
  )
}
