
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface VoiceToTextProps {
  onTranscript: (text: string) => void;
  language?: string;
  placeholder?: string;
  className?: string;
}

const VoiceToText: React.FC<VoiceToTextProps> = ({ 
  onTranscript, 
  language = 'en-US', 
  placeholder = 'Click to start voice input',
  className = ''
}) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if browser supports Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      
      // Configure recognition settings
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = language === 'bengali' ? 'bn-BD' : 'en-US';
      
      recognitionInstance.onstart = () => {
        setIsListening(true);
        toast({ title: 'Voice input started', description: 'Speak now...' });
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      recognitionInstance.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        if (finalTranscript) {
          onTranscript(finalTranscript);
          toast({ 
            title: 'Voice input captured', 
            description: finalTranscript.substring(0, 50) + (finalTranscript.length > 50 ? '...' : '')
          });
        }
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        let errorMessage = 'Voice input error occurred';
        switch (event.error) {
          case 'network':
            errorMessage = 'Network error - check your internet connection';
            break;
          case 'not-allowed':
            errorMessage = 'Microphone permission denied';
            break;
          case 'no-speech':
            errorMessage = 'No speech detected';
            break;
          default:
            errorMessage = `Voice input error: ${event.error}`;
        }
        
        toast({ 
          title: 'Voice Input Error', 
          description: errorMessage,
          variant: 'destructive'
        });
      };
      
      setRecognition(recognitionInstance);
      setIsSupported(true);
    } else {
      setIsSupported(false);
      console.warn('Speech Recognition not supported in this browser');
    }
  }, [language, onTranscript]);

  const startListening = () => {
    if (recognition && !isListening) {
      try {
        recognition.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
        toast({ 
          title: 'Error', 
          description: 'Could not start voice input',
          variant: 'destructive'
        });
      }
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Text-to-Speech functionality
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'bengali' ? 'bn-BD' : 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      speechSynthesis.speak(utterance);
      toast({ title: 'Speaking text...', description: text.substring(0, 30) + '...' });
    } else {
      toast({ 
        title: 'Text-to-Speech not supported', 
        description: 'Your browser does not support text-to-speech',
        variant: 'destructive'
      });
    }
  };

  if (!isSupported) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Button 
          variant="outline" 
          size="sm" 
          disabled
          className="opacity-50"
        >
          <MicOff className="h-4 w-4 mr-2" />
          Voice not supported
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Button
        variant={isListening ? "destructive" : "outline"}
        size="sm"
        onClick={toggleListening}
        className={`transition-all duration-200 ${isListening ? 'animate-pulse' : ''}`}
      >
        {isListening ? (
          <>
            <MicOff className="h-4 w-4 mr-2" />
            Stop
          </>
        ) : (
          <>
            <Mic className="h-4 w-4 mr-2" />
            Voice Input
          </>
        )}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => speakText(placeholder)}
        title="Test text-to-speech"
      >
        <Volume2 className="h-4 w-4" />
      </Button>
      
      {isListening && (
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-red-600 font-medium">Listening...</span>
        </div>
      )}
    </div>
  );
};

export default VoiceToText;
