import { useState, useEffect } from "react"
import { User, Camera } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface UserProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

// Simple encryption/decryption functions
const encryptData = (data: string): string => {
  return btoa(data) 
}

const decryptData = (encryptedData: string): string => {
  try {
    return atob(encryptedData) 
  } catch {
    return ''
  }
}

export function UserProfileModal({ isOpen, onClose }: UserProfileModalProps) {
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: ""
  })

  // Load saved data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('userProfile')
    if (savedData) {
      try {
        const decryptedData = decryptData(savedData)
        const parsedData = JSON.parse(decryptedData)
        setUserInfo(parsedData.userInfo || { name: "", email: "", phone: "" })
        setProfileImage(parsedData.profileImage || null)
      } catch (error) {
        console.error('Error loading profile data:', error)
      }
    }
  }, [])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setUserInfo(prev => ({ ...prev, [field]: value }))
  }

  const saveProfile = () => {
    try {
      const dataToSave = {
        userInfo,
        profileImage
      }
      const encryptedData = encryptData(JSON.stringify(dataToSave))
      localStorage.setItem('userProfile', encryptedData)
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event('profileUpdated'))
      
      onClose()
    } catch (error) {
      console.error('Error saving profile data:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">User Profile</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 p-4">
          {/* Profile Image Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-slate-400" />
                )}
              </div>
              <label 
                htmlFor="profile-upload" 
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-teal-700 transition-colors"
              >
                <Camera className="w-4 h-4 text-white" />
              </label>
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                aria-label="Upload profile image"
              />
            </div>
          </div>

          {/* User Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">Name</Label>
              <Input
                id="name"
                value={userInfo.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                value={userInfo.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
              <Input
                id="phone"
                value={userInfo.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={saveProfile} className="bg-teal-600 hover:bg-teal-700">
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}