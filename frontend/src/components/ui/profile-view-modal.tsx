import { User, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ProfileViewModalProps {
  isOpen: boolean
  onClose: () => void
  profileData: {
    name: string
    email: string
    phone: string
    profileImage: string | null
  }
}

export function ProfileViewModal({ isOpen, onClose, profileData }: ProfileViewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">Profile View</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 p-4">
          {/* Profile Image Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
              {profileData.profileImage ? (
                <img 
                  src={profileData.profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-slate-400" />
              )}
            </div>
          </div>

          {/* User Information - Read Only */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Name</label>
              <div className="mt-1 p-3 bg-gray-50 rounded-lg border">
                {profileData.name || 'Not provided'}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <div className="mt-1 p-3 bg-gray-50 rounded-lg border">
                {profileData.email || 'Not provided'}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Phone</label>
              <div className="mt-1 p-3 bg-gray-50 rounded-lg border">
                {profileData.phone || 'Not provided'}
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-center pt-4">
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}