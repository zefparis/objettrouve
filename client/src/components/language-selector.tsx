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

// Test emoji support
const testEmoji = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return false;
  
  const testFlag = '🇫🇷';
  ctx.fillText(testFlag, 0, 0);
  
  return canvas.toDataURL().length > 6000; // Simple emoji support test
};

const FlagIcon = ({ emoji, fallback, className = "" }: { emoji: string; fallback: string; className?: string }) => {
  const [showEmoji, setShowEmoji] = useState(true);
  
  useEffect(() => {
    // Test if emoji is supported
    const supportsEmoji = testEmoji();
    setShowEmoji(supportsEmoji);
  }, []);
  
  if (!showEmoji) {
    return (
      <span className={`inline-flex items-center justify-center ${className} bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-bold rounded px-1`}>
        {fallback}
      </span>
    );
  }
  
  return (
    <span className={`inline-flex items-center justify-center ${className}`}>
      <span 
        className="text-base select-none" 
        style={{ 
          fontFamily: 'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, system-ui',
          fontSize: '16px',
          lineHeight: '1',
          WebkitFontSmoothing: 'antialiased'
        }}
      >
        {emoji}
      </span>
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
            emoji={currentLanguage.emoji}
            fallback={currentLanguage.flag}
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
              emoji={language.emoji}
              fallback={language.flag}
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