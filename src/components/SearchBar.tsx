import React from 'react';
import { Search, X, Tag } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedTag: string;
  onTagSelect: (tag: string) => void;
  tags: string[];
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedTag,
  onTagSelect,
  tags,
}) => {
  return (
    <div id="search-and-filters-container" className="w-full max-w-5xl mx-auto px-4 mb-8">
      {/* Search Input */}
      <div className="relative max-w-xl mx-auto mb-8">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
          <Search className="w-5 h-5 text-[#c084fc]" />
        </div>
        <input
          id="lesson-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm bài học theo tên, chủ đề, từ vựng hoặc ngữ pháp..."
          className="w-full pl-12 pr-10 py-3.5 sm:py-4 rounded-2xl bg-white border border-slate-200 shadow-xl shadow-purple-100/20 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#c084fc] text-sm sm:text-base transition-all"
        />
        {searchQuery && (
          <button
            id="clear-search-btn"
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
            title="Xóa tìm kiếm"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Tags Chips Bar */}
      <div id="tags-bar" className="flex flex-wrap items-center justify-center gap-2 mb-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 hidden sm:flex">
          <Tag className="w-3.5 h-3.5 text-[#c084fc]" />
          <span>Lớp:</span>
        </div>

        {tags.map((tag) => {
          const isSelected = selectedTag === tag;
          return (
            <button
              key={tag}
              id={`tag-btn-${tag.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => onTagSelect(tag)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-[#c084fc] text-white shadow-md shadow-purple-200 scale-105'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-[#c084fc] hover:text-[#c084fc] shadow-xs'
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
};
