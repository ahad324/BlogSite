function Pagination({ currentPage, totalPages, onPageChange }) {
  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="flex justify-center items-center space-x-4 mt-10">
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="bg-gray-700 text-gray-200 font-semibold py-3 px-6 rounded-xl hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
        aria-label="Previous page"
      >
        Previous
      </button>
      <span className="text-gray-400 font-medium" aria-live="polite">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="bg-gray-700 text-gray-200 font-semibold py-3 px-6 rounded-xl hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
