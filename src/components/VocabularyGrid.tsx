import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { VocabItem } from '../types';
import { playEnglishPronunciation } from '../utils/speech';

interface VocabularyGridProps {
  vocabulary: VocabItem[];
}

export const VocabularyGrid: React.FC<VocabularyGridProps> = ({ vocabulary }) => {
  const [playingWord, setPlayingWord] = useState<string | null>(null);

  const handleSpeak = (word: string) => {
    setPlayingWord(word);
    playEnglishPronunciation(word);
    setTimeout(() => {
      setPlayingWord(null);
    }, 1200);
  };

  return (
    <div id="vocabulary-section" className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg gradient-pastel-bg flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-4 h-4" />
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
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-100/70 text-purple-700">
          {vocabulary.length} từ vựng
        </span>
      </div>

      {/* Grid: 1 col on mobile, 2 cols on tablet, 3-4 cols on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {vocabulary.map((item) => {
          const isPlaying = playingWord === item.word;
          return (
            <div
              key={item.stt}
              id={`vocab-card-${item.stt}`}
              className="glass-card rounded-[12px] p-4 flex flex-col justify-between border border-white/80 hover:border-purple-300 relative group"
            >
              {/* Card Header: STT, Word, IPA, Audio */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center shrink-0">
                      {item.stt}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-500 uppercase tracking-wider">
                      {item.pos}
                    </span>
                  </div>

                  {/* Audio Button */}
                  <button
                    id={`audio-btn-${item.stt}`}
                    onClick={() => handleSpeak(item.word)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isPlaying
                        ? 'gradient-pastel-bg text-white scale-110 shadow-md shadow-purple-300'
                        : 'bg-purple-50 hover:bg-purple-100 text-purple-600 hover:scale-105 shadow-sm'
                    }`}
                    title="Nghe phát âm"
                  >
                    <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-pulse' : ''}`} />
                  </button>
                </div>

                {/* English Word */}
                <div className="mb-1">
                  <span className="text-lg sm:text-xl font-bold text-slate-800 group-hover:text-purple-700 transition-colors">
                    {item.word}
                  </span>
                </div>

                {/* International Phonetic Alphabet (IPA) */}
                <div className="text-xs font-medium italic text-slate-400 mb-3">
                  {item.ipa}
                </div>

                {/* Vietnamese Meaning */}
                <div className="text-sm font-semibold text-purple-900 bg-purple-50/60 px-2.5 py-1.5 rounded-lg mb-3 border border-purple-100/50">
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
