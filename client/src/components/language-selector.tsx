import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const languages = [
  { code: 'fr', name: 'Français', flag: 'FR', emoji: '🇫🇷' },
  { code: 'en', name: 'English', flag: 'GB', emoji: '🇬🇧' },
  { code: 'es', name: 'Español', flag: 'ES', emoji: '🇪🇸' },
  { code: 'pt', name: 'Português', flag: 'PT', emoji: '🇵🇹' },
  { code: 'it', name: 'Italiano', flag: 'IT', emoji: '🇮🇹' },
  { code: 'de', name: 'Deutsch', flag: 'DE', emoji: '🇩🇪' },
  { code: 'nl', name: 'Nederlands', flag: 'NL', emoji: '🇳🇱' },
  { code: 'zh', name: '中文', flag: 'CN', emoji: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: 'JP', emoji: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: 'KR', emoji: '🇰🇷' },
];

const FlagIcon = ({ countryCode, emoji, className = "" }: { countryCode: string; emoji: string; className?: string }) => {
  // Map country codes to colors for visual distinction
  const flagColors = {
    'FR': 'bg-blue-500',
    'GB': 'bg-red-500', 
    'ES': 'bg-yellow-500',
    'PT': 'bg-green-500',
    'IT': 'bg-green-600',
    'DE': 'bg-gray-800',
    'NL': 'bg-orange-500',
    'CN': 'bg-red-600',
    'JP': 'bg-red-500',
    'KR': 'bg-blue-600'
  };
  
  const bgColor = flagColors[countryCode as keyof typeof flagColors] || 'bg-gray-500';
  
  return (
    <span className={`inline-flex items-center justify-center ${className} ${bgColor} text-white text-xs font-bold rounded`}>
      {countryCode}
    </span>
  );
};

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = async (languageCode: string) => {
    await i18n.changeLanguage(languageCode);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1 sm:gap-2 h-8 px-1 sm:px-2"
        >
          <FlagIcon 
            countryCode={currentLanguage.flag}
            emoji={currentLanguage.emoji}
            className="w-8 h-5" 
          />
          <span className="hidden sm:inline text-xs sm:text-sm font-medium">{currentLanguage.name}</span>
          <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 max-h-64 overflow-y-auto">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <FlagIcon 
              countryCode={language.flag}
              emoji={language.emoji}
              className="w-8 h-5" 
            />
            <span className="text-sm font-medium">{language.name}</span>
            {language.code === i18n.language && (
              <div className="ml-auto h-2 w-2 rounded-full bg-blue-500"></div>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}