import { 
  BarChart3, Users, Package, FileText, CreditCard, 
  Settings, HelpCircle, User 
} from "lucide-react"

export const mainNavItems = [
  { title: "Dashboard", url: "/dashboard", icon: BarChart3 },
  { title: "Users", url: "/users", icon: Users },
  { title: "Shipments", url: "/shipments", icon: Package },
  { title: "Orders", url: "/orders", icon: FileText },
  { title: "Fleet management", url: "/fleet", icon: Package },
  { title: "Vendors", url: "/vendors", icon: Users },
  { title: "Reports & analytics", url: "/reports", icon: BarChart3 },
  { title: "Billing & payments", url: "/billing", icon: CreditCard },
  { title: "Security", url: "/security", icon: Settings },
  { title: "Preferences", url: "/preferences", icon: Settings },
]

export const bottomNavItems = [
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "User Management", url: "/user-management", icon: User },
  { title: "Help & support", url: "/help", icon: HelpCircle },
]