import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Simple decryption function
const decryptData = (encryptedData: string): string => {
  try {
    return atob(encryptedData)
  } catch {
    return ''
  }
}

export function LayoutHeader() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profileData, setProfileData] = useState<{name: string, email: string, profileImage: string | null}>({ 
    name: '', 
    email: '', 
    profileImage: null 
  });

  // Load profile data from localStorage
  useEffect(() => {
    const loadProfile = () => {
      const savedData = localStorage.getItem('userProfile')
      if (savedData) {
        try {
          const decryptedData = decryptData(savedData)
          const parsedData = JSON.parse(decryptedData)
          setProfileData({
            name: parsedData.userInfo?.name || user?.name || 'User',
            email: parsedData.userInfo?.email || user?.email || 'user@example.com',
            profileImage: parsedData.profileImage || null
          })
        } catch (error) {
          console.error('Error loading profile:', error)
          setProfileData({
            name: user?.name || 'User',
            email: user?.email || 'user@example.com',
            profileImage: null
          })
        }
      } else {
        setProfileData({
          name: user?.name || 'User',
          email: user?.email || 'user@example.com',
          profileImage: null
        })
      }
    }
    
    loadProfile()
    
    // Listen for profile updates
    const handleStorageChange = () => loadProfile()
    const handleProfileUpdate = () => loadProfile()
    
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('profileUpdated', handleProfileUpdate)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('profileUpdated', handleProfileUpdate)
    }
  }, [user])

  const handleLogout = () => {
    console.log('Logging out...');
    // Clear user data and navigate to login
    logout();
    navigate('/');
  };

  const firstName = profileData.name?.split(' ')[0] || 'User';

  return (
    <div className="flex h-20 items-center justify-end gap-2 border-b border-slate-200/60 bg-white/50 backdrop-blur-sm px-6">
      {/* User Profile Dropdown */}
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 px-4 py-2 h-10 hover:bg-slate-50 border-slate-200 transition-all duration-200 hover:border-slate-300"
            >
              <User className="w-4 h-4" />
              <span className="font-medium">{firstName}</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{profileData.name || 'User'}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {profileData.email || 'user@example.com'}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Custom Avatar with Profile Image or First Letter */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg overflow-hidden border-2 border-white">
          {profileData.profileImage ? (
            <img 
              src={profileData.profileImage} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          ) : (
            firstName.charAt(0).toUpperCase()
          )}
        </div>
      </div>
    </div>
  );
}
