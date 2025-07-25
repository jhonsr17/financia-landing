'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface CountryCode {
  code: string
  country: string
  flag: string
}

const americanCountries: CountryCode[] = [
  { code: '+1', country: 'Estados Unidos', flag: '🇺🇸' },
  { code: '+1', country: 'Canadá', flag: '🇨🇦' },
  { code: '+52', country: 'México', flag: '🇲🇽' },
  { code: '+53', country: 'Cuba', flag: '🇨🇺' },
  { code: '+54', country: 'Argentina', flag: '🇦🇷' },
  { code: '+55', country: 'Brasil', flag: '🇧🇷' },
  { code: '+56', country: 'Chile', flag: '🇨🇱' },
  { code: '+57', country: 'Colombia', flag: '🇨🇴' },
  { code: '+58', country: 'Venezuela', flag: '🇻🇪' },
  { code: '+591', country: 'Bolivia', flag: '🇧🇴' },
  { code: '+592', country: 'Guyana', flag: '🇬🇾' },
  { code: '+593', country: 'Ecuador', flag: '🇪🇨' },
  { code: '+594', country: 'Guayana Francesa', flag: '🇬🇫' },
  { code: '+595', country: 'Paraguay', flag: '🇵🇾' },
  { code: '+596', country: 'Martinica', flag: '🇲🇶' },
  { code: '+597', country: 'Suriname', flag: '🇸🇷' },
  { code: '+598', country: 'Uruguay', flag: '🇺🇾' },
  { code: '+501', country: 'Belice', flag: '🇧🇿' },
  { code: '+502', country: 'Guatemala', flag: '🇬🇹' },
  { code: '+503', country: 'El Salvador', flag: '🇸🇻' },
  { code: '+504', country: 'Honduras', flag: '🇭🇳' },
  { code: '+505', country: 'Nicaragua', flag: '🇳🇮' },
  { code: '+506', country: 'Costa Rica', flag: '🇨🇷' },
  { code: '+507', country: 'Panamá', flag: '🇵🇦' },
  { code: '+508', country: 'San Pedro y Miquelón', flag: '🇵🇲' },
  { code: '+509', country: 'Haití', flag: '🇭🇹' },
  { code: '+590', country: 'Guadalupe', flag: '🇬🇵' },
  { code: '+1787', country: 'Puerto Rico', flag: '🇵🇷' },
  { code: '+1809', country: 'República Dominicana', flag: '🇩🇴' },
  { code: '+1876', country: 'Jamaica', flag: '🇯🇲' },
  { code: '+1784', country: 'San Vicente y las Granadinas', flag: '🇻🇨' },
  { code: '+1758', country: 'Santa Lucía', flag: '🇱🇨' },
  { code: '+1473', country: 'Granada', flag: '🇬🇩' },
  { code: '+1868', country: 'Trinidad y Tobago', flag: '🇹🇹' },
  { code: '+1767', country: 'Dominica', flag: '🇩🇲' },
  { code: '+1664', country: 'Montserrat', flag: '🇲🇸' },
  { code: '+1649', country: 'Islas Turcas y Caicos', flag: '🇹🇨' },
  { code: '+1721', country: 'Sint Maarten', flag: '🇸🇽' },
  { code: '+1246', country: 'Barbados', flag: '🇧🇧' },
  { code: '+1268', country: 'Antigua y Barbuda', flag: '🇦🇬' },
  { code: '+1284', country: 'Islas Vírgenes Británicas', flag: '🇻🇬' },
  { code: '+1340', country: 'Islas Vírgenes de EE.UU.', flag: '🇻🇮' },
]

interface CountryCodeSelectorProps {
  value: string
  onChange: (code: string) => void
  disabled?: boolean
}

const CountryCodeSelector: React.FC<CountryCodeSelectorProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const selectedCountry = americanCountries.find(country => country.code === value) || americanCountries[7] // Default to Colombia

  const handleSelect = (code: string) => {
    onChange(code)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="flex items-center space-x-2 px-3 py-3 bg-white/5 border border-white/10 rounded-l-lg text-white hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
      >
        <span className="text-lg">{selectedCountry.flag}</span>
        <span className="text-sm font-medium">{selectedCountry.code}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-80 bg-[#1A2B47] border border-white/20 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
          {americanCountries.map((country, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(country.code)}
              className="w-full flex items-center space-x-3 px-4 py-3 text-left text-white hover:bg-white/10 transition-colors"
            >
              <span className="text-lg">{country.flag}</span>
              <span className="text-sm font-medium">{country.code}</span>
              <span className="text-sm text-white/70 truncate">{country.country}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default CountryCodeSelector 