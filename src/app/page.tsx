"use client";
import "regenerator-runtime/runtime";
import React, { useState, ChangeEvent, useEffect } from "react";
import {
  IconCopy,
  IconStar,
  IconVolume,
  IconArrowsExchange,
  IconBrandGithub,
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
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const targetText = useTranslate(debouncedText, selectedLanguage);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedText(sourceText);
    }, 500);
    return () => clearTimeout(handler);
  }, [sourceText]);

  // Initialize voices
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
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-500/20 via-neutral-900/0 to-purple-500/20"></div>
      <SvgDecorations />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-600 inline-block">
            Translytic
          </h1>
          <p className="mt-4 text-neutral-400 max-w-2xl mx-auto">
            Break language barriers effortlessly with AI-powered precision translation
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2 max-w-6xl mx-auto">
          <div className="bg-neutral-800/50 backdrop-blur-xl rounded-xl p-4 border border-neutral-700/50 shadow-xl">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-medium text-neutral-300">Source Text</h2>
              <div className="flex items-center space-x-2">
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
            <div className="flex justify-between items-center mt-2">
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

          <div className="bg-neutral-800/50 backdrop-blur-xl rounded-xl p-4 border border-neutral-700/50 shadow-xl">
            <div className="flex justify-between items-center mb-3">
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
                />
                <div className="relative">
                  <IconCopy
                    size={20}
                    className="text-neutral-400 hover:text-green-500 transition-colors cursor-pointer"
                    onClick={handleCopyToClipboard}
                  />
                  {copied && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-green-500 bg-neutral-900 px-2 py-1 rounded">
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
            <div className="flex justify-between items-center mt-2">
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

        <CategoryLinks />

        <footer className="mt-16 text-center text-sm text-neutral-500">
          <a
            href="https://github.com/yourusername/translytic"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 hover:text-green-500 transition-colors"
          >
            <IconBrandGithub size={20} />
            <span>View on GitHub</span>
          </a>
        </footer>
      </div>
    </main>
  );
};

export default Home;
