"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  pageIndex: number
  pageSize: number
  totalCount?: number
  totalPages?: number
  onPageChange: (page: number) => void
  disabled?: boolean
  className?: string
}

export const Pagination = ({
  pageIndex,
  pageSize,
  totalCount,
  totalPages,
  onPageChange,
  disabled = false,
  className = "",
}: PaginationProps) => {
  const hasNextPage = totalPages ? pageIndex < totalPages : true
  const hasPreviousPage = pageIndex > 1

  const handlePrevious = () => {
    if (hasPreviousPage && !disabled) {
      onPageChange(Math.max(pageIndex - 1, 1))
    }
  }

  const handleNext = () => {
    if (hasNextPage && !disabled) {
      onPageChange(pageIndex + 1)
    }
  }

  return (
    <div className={`flex items-center justify-center gap-2 sm:gap-4 mt-4 sm:mt-6 px-2 sm:px-0 ${className}`}>
      <Button
        variant="outline"
        disabled={!hasPreviousPage || disabled}
        onClick={handlePrevious}
        className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 min-h-[44px] text-sm font-medium text-gray-700 border border-purple-200 rounded-lg hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="h-4 w-4" />
        Voltar
      </Button>

      <div className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 min-h-[44px] text-sm font-medium text-purple-700 border border-purple-200 rounded-lg bg-purple-50">
        Página {pageIndex}
        {totalPages && (
          <span className="text-purple-500 ml-1">de {totalPages}</span>
        )}
      </div>

      <Button
        variant="outline"
        disabled={!hasNextPage || disabled}
        onClick={handleNext}
        className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 min-h-[44px] text-sm font-medium text-gray-700 border border-purple-200 rounded-lg hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        Próxima
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

