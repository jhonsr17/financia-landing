'use client'

import { ProfessionalAvatars } from './ProfessionalAvatars'

export const CommunityStats = () => {
  return (
    <div className="flex flex-col items-center space-y-3">
      {/* Professional Avatars */}
      <ProfessionalAvatars />
      
      {/* Community Text */}
      <div className="text-center">
        <p className="text-white/80 text-sm md:text-base font-medium">
          Ya cientos de personas en Colombia y Argentina iniciaron a cambiar sus finanzas
        </p>
      </div>
    </div>
  )
}
