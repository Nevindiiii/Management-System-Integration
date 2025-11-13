import { User, Camera, Save, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState, useRef } from "react"

interface ProfileEditModalProps {
  isOpen: boolean
  onClose: () => void
  profileData: {
    name: string
    email: string
    phone: string
    profileImage: string | null
  }
  onSave: (updatedData: { phone: string; profileImage: string | null }) => void
}

export function ProfileEditModal({ isOpen, onClose, profileData, onSave }: ProfileEditModalProps) {
  const [phone, setPhone] = useState(profileData.phone)
  const [profileImage, setProfileImage] = useState(profileData.profileImage)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    onSave({ phone, profileImage })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">Edit Profile</DialogTitle>
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
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white hover:bg-teal-700 transition-colors"
                title="Change profile picture"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
           

            <label htmlFor="profileImage" className="sr-only">
  Upload Profile Image
</label>
<input
  id="profileImage"
  ref={fileInputRef}
  type="file"
  accept="image/*"
  onChange={handleImageChange}
  className="hidden"
/>

          </div>

          {/* User Information */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Name (Read Only)</label>
              <div className="mt-1 p-3 bg-gray-100 rounded-lg border text-gray-500">
                {profileData.name || 'Not provided'}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Email (Read Only)</label>
              <div className="mt-1 p-3 bg-gray-100 rounded-lg border text-gray-500">
                {profileData.email || 'Not provided'}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Enter phone number"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-3 pt-4">
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
            <button 
              onClick={handleSave}
              className="px-6 py-2 bg-red-800 hover:bg-red-900 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}