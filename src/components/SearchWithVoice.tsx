
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import VoiceToText from './VoiceToText';
import { useSettings } from '@/contexts/SettingsContext';

interface SearchWithVoiceProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchWithVoice: React.FC<SearchWithVoiceProps> = ({
  value,
  onChange,
  placeholder,
  className = ''
}) => {
  const { t, language } = useSettings();

  const handleVoiceTranscript = (transcript: string) => {
    onChange(transcript);
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Input
        type="text"
        placeholder={placeholder || t('search')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1"
      />
      <VoiceToText
        onTranscript={handleVoiceTranscript}
        language={language}
        placeholder={placeholder || t('search')}
      />
    </div>
  );
};

export default SearchWithVoice;
