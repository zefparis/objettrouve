import { useState, useRef, useEffect } from 'react';
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
  return (
    <span className={`inline-flex items-center justify-center ${className}`}>
      <span className="text-base" style={{ fontFamily: 'system-ui, emoji' }}>{emoji}</span>
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
            className="w-4 h-4" 
          />
          <span className="hidden sm:inline text-xs sm:text-sm font-medium">{currentLanguage.flag}</span>
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
              className="w-5 h-5" 
            />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{language.flag}</span>
            <span className="text-sm">{language.name}</span>
            {language.code === i18n.language && (
              <div className="ml-auto h-2 w-2 rounded-full bg-blue-500"></div>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}