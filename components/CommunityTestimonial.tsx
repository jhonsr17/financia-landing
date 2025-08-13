'use client'

export const CommunityTestimonial = () => {
  const avatars = [
    { name: "Maria", color: "bg-pink-400" },
    { name: "Carlos", color: "bg-blue-400" },
    { name: "Ana", color: "bg-purple-400" },
    { name: "Luis", color: "bg-green-400" }
  ]

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Avatars */}
      <div className="flex -space-x-2">
        {avatars.map((avatar, index) => (
          <div
            key={index}
            className={`w-12 h-12 ${avatar.color} rounded-full border-3 border-white flex items-center justify-center text-white font-semibold text-sm shadow-lg`}
          >
            {avatar.name.charAt(0)}
          </div>
        ))}
      </div>

      {/* Testimonial Text */}
      <div className="text-center">
        <p className="text-[#0D1D35] font-bold text-lg">
          ¡Ya somos 60! La comunidad de FinancIA crece en Colombia y Argentina.
        </p>
      </div>
    </div>
  )
}
