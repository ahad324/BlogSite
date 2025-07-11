function LoadingSpinner() {
  return (
    <div
      className="flex justify-center items-center py-16"
      aria-label="Loading"
    >
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500"></div>
    </div>
  );
}

export default LoadingSpinner;
