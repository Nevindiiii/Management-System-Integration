import { BarChart3, Users, Package, User } from "lucide-react"
import { useNavigate, useLocation } from 'react-router'
import { useState } from 'react'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar"
import { UserProfileModal } from "@/components/ui/user-profile-modal"

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "Users",
    url: "/users",
    icon: Users,
  },
  {
    title: "Products",
    url: "/products",
    icon: Package,
  },
]

export function AppSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  
  return (
    <Sidebar className="border-r-0" collapsible="icon">
      <SidebarContent className="bg-slate-900 text-white">
        <SidebarHeader className="p-4">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
          </div>
        </SidebarHeader>

        {/* Navigation Menu */}
        <SidebarGroup className="flex-1 p-0">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2 px-2 py-4">
              {items.map((item) => {
                const isActive = item.url === '#' ? false : 
                  (item.url === '/' ? location.pathname === '/' : location.pathname.startsWith(item.url))
                const Icon = item.icon
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={() => {
                        if (item.url !== '#') {
                          navigate(item.url)
                        }
                      }}
                      className={`
                        w-full flex items-center justify-center p-3 rounded-lg transition-all duration-200
                        hover:bg-slate-700 
                        ${isActive 
                          ? 'bg-teal-600 text-white' 
                          : 'text-slate-400 hover:text-white'
                        }
                      `}
                      tooltip={item.title}
                    >
                      <Icon className="w-5 h-5" />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Footer with user profile */}
        <SidebarFooter className="p-3">
          <SidebarMenuButton 
            onClick={() => setIsProfileModalOpen(true)}
            className="w-full flex items-center justify-center p-3 rounded-lg transition-all duration-200 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
          >
            <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
          </SidebarMenuButton>
        </SidebarFooter>
      </SidebarContent>
      
      {/* User Profile Modal */}
      <UserProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
      />
    </Sidebar>
  )
}