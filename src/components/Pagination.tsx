import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div id="pagination-controls" className="flex items-center justify-center gap-2 mt-10 mb-8">
      {/* Previous Button */}
      <button
        id="pagination-prev-btn"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center transition-all ${
          currentPage === 1
            ? 'opacity-40 cursor-not-allowed text-slate-300'
            : 'bg-white text-slate-500 hover:text-[#c084fc] hover:border-[#c084fc] shadow-xs cursor-pointer'
        }`}
        title="Trang trước"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {pages.map((p) => {
          const isActive = p === currentPage;
          return (
            <button
              key={p}
              id={`pagination-page-${p}`}
              onClick={() => onPageChange(p)}
              className={`w-10 h-10 rounded-xl text-sm transition-all flex items-center justify-center ${
                isActive
                  ? 'bg-[#c084fc] text-white font-bold shadow-md shadow-purple-200'
                  : 'bg-white border border-slate-200 text-slate-600 font-semibold hover:border-[#c084fc] hover:text-[#c084fc] shadow-xs cursor-pointer'
              }`}
            >
              {p}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        id="pagination-next-btn"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center transition-all ${
          currentPage === totalPages
            ? 'opacity-40 cursor-not-allowed text-slate-300'
            : 'bg-white text-slate-500 hover:text-[#c084fc] hover:border-[#c084fc] shadow-xs cursor-pointer'
        }`}
        title="Trang tiếp theo"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
