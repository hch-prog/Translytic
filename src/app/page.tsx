"use client";
import "regenerator-runtime/runtime";
import React, { useState, ChangeEvent, useEffect } from "react";
import {
  IconCopy,
  IconStar,
  IconVolume,
  IconArrowsExchange,
  IconBrandGithub,
  IconLanguage,
  IconSparkles,
  IconArrowRight,
} from "@tabler/icons-react";
import SpeechRecognitionComponent from "@/components/SpeechRecognition/SpeechRecognition";
import TextArea from "@/components/Inputs/TextArea";
import FileUpload from "@/components/Inputs/FileUpload";
import LanguageSelector from "@/components/Inputs/LanguageSelector";
import useTranslate from "@/hooks/useTranslate";
import { rtfToText } from "@/utils/rtfToText";
import SvgDecorations from "@/components/SvgDecorations";
import CategoryLinks from "@/components/categoryLinks";

const Home: React.FC = () => {
  const [sourceText, setSourceText] = useState<string>("");
  const [debouncedText, setDebouncedText] = useState<string>(sourceText);
  const [copied, setCopied] = useState<boolean>(false);
  const [favorite, setFavorite] = useState<boolean>(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [showFeatures, setShowFeatures] = useState<boolean>(true);

  const [languages] = useState<string[]>([
    "English",
    "Spanish",
    "French",
    "German",
    "Hindi",
    "Chinese",
    "Japanese",
    "Korean",
    "Arabic",
    "Russian"
  ]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("English");

  const targetText = useTranslate(debouncedText, selectedLanguage);

  useEffect(() => {
    const loadVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (sourceText.trim()) {
        setIsTranslating(true);
        setDebouncedText(sourceText);
        setTimeout(() => setIsTranslating(false), 1000);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [sourceText]);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const rtfContent = reader.result as string;
        const text = rtfToText(rtfContent);
        setSourceText(text);
      };
      reader.readAsText(file);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(targetText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFavorite = () => {
    setFavorite(!favorite);
    if (!favorite) {
      localStorage.setItem("favoriteTranslation", targetText);
    } else {
      localStorage.removeItem("favoriteTranslation");
    }
  };

  const handleAudioPlayback = (text: string, language?: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    
    const languageMap: { [key: string]: string } = {
      'English': 'en',
      'Spanish': 'es',
      'French': 'fr',
      'German': 'de',
      'Hindi': 'hi',
      'Chinese': 'zh',
      'Japanese': 'ja',
      'Korean': 'ko',
      'Arabic': 'ar',
      'Russian': 'ru'
    };

    if (language && languageMap[language]) {
      const voice = voices.find(v => v.lang.startsWith(languageMap[language]));
      if (voice) {
        utterance.voice = voice;
      }
      utterance.lang = languageMap[language];
    }

    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-950 to-neutral-900 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-500/10 via-neutral-900/0 to-purple-500/10"></div>
      <SvgDecorations />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="text-center mb-12 space-y-4">
          <div className="inline-block">
            <h1 className="text-4xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-600 inline-flex items-center gap-3">
              Translytic
              <IconSparkles className="w-8 h-8 text-green-400 animate-pulse" />
            </h1>
          </div>
          <p className="text-neutral-400 max-w-2xl mx-auto text-lg">
            Break language barriers effortlessly with AI-powered precision translation
          </p>
          
          {/* Feature Pills */}
          {showFeatures && (
            <div className="flex flex-wrap justify-center gap-2 mt-4 transition-all duration-500 ease-in-out">
              <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-sm border border-green-500/20">
                AI Powered
              </span>
              <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm border border-blue-500/20">
                Real-time Translation
              </span>
              <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-sm border border-purple-500/20">
                Voice Support
              </span>
            </div>
          )}
        </header>

        {/* Main translation interface */}
        <div className="grid gap-6 lg:grid-cols-2 max-w-6xl mx-auto relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-green-500/20 rounded-full">
            <IconArrowRight className="w-12 h-12 text-green-500/50 animate-pulse" />
          </div>

          {/* Source Panel */}
          <div className="transform transition-all duration-300 hover:scale-[1.02]">
            <div className="bg-neutral-800/50 backdrop-blur-xl rounded-xl p-6 border border-neutral-700/50 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <IconLanguage className="w-5 h-5 text-neutral-400" />
                  <h2 className="text-sm font-medium text-neutral-300">Source Text</h2>
                </div>
                <div className="flex items-center space-x-3">
                  <SpeechRecognitionComponent setSourceText={setSourceText} />
                  <FileUpload handleFileUpload={handleFileUpload} />
                </div>
              </div>
              
              <TextArea
                id="source-language"
                value={sourceText}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setSourceText(e.target.value)}
                placeholder="Enter text to translate..."
              />
              
              <div className="flex justify-between items-center mt-3">
                <IconVolume
                  size={20}
                  className="text-neutral-400 hover:text-green-500 transition-colors cursor-pointer"
                  onClick={() => handleAudioPlayback(sourceText)}
                />
                <span className="text-xs text-neutral-400">
                  {sourceText.length} / 2000
                </span>
              </div>
            </div>
          </div>

          {/* Target Panel */}
          <div className="transform transition-all duration-300 hover:scale-[1.02]">
            <div className="bg-neutral-800/50 backdrop-blur-xl rounded-xl p-6 border border-neutral-700/50 shadow-xl relative">
              {isTranslating && (
                <div className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                </div>
              )}
              
              <div className="flex justify-between items-center mb-4">
                <LanguageSelector
                  selectedLanguage={selectedLanguage}
                  setSelectedLanguage={setSelectedLanguage}
                  languages={languages}
                />
                <div className="flex items-center space-x-3">
                  <IconStar
                    size={20}
                    className={`cursor-pointer transition-colors ${
                      favorite ? "text-yellow-400" : "text-neutral-400 hover:text-yellow-400"
                    }`}
                    onClick={handleFavorite}
                    stroke={1.5}
                  />
                  <div className="relative">
                    <IconCopy
                      size={20}
                      className="text-neutral-400 hover:text-green-500 transition-colors cursor-pointer"
                      onClick={handleCopyToClipboard}
                      stroke={1.5}
                    />
                    {copied && (
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-green-500 bg-neutral-900 px-2 py-1 rounded animate-fade-up">
                        Copied!
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <TextArea
                id="target-language"
                value={targetText}
                onChange={() => {}}
                placeholder="Translation will appear here..."
              />
              
              <div className="flex justify-between items-center mt-3">
                <IconVolume
                  size={20}
                  className="text-neutral-400 hover:text-green-500 transition-colors cursor-pointer"
                  onClick={() => handleAudioPlayback(targetText, selectedLanguage)}
                />
                <span className="text-xs text-neutral-400">
                  {targetText.length} characters
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Links */}
        <div className="mt-16">
          <CategoryLinks />
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <div className="space-y-4">
            <a
              href="https://github.com/hch-prog/translytic"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-neutral-400 hover:text-green-500 transition-colors"
            >
              <IconBrandGithub size={20} />
              <span>View on GitHub</span>
            </a>
           
          </div>
        </footer>
      </div>
    </main>
  );
};

export default Home;
