import { BarChart3, Users, Package, User } from "lucide-react"
import { useNavigate, useLocation } from 'react-router'
import { useState, useEffect } from 'react'

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
  
} from "@/components/ui/sidebar"
import { ProfileEditModal } from "@/components/ui/profile-edit-modal"

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

// Simple encryption/decryption functions
const encryptData = (data: string): string => {
  try {
    return btoa(data)
  } catch {
    return ''
  }
}

const decryptData = (encryptedData: string): string => {
  try {
    return atob(encryptedData)
  } catch {
    return ''
  }
}

export function AppSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false)
  const [userProfile, setUserProfile] = useState<{name: string, email: string, phone: string, profileImage: string | null}>({ 
    name: '', 
    email: '', 
    phone: '', 
    profileImage: null 
  })

  // Load user profile data
  useEffect(() => {
    const loadProfile = () => {
      const savedData = localStorage.getItem('userProfile')
      if (savedData) {
        try {
          const decryptedData = decryptData(savedData)
          const parsedData = JSON.parse(decryptedData)
          setUserProfile({
            name: parsedData.userInfo?.name || '',
            email: parsedData.userInfo?.email || '',
            phone: parsedData.userInfo?.phone || '',
            profileImage: parsedData.profileImage || null
          })
        } catch (error) {
          console.error('Error loading profile:', error)
        }
      }
    }
    
    loadProfile()
    
    // Listen for profile updates
    const handleStorageChange = () => loadProfile()
    window.addEventListener('storage', handleStorageChange)
    
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Handle profile save
  const handleProfileSave = (updatedData: { phone: string; profileImage: string | null }) => {
    const currentData = localStorage.getItem('userProfile')
    if (currentData) {
      try {
        const decryptedData = decryptData(currentData)
        const parsedData = JSON.parse(decryptedData)
        
        const updatedProfile = {
          ...parsedData,
          userInfo: {
            ...parsedData.userInfo,
            phone: updatedData.phone
          },
          profileImage: updatedData.profileImage
        }
        
        const encryptedData = encryptData(JSON.stringify(updatedProfile))
        localStorage.setItem('userProfile', encryptedData)
        
        // Dispatch custom event for real-time sync
        window.dispatchEvent(new Event('profileUpdated'))
        
        setUserProfile(prev => ({
          ...prev,
          phone: updatedData.phone,
          profileImage: updatedData.profileImage
        }))
      } catch (error) {
        console.error('Error saving profile:', error)
      }
    }
  }
  
  return (
    <Sidebar className="border-r-0" collapsible="icon">
      <SidebarContent className="bg-black text-white">
        <SidebarHeader className="p-4">
          <div className="flex items-center justify-center">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <div className="w-5 h-5 bg-black rounded-lg flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-white rounded-sm"></div>
              </div>
            </div>
          </div>
        </SidebarHeader>

        {/* Navigation Menu */}
        <SidebarGroup className="flex-1 p-0">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-3 px-3 py-6">
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
                        w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 group
                        hover:bg-white hover:scale-105
                        ${isActive 
                          ? 'bg-white text-black shadow-lg' 
                          : 'text-white hover:text-black'
                        }
                      `}
                      tooltip={item.title}
                    >
                      <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? '' : 'group-hover:scale-110'}`} />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Footer with user profile - View Only */}
        <SidebarFooter className="p-4">
          <SidebarMenuButton 
            onClick={() => setIsProfileEditOpen(true)}
            className="w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 hover:bg-white hover:scale-105 text-white hover:text-black cursor-pointer group"
            tooltip={userProfile.name || 'Edit Profile'}
          >
            <div className="w-8 h-8 bg-gray-700 rounded-xl flex items-center justify-center overflow-hidden border-2 border-gray-600 group-hover:border-black">
              {userProfile.profileImage ? (
                <img 
                  src={userProfile.profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-4 h-4 text-gray-300 group-hover:text-black" />
              )}
            </div>
          </SidebarMenuButton>
        </SidebarFooter>
      </SidebarContent>
      
      {/* Profile Edit Modal */}
      <ProfileEditModal 
        isOpen={isProfileEditOpen} 
        onClose={() => setIsProfileEditOpen(false)}
        profileData={userProfile}
        onSave={handleProfileSave}
      />
    </Sidebar>
  )
}