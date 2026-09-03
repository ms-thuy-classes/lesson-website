import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, Search, X } from 'lucide-react';
import { VocabItem } from '../types';
import { playEnglishPronunciation } from '../utils/speech';

interface VocabularyGridProps {
  vocabulary: VocabItem[];
}

export const VocabularyGrid: React.FC<VocabularyGridProps> = ({ vocabulary }) => {
  const [playingWord, setPlayingWord] = useState<string | null>(null);
  const [searchWord, setSearchWord] = useState<string>('');

  const handleSpeak = (word: string) => {
    setPlayingWord(word);
    playEnglishPronunciation(word);
    setTimeout(() => {
      setPlayingWord(null);
    }, 1200);
  };

  const filteredVocab = searchWord.trim()
    ? vocabulary.filter(
        (item) =>
          item.word.toLowerCase().includes(searchWord.toLowerCase()) ||
          item.meaning.toLowerCase().includes(searchWord.toLowerCase())
      )
    : vocabulary;

  return (
    <div id="vocabulary-section" className="mb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl gradient-brand-icon flex items-center justify-center text-white shadow-md shadow-purple-200">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
              A. Từ vựng trọng tâm (Vocabulary)
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Nhấp vào biểu tượng loa để nghe phát âm chuẩn giọng Anh-Mỹ (US)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {vocabulary.length > 8 && (
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchWord}
                onChange={(e) => setSearchWord(e.target.value)}
                placeholder="Tìm từ vựng..."
                className="pl-9 pr-7 py-1.5 text-xs rounded-full bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#c084fc] text-slate-700 w-36 sm:w-44 shadow-xs"
              />
              {searchWord && (
                <button
                  onClick={() => setSearchWord('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-100 text-[#c084fc] shrink-0">
            {filteredVocab.length}/{vocabulary.length} từ vựng
          </span>
        </div>
      </div>

      {/* Grid: 1 col on mobile, 2 cols on tablet, 3-4 cols on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredVocab.map((item) => {
          const isPlaying = playingWord === item.word;
          return (
            <div
              key={item.stt}
              id={`vocab-card-${item.stt}`}
              className="bg-white rounded-2xl p-4 flex flex-col justify-between border border-slate-100 shadow-sm hover:shadow-md hover:border-[#c084fc]/40 transition-all relative group"
            >
              {/* Card Header: STT, Word, IPA, Audio */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-purple-100 text-[#c084fc] text-xs font-bold flex items-center justify-center shrink-0">
                      {item.stt}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-500 uppercase tracking-wider">
                      {item.pos}
                    </span>
                  </div>

                  {/* Audio Button */}
                  <button
                    id={`audio-btn-${item.stt}`}
                    onClick={() => handleSpeak(item.word)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isPlaying
                        ? 'bg-gradient-to-r from-[#c084fc] to-[#f472b6] text-white scale-110 shadow-md shadow-purple-300'
                        : 'bg-purple-50 hover:bg-purple-100 text-[#c084fc] hover:scale-105 shadow-2xs'
                    }`}
                    title="Nghe phát âm"
                  >
                    <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-pulse' : ''}`} />
                  </button>
                </div>

                {/* English Word */}
                <div className="mb-1">
                  <span className="text-lg font-bold text-slate-800 group-hover:text-[#c084fc] transition-colors">
                    {item.word}
                  </span>
                </div>

                {/* International Phonetic Alphabet (IPA) */}
                <div className="text-xs font-medium italic text-slate-400 mb-3">
                  {item.ipa}
                </div>

                {/* Vietnamese Meaning */}
                <div className="text-sm font-semibold text-purple-900 bg-purple-50/70 px-2.5 py-1.5 rounded-xl mb-3 border border-purple-100/50">
                  {item.meaning}
                </div>
              </div>

              {/* Example sentence with translation */}
              <div className="pt-2 border-t border-slate-100 text-xs">
                <p className="text-slate-700 font-medium italic mb-1 leading-snug">
                  "{item.example}"
                </p>
                <p className="text-slate-400 font-normal leading-tight">
                  {item.exampleVi}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
