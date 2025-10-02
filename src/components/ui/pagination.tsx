import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}) => {
  // Always show first and last page
  // Show 2 pages before and after current page
  // Use ellipsis for gaps

  const renderPageNumbers = () => {
    const pages = [];
    
    // Always add page 1
    pages.push(
      <PaginationButton 
        key={1} 
        page={1} 
        isActive={currentPage === 1} 
        onClick={() => onPageChange(1)}
      />
    );

    // Calculate range of pages to show
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    // Adjust to show at least 3 pages if possible
    if (endPage - startPage < 2) {
      if (startPage === 2) {
        endPage = Math.min(4, totalPages - 1);
      } else if (endPage === totalPages - 1) {
        startPage = Math.max(2, totalPages - 3);
      }
    }

    // Add ellipsis after page 1 if needed
    if (startPage > 2) {
      pages.push(
        <PaginationEllipsis key="ellipsis-start" />
      );
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationButton 
          key={i} 
          page={i} 
          isActive={currentPage === i} 
          onClick={() => onPageChange(i)}
        />
      );
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pages.push(
        <PaginationEllipsis key="ellipsis-end" />
      );
    }

    // Always add last page if there's more than one page
    if (totalPages > 1) {
      pages.push(
        <PaginationButton 
          key={totalPages} 
          page={totalPages} 
          isActive={currentPage === totalPages} 
          onClick={() => onPageChange(totalPages)}
        />
      );
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <nav className={cn("flex items-center justify-center space-x-2", className)}>
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-md border border-input",
          "transition-colors hover:bg-accent hover:text-accent-foreground",
          currentPage === 1 && "opacity-50 cursor-not-allowed"
        )}
        aria-label="Go to previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      
      <div className="flex items-center space-x-2">
        {renderPageNumbers()}
      </div>
      
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-md border border-input",
          "transition-colors hover:bg-accent hover:text-accent-foreground",
          currentPage === totalPages && "opacity-50 cursor-not-allowed"
        )}
        aria-label="Go to next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
};

interface PaginationButtonProps {
  page: number;
  isActive: boolean;
  onClick: () => void;
}

const PaginationButton: React.FC<PaginationButtonProps> = ({ page, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex h-9 min-w-9 items-center justify-center rounded-md border border-input px-3",
        "transition-colors",
        isActive
          ? "bg-primary text-primary-foreground border-primary"
          : "hover:bg-accent hover:text-accent-foreground"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {page}
    </button>
  );
};

const PaginationEllipsis: React.FC = () => {
  return (
    <div className="flex h-9 w-9 items-center justify-center">
      <MoreHorizontal className="h-4 w-4" />
    </div>
  );
};
